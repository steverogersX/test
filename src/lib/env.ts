function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  deepgramApiKey: required("DEEPGRAM_API", process.env.DEEPGRAM_API),
};
