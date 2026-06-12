import { Mic } from "lucide-react";

import { AuthGuard } from "@/components/auth-guard";
import { LiveTranscript } from "@/components/live-transcript";
import { LogoutButton } from "@/components/logout-button";

export default function Home() {
  return (
    <AuthGuard>
      <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background px-4 py-16">
        <div className="pointer-events-none absolute -top-40 right-1/2 size-96 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 flex w-full max-w-2xl flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
                <Mic className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Live speech-to-text powered by Deepgram.
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
          <LiveTranscript />
        </div>
      </div>
    </AuthGuard>
  );
}
