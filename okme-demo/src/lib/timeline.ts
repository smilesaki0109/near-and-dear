/**
 * オフィスデモ動画（download (2).mp4 / 約55秒）に同期させるARアシストのタイムライン。
 * video.currentTime（秒）に応じて、表示するシーンを切り替える。
 * すべてデモ用のモックデータ。実際の画像認識・人物特定は行わない。
 */
export type TimelineScene = {
  id:
    | "arrival"
    | "desk"
    | "meetingPrep"
    | "meeting"
    | "slides"
    | "code"
    | "wellness"
    | "summary"
    | "ending"
    | "logo";
  /** シーン開始秒 */
  start: number;
  /** シーン終了秒（参考値・表示制御は start の昇順で判定） */
  end: number;
  /** HUD上の見出し */
  title: string;
  /** OKme! の吹き出しメッセージ */
  okmeMessage: string;
  /** このシーンでチャットに追記するOKme!メッセージ（任意） */
  chatMessage?: string;
};

export const timelineScenes: TimelineScene[] = [
  {
    id: "arrival",
    start: 0,
    end: 4,
    title: "Arrival",
    okmeMessage:
      "おはようございます、Sakiさん。今日も一日、一緒に頑張りましょう。",
  },
  {
    id: "desk",
    start: 4,
    end: 8,
    title: "Desk Detection",
    okmeMessage: "デスクを確認しました。今日の予定を整理しています。",
    chatMessage: "デスクを確認し、今日の予定を整理しました。",
  },
  {
    id: "meetingPrep",
    start: 8,
    end: 14,
    title: "Meeting Preparation",
    okmeMessage:
      "このあと10分後に会議があります。前回の内容を整理しておきました。",
    chatMessage: "10分後の会議に向けて、前回メモと論点をまとめました。",
  },
  {
    id: "meeting",
    start: 14,
    end: 22,
    title: "Meeting Assist",
    okmeMessage: "会議内容を整理しています。重要なポイントを記録します。",
    chatMessage: "会議の要点とアクションアイテムを記録しました。",
  },
  {
    id: "slides",
    start: 22,
    end: 30,
    title: "Slide Review",
    okmeMessage:
      "資料を確認しました。売上を5倍に成長させるための改善案をいくつか用意しました。なぜ実現できるのか、そのストーリーまで一緒に整理していきましょう。",
    chatMessage: "資料の改善案を2つ作成しました（提案A / 提案B）。",
  },
  {
    id: "code",
    start: 30,
    end: 36,
    title: "Code Assist",
    okmeMessage:
      "APIレスポンスの不整合を検出しました。修正候補を準備しています。",
    chatMessage: "APIレスポンスの修正候補を表示しました。",
  },
  {
    id: "wellness",
    start: 36,
    end: 42,
    title: "Wellness Check",
    okmeMessage:
      "少し集中が続いていましたね。現在のコンディションを確認しています。深呼吸をして、少しリフレッシュしましょう。",
    chatMessage: "コンディションを確認し、リフレッシュ方法を提案しました。",
  },
  {
    id: "summary",
    start: 42,
    end: 46,
    title: "Daily Summary",
    okmeMessage: "今日もお疲れさまでした。本日の活動をまとめました。",
    chatMessage: "本日の活動サマリーをまとめました。",
  },
  {
    id: "ending",
    start: 46,
    end: 50,
    title: "Ending",
    okmeMessage: "また明日も、あなたの隣でサポートします。",
    chatMessage: "今日もお疲れさまでした。また明日サポートします。",
  },
  {
    id: "logo",
    start: 50,
    end: 55,
    title: "OKme!",
    okmeMessage: "",
  },
];

/** 指定秒数に該当するシーンを返す（start の昇順で「直近に開始したシーン」を採用）。 */
export function getSceneAt(t: number): TimelineScene {
  let current = timelineScenes[0];
  for (const s of timelineScenes) {
    if (t >= s.start) current = s;
  }
  return current;
}

/* =========================================================================
 * Life Demo / Future Vision
 * 「生活・人生の伴走」を見せるための、約36秒のタイムライン。
 * 動画: /videos/download (1).mp4（約37秒）に同期。
 * トーンはやさしく、前向きで、少し感情に寄り添う。
 * ====================================================================== */

/** Life Demo の各シーンで表示する汎用カード。 */
export type LifeCard = {
  /** カード見出し（英字 or 日本語） */
  title: string;
  /** 大きく見せる値（任意） */
  value?: string;
  /** 補足テキストの行（任意） */
  lines?: string[];
  /** プログレス/メーター表示（任意） */
  bar?: { value: number; color: string };
  /** カードの発光色（任意） */
  glow?: "orange" | "blue";
  /** 処理中を表すパルス表示（翻訳中など。任意） */
  pulse?: boolean;
};

export type LifeSceneId =
  | "morning"
  | "office"
  | "translation"
  | "walk"
  | "night";

export type LifeScene = {
  id: LifeSceneId;
  /** シーン開始秒 */
  start: number;
  /** シーン終了秒（参考値） */
  end: number;
  /** HUD/バナーに出すモード名（英字） */
  mode: string;
  /** 中央に一瞬出す見出し（英字） */
  headline: string;
  /** ステータスピルの文言 */
  status: string;
  /** OKme! の吹き出しメッセージ */
  okmeMessage: string;
  /** シーン後半で差し替える吹き出し（任意・ラストの挨拶など） */
  okmeMessageLate?: string;
  /** Companion Log に追記するメッセージ（任意） */
  chatMessage?: string;
  /** 表示する生活カード群 */
  cards: LifeCard[];
};

export const lifeTimelineScenes: LifeScene[] = [
  {
    id: "morning",
    start: 0,
    end: 6,
    mode: "Morning",
    headline: "Good Morning",
    status: "モーニング",
    okmeMessage:
      "おはようございます、Sakiさん☀️ 今日の予定と体調を一緒に確認しましょう。",
    chatMessage: "おはようございます。睡眠と今日の予定を整理しました。",
    cards: [
      {
        title: "Sleep Score",
        value: "86",
        bar: { value: 86, color: "#60a5fa" },
        lines: ["よく眠れています"],
        glow: "blue",
      },
      { title: "今日の気分", lines: ["少し落ち着いている"] },
      { title: "今日の予定", value: "3件", lines: ["朝の準備 ・ 外出 ・ 振り返り"] },
    ],
  },
  {
    id: "office",
    start: 6,
    end: 13,
    mode: "Office Mode",
    headline: "Office Mode",
    status: "オフィスモード",
    okmeMessage:
      "オフィスに到着しました。今日のタスクと会議を整理しておきますね。",
    chatMessage: "オフィスモードに切り替えました。タスクと会議を整理しています。",
    cards: [
      { title: "Today's Tasks", value: "5件", lines: ["優先度を整理しました"], glow: "blue" },
      { title: "Next Meeting", lines: ["11:00 チーム会議", "資料は準備済み"] },
      { title: "Focus Time", value: "3h 40m", lines: ["集中しやすい時間帯です"] },
    ],
  },
  {
    id: "translation",
    start: 13,
    end: 20,
    mode: "Translation",
    headline: "Translation On",
    status: "翻訳モード",
    okmeMessage:
      "リアルタイム翻訳を開始します。自然な表現に整えて伝えますね。",
    chatMessage: "リアルタイム翻訳中。自然な英語に整えています。",
    cards: [
      {
        title: "Translating…",
        pulse: true,
        lines: ["音声を認識しています"],
        glow: "blue",
      },
      {
        title: "Japanese → English",
        lines: ["「はじめまして」", "→ Nice to meet you."],
      },
      { title: "Conversation Assist", lines: ["やわらかい言い回しに調整"] },
    ],
  },
  {
    id: "walk",
    start: 17,
    end: 24,
    mode: "Walking & Pet",
    headline: "Walking & Pet",
    status: "ウォーキングとペット",
    okmeMessage:
      "少し歩くと気分が整いやすいです。ワンちゃんも一緒に、今のペースとても良いですよ。",
    chatMessage: "いいペースです。歩数と心拍、ペットの様子も見守っています。",
    cards: [
      { title: "Steps", value: "4,820", lines: ["目標まであと少し"] },
      {
        title: "Heart Rate",
        value: "92 bpm",
        lines: ["とても安定しています"],
        glow: "orange",
      },
      {
        title: "Pet Care",
        lines: ["お散歩の時間です", "水分補給も忘れずに"],
      },
    ],
  },
  {
    id: "night",
    start: 24,
    end: 34,
    mode: "Night Mode",
    headline: "Night Mode",
    status: "家・Nightモード",
    okmeMessage:
      "今日もお疲れさまでした。おうちでゆっくり、一日を振り返りましょう。",
    okmeMessageLate: "また明日も、あなたのそばでサポートします😊",
    chatMessage: "おうちでの振り返りをまとめました。お疲れさまでした。",
    cards: [
      {
        title: "Completed Tasks",
        value: "3",
        lines: ["よく頑張りました"],
        glow: "orange",
      },
      { title: "Mood Summary", lines: ["穏やかな一日でした"] },
      { title: "Good work today", lines: ["ゆっくり休んでくださいね"] },
    ],
  },
];

/** Life Demo: 指定秒数に該当するシーンを返す。 */
export function getLifeSceneAt(t: number): LifeScene {
  let current = lifeTimelineScenes[0];
  for (const s of lifeTimelineScenes) {
    if (t >= s.start) current = s;
  }
  return current;
}

/** デモモード。"office" は業務支援、"life" は生活・人生の伴走。 */
export type DemoTimelineMode = "office" | "life";

/** モードに応じたタイムライン配列を返す。 */
export function getTimelineByMode(mode: DemoTimelineMode) {
  return mode === "life" ? lifeTimelineScenes : timelineScenes;
}

/**
 * シーンID（office / life どちらでも）から Companion Log 追記用メッセージを引く。
 * IDは両タイムラインで重複しないため、横断検索で問題ない。
 */
export function findChatMessage(id: string): string | undefined {
  const office = timelineScenes.find((s) => s.id === id);
  if (office?.chatMessage) return office.chatMessage;
  const life = lifeTimelineScenes.find((s) => s.id === id);
  return life?.chatMessage;
}
