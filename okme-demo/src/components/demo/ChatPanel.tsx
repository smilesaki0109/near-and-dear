"use client";

import { useEffect, useRef, useState } from "react";
import { OkmeImage } from "@/components/brand";
import { SendIcon, MicIcon } from "@/components/icons";
import { findChatMessage } from "@/lib/timeline";

type Role = "ai" | "user";
type Message = { id: number; role: Role; text: string };
type ChatMode = "office" | "life";

const INITIAL_OFFICE: Message[] = [
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

const INITIAL_LIFE: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "おはようございます、Sakiさん。今日も一日、そばでサポートしますね。",
  },
  { id: 2, role: "user", text: "おはよう。今日もよろしくね" },
  {
    id: 3,
    role: "ai",
    text: "はい。仕事のことだけでなく、体調や気分、外出や学びまで、一日まるごと一緒に整えていきましょう。",
  },
];

const MOCK_REPLIES_OFFICE = [
  "なるほど、承知しました。次の予定まで25分あります。少し休憩しませんか？",
  "了解です。カレンダーを確認したところ、午後は余裕がありそうです。",
  "深呼吸を3回してみましょう。私も一緒にカウントしますね。",
  "そのタスクは、15:30の資料レビューの前に終わらせるのがおすすめです。",
  "いいですね。その調子です。水分補給も忘れずに。",
];

const MOCK_REPLIES_LIFE = [
  "いいですね。今日は少し早めに出発すると、気持ちにも余裕が生まれます。",
  "深呼吸を3回してみましょう。私も一緒にカウントしますね。",
  "少し歩くと気分が整いやすいですよ。今のペース、とても良いです。",
  "今日の英語フレーズ、ひとつだけ一緒に復習してみませんか？",
  "今日もよく頑張りましたね。できたことを一緒に振り返りましょう。",
];

const SUGGESTIONS_OFFICE = ["今日の予定は？", "疲れたかも", "おすすめの休憩は？"];
const SUGGESTIONS_LIFE = ["今日の気分は？", "少し歩きたい", "英語を学びたい"];

export function ChatPanel({
  injectedSceneId,
  mode = "office",
}: {
  /** タイムラインから連動して追記するシーンID（office/life 共通） */
  injectedSceneId?: string | null;
  /** Companion Log の文言モード */
  mode?: ChatMode;
}) {
  const isLife = mode === "life";
  const MOCK_REPLIES = isLife ? MOCK_REPLIES_LIFE : MOCK_REPLIES_OFFICE;
  const SUGGESTIONS = isLife ? SUGGESTIONS_LIFE : SUGGESTIONS_OFFICE;
  const [messages, setMessages] = useState<Message[]>(
    isLife ? INITIAL_LIFE : INITIAL_OFFICE,
  );
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
    const chatMessage = findChatMessage(injectedSceneId);
    if (!chatMessage) return;
    injected.current.add(injectedSceneId);
    setMessages((m) => [
      ...m,
      { id: Date.now() + Math.floor(Math.random() * 1000), role: "ai", text: chatMessage },
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
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-[0_10px_40px_-12px_rgba(11,31,58,0.35)]">
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
          <p className="text-sm font-semibold tracking-tight text-navy">
            OKme! Companion Log
          </p>
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-sub">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </p>
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
