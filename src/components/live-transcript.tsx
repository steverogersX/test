"use client";

import { Mic, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Status = "idle" | "connecting" | "listening" | "error";

interface DeepgramResult {
  type: string;
  is_final?: boolean;
  channel?: {
    alternatives?: { transcript?: string }[];
  };
}

const SUPPORTED_MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm"];

function getSupportedMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  return (
    SUPPORTED_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ??
    null
  );
}

export function LiveTranscript() {
  const [status, setStatus] = useState<Status>("idle");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    recorderRef.current = null;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    const socket = socketRef.current;
    if (socket) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "CloseStream" }));
      }
      socket.close();
    }
    socketRef.current = null;

    setInterimTranscript("");
    setStatus((current) => (current === "error" ? current : "idle"));
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setStatus("connecting");

    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      setError("This browser doesn't support recording audio as WebM/Opus.");
      setStatus("error");
      return;
    }

    try {
      const tokenRes = await fetch("/api/deepgram/token");
      if (!tokenRes.ok) {
        throw new Error("Failed to get a Deepgram access token");
      }
      const { accessToken } = await tokenRes.json();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const params = new URLSearchParams({
        model: "nova-3",
        smart_format: "true",
        interim_results: "true",
        punctuate: "true",
      });

      const socket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?${params.toString()}`,
        ["token", accessToken]
      );
      socketRef.current = socket;

      socket.onopen = () => {
        const recorder = new MediaRecorder(stream, { mimeType });
        recorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        recorder.start(250);
        setStatus("listening");
      };

      socket.onmessage = (event) => {
        const data: DeepgramResult = JSON.parse(event.data);
        if (data.type !== "Results") return;

        const transcript = data.channel?.alternatives?.[0]?.transcript ?? "";
        if (!transcript) return;

        if (data.is_final) {
          setFinalTranscript((prev) => `${prev} ${transcript}`.trim());
          setInterimTranscript("");
        } else {
          setInterimTranscript(transcript);
        }
      };

      socket.onerror = () => {
        setError("Connection to Deepgram failed. Please try again.");
        setStatus("error");
      };

      socket.onclose = () => {
        setStatus((current) => (current === "error" ? current : "idle"));
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const isActive = status === "listening" || status === "connecting";

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          Live Transcription
          <StatusBadge status={status} />
        </CardTitle>
        <CardDescription>
          Capture your microphone and stream it to Deepgram for real-time
          speech-to-text.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          onClick={isActive ? stop : start}
          variant={isActive ? "destructive" : "default"}
          className="w-fit"
        >
          {isActive ? (
            <>
              <Square /> Stop
            </>
          ) : (
            <>
              <Mic /> Start listening
            </>
          )}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="min-h-32 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {finalTranscript || interimTranscript ? (
            <p>
              {finalTranscript}{" "}
              <span className="text-muted-foreground">
                {interimTranscript}
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Your transcript will appear here once you start speaking...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Status }) {
  switch (status) {
    case "listening":
      return (
        <Badge className="gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-primary-foreground" />
          Listening
        </Badge>
      );
    case "connecting":
      return <Badge variant="secondary">Connecting...</Badge>;
    case "error":
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="outline">Idle</Badge>;
  }
}
