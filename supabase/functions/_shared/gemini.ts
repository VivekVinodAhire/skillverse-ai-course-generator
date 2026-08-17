// @ts-nocheck
/**
 * Centralized Gemini Client with Dual API Key Failover, Model Fallback,
 * Exponential Backoff Retries, and Structured JSON Parsing.
 */

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

export interface GeminiRequestOptions {
  prompt: string;
  systemInstruction?: string;
  responseSchema?: unknown;
}

export async function callGeminiWithFailover(options: GeminiRequestOptions): Promise<any> {
  const key1 = typeof Deno !== 'undefined' ? Deno.env.get('GEMINI_API_KEY_1') : undefined;
  const key2 = typeof Deno !== 'undefined' ? Deno.env.get('GEMINI_API_KEY_2') : undefined;

  const keys = [key1, key2].filter((key): key is string => Boolean(key && key.trim().length > 0));

  if (keys.length === 0) {
    throw new Error('Server configuration error: No Gemini API keys configured.');
  }

  const primaryModel = (typeof Deno !== 'undefined' ? Deno.env.get('GEMINI_MODEL_PRIMARY') : null) || 'gemini-3.6-flash';
  const fallbackModel = (typeof Deno !== 'undefined' ? Deno.env.get('GEMINI_MODEL_FALLBACK') : null) || 'gemini-3.5-flash';
  
  // Model failover order: Primary model across all keys -> Fallback model across all keys
  const models = [primaryModel, fallbackModel];

  let lastError: Error | null = null;

  for (let modelIndex = 0; modelIndex < models.length; modelIndex++) {
    const model = models[modelIndex];

    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      const apiKey = keys[keyIndex];

      const maxRetries = 2;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            const delayMs = Math.pow(2, attempt) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }

          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
          if (options.systemInstruction) {
            contents.push({
              role: 'user',
              parts: [{ text: `SYSTEM INSTRUCTION: ${options.systemInstruction}` }],
            });
            contents.push({
              role: 'model',
              parts: [{ text: 'Understood. I will strictly follow these instructions.' }],
            });
          }
          contents.push({
            role: 'user',
            parts: [{ text: options.prompt }],
          });

          const payload = {
            contents,
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          };

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          // Handle 404 (Model unavailable): Immediately break to try next key or fallback model
          if (response.status === 404) {
            const errText = await response.text();
            console.warn(`[Gemini 404 Warning] Model "${model}" unavailable on Key #${keyIndex + 1}: ${errText}`);
            lastError = new Error(`Gemini model "${model}" unavailable (404): ${errText}`);
            break; // Move to next key / fallback model without repeating retries for 404
          }

          // Handle 400 (Bad request): Non-retryable request error
          if (response.status === 400) {
            const errText = await response.text();
            console.error(`[Gemini 400 Error] Invalid request payload on Model "${model}": ${errText}`);
            lastError = new Error(`Gemini API 400 Bad Request: ${errText}`);
            break;
          }

          // Handle 429 / 5xx temporary server errors: Retry with backoff
          if (response.status === 429 || response.status >= 500) {
            const errText = await response.text();
            console.warn(`[Gemini Temporary Error] Key #${keyIndex + 1}, Model "${model}", Attempt ${attempt + 1} HTTP ${response.status}: ${errText}`);
            lastError = new Error(`HTTP ${response.status}: ${errText}`);
            continue; // Retry next attempt
          }

          if (!response.ok) {
            const errText = await response.text();
            console.error(`[Gemini Error] Key #${keyIndex + 1}, Model "${model}" HTTP ${response.status}: ${errText}`);
            lastError = new Error(`Gemini API error ${response.status}: ${errText}`);
            break; // Try next key/model
          }

          const data: any = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!candidateText) {
            throw new Error(`Empty candidate text returned by Gemini API for model ${model}`);
          }

          let cleanJson = candidateText.trim();
          if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          const parsed = JSON.parse(cleanJson);
          return parsed;
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`[Gemini Exception] Key #${keyIndex + 1}, Model "${model}": ${errMsg}`);
          lastError = err instanceof Error ? err : new Error(errMsg);
        }
      }
    }
  }

  throw lastError || new Error('All Gemini API keys and models (gemini-3.6-flash, gemini-3.5-flash) failed.');
}
