import { Mic } from "lucide-react"

export function AuthBrand() {
  return (
    <div className="mb-6 flex flex-col items-center gap-3 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
        <Mic className="size-5" />
      </div>
      <span className="font-heading text-xl font-semibold tracking-tight">
        VoiceScript
      </span>
    </div>
  )
}
