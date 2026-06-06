"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CameraIcon } from "@/components/icons";

type CamStatus = "idle" | "requesting" | "live" | "denied" | "unsupported";

export function CameraStage({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CamStatus>("idle");

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus("live");
    } catch {
      setStatus("denied");
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  const showFallback = status !== "live";

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-line bg-navy shadow-sm sm:aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[560px]">
      {/* Live camera */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          status === "live" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dummy office / city background */}
      {showFallback && <DummyBackground />}

      {/* AR HUD frame (subtle) */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <CornerBrackets />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-scan" />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 z-30">{children}</div>

      {/* Bottom control bar */}
      <div className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-center p-4">
        {status === "live" ? (
          <button
            onClick={() => {
              stop();
              setStatus("idle");
            }}
            className="pointer-events-auto rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-white"
          >
            カメラを停止
          </button>
        ) : (
          <button
            onClick={start}
            disabled={status === "requesting"}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-strong disabled:opacity-70"
          >
            <CameraIcon className="h-4 w-4" />
            {status === "requesting" ? "起動中…" : "カメラを起動"}
          </button>
        )}
      </div>

      {/* Status note */}
      {(status === "denied" || status === "unsupported") && (
        <div className="absolute left-1/2 top-3 z-40 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1.5 text-center text-[11px] text-white backdrop-blur">
          {status === "denied"
            ? "カメラを使用できません。ダミー背景で表示中です。"
            : "このブラウザはカメラ非対応です。ダミー背景で表示中です。"}
        </div>
      )}
    </div>
  );
}

function DummyBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#aebfd6] via-[#8294b3] to-[#4f5d78]" />
      <div className="absolute right-12 top-10 h-20 w-20 rounded-full bg-white/30 blur-lg" />
      {/* city skyline */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1.5 px-2 opacity-90">
        {[60, 90, 130, 80, 160, 110, 70, 140, 95, 120, 75].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}px` }}
            className="w-[7%] rounded-t bg-gradient-to-b from-[#34415f] to-[#1b2740]"
          >
            <div className="mx-auto mt-2 grid grid-cols-2 gap-1 px-1">
              {Array.from({ length: 6 }).map((_, j) => (
                <span
                  key={j}
                  className="h-1.5 w-1.5 rounded-[1px]"
                  style={{
                    background:
                      (i + j) % 3 === 0 ? "rgba(255,206,140,0.7)" : "rgba(190,210,240,0.35)",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#16213d]/70 to-transparent" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[10px] text-white/75 backdrop-blur">
        ダミー背景（オフィス / 街並み）
      </div>
    </div>
  );
}

function CornerBrackets() {
  const corner = "absolute h-7 w-7 border-white/45";
  return (
    <>
      <div className={`${corner} left-3.5 top-3.5 border-l border-t rounded-tl`} />
      <div className={`${corner} right-3.5 top-3.5 border-r border-t rounded-tr`} />
      <div className={`${corner} bottom-3.5 left-3.5 border-b border-l rounded-bl`} />
      <div className={`${corner} bottom-3.5 right-3.5 border-b border-r rounded-br`} />
    </>
  );
}
