"use client";

import { useEffect, useRef, useState } from "react";
import { OkmeImage } from "@/components/brand";
import { SendIcon, MicIcon } from "@/components/icons";
import { timelineScenes } from "@/lib/timeline";

type Role = "ai" | "user";
type Message = { id: number; role: Role; text: string };

const INITIAL: Message[] = [
  { id: 1, role: "ai", text: "何かお手伝いできることはありますか？" },
  { id: 2, role: "user", text: "最近ちょっと疲れてるかも…" },
  {
    id: 3,
    role: "ai",
    text: "そうなんですね。最近の睡眠時間は平均6時間以下のようです。今日は早めに休むのがおすすめです。ストレッチや深呼吸も効果的ですよ。",
  },
  { id: 4, role: "user", text: "ありがとう！助かるよ" },
  { id: 5, role: "ai", text: "いつでもサポートします。一緒に頑張りましょうね。" },
];

const MOCK_REPLIES = [
  "なるほど、承知しました。次の予定まで25分あります。少し休憩しませんか？",
  "了解です。カレンダーを確認したところ、午後は余裕がありそうです。",
  "深呼吸を3回してみましょう。私も一緒にカウントしますね。",
  "そのタスクは、15:30の資料レビューの前に終わらせるのがおすすめです。",
  "いいですね。その調子です。水分補給も忘れずに。",
];

const SUGGESTIONS = ["今日の予定は？", "疲れたかも", "おすすめの休憩は？"];

export function ChatPanel({
  injectedSceneId,
}: {
  /** オフィスデモのタイムラインから連動して追記するシーンID */
  injectedSceneId?: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const replyIdx = useRef(0);
  const injected = useRef<Set<string>>(new Set());

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // タイムラインのシーンに合わせて、OKme! のメッセージをチャットへ追記する。
  // 1シーンにつき1回だけ（ループしても重複追記しない）。
  useEffect(() => {
    if (!injectedSceneId || injected.current.has(injectedSceneId)) return;
    const scene = timelineScenes.find((s) => s.id === injectedSceneId);
    if (!scene?.chatMessage) return;
    injected.current.add(injectedSceneId);
    setMessages((m) => [
      ...m,
      { id: Date.now() + Math.floor(Math.random() * 1000), role: "ai", text: scene.chatMessage! },
    ]);
  }, [injectedSceneId]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    const reply = MOCK_REPLIES[replyIdx.current % MOCK_REPLIES.length];
    replyIdx.current += 1;
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, role: "ai", text: reply }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="card flex h-full flex-col overflow-hidden rounded-2xl">
      {/* header */}
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <div className="relative">
          <OkmeImage
            src="/images/okme-character.png"
            fallback="character"
            alt="OKme!"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-navy">OKme! アシスタント</p>
          <p className="text-[11px] text-sub">オンライン</p>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} text={m.text} />
        ))}
        {typing && (
          <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-sub/50"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* suggestions */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-xs text-sub hover:border-navy/30 hover:text-navy"
          >
            {s}
          </button>
        ))}
      </div>

      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-line p-3"
      >
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sub hover:bg-bluegrey"
          aria-label="音声入力（デモ）"
        >
          <MicIcon className="h-5 w-5" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力…"
          className="min-w-0 flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink outline-none placeholder:text-sub/60 focus:border-brand-blue"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-white hover:bg-orange-strong"
          aria-label="送信"
        >
          <SendIcon className="h-[18px] w-[18px]" />
        </button>
      </form>
    </div>
  );
}

function Bubble({ role, text }: { role: Role; text: string }) {
  const isAi = role === "ai";
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
          isAi
            ? "rounded-bl-sm border border-line bg-white text-ink"
            : "rounded-br-sm bg-navy text-white"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
