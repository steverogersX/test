function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get deepgramApiKey(): string {
    return required("DEEPGRAM_API", process.env.DEEPGRAM_API);
  },
  get nhostSubdomain(): string {
    return required(
      "NEXT_PUBLIC_NHOST_SUBDOMAIN",
      process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN
    );
  },
  get nhostRegion(): string {
    return required(
      "NEXT_PUBLIC_NHOST_REGION",
      process.env.NEXT_PUBLIC_NHOST_REGION
    );
  },
};
