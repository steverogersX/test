import { AuthGuard } from "@/components/auth-guard";
import { LiveTranscript } from "@/components/live-transcript";
import { LogoutButton } from "@/components/logout-button";

export default function Home() {
  return (
    <AuthGuard>
      <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Live speech-to-text powered by Deepgram.
              </p>
            </div>
            <LogoutButton />
          </div>
          <LiveTranscript />
        </div>
      </div>
    </AuthGuard>
  );
}
