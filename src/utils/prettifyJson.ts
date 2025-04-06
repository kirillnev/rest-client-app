export const prettifyJson = (input: string): string | null => {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return null;
  }
};
