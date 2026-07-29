export async function fetchJson<T>(
  url: string | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Social provider returned HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchText(url: string | URL): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Social provider returned HTTP ${response.status}`);
  }

  return response.text();
}
