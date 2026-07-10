/**
 * AI message polish — mock implementation.
 * Swap `polishMessage` internals for OpenAI (or similar) without changing the UI.
 */

export type MessageTone = "gentle" | "bright" | "emotional" | "short";

export type PolishLanguage = "ja" | "en" | "tl" | "vi";

export type PolishMessageInput = {
  raw: string;
  tone: MessageTone;
  language: PolishLanguage;
  /** Optional card context for future API prompts */
  cardCategory?: string;
};

export type PolishMessageResult = {
  text: string;
  /** True when using on-device mock rules (not a live model). */
  isMock: boolean;
};

const toneOpeners: Record<MessageTone, Record<PolishLanguage, string>> = {
  gentle: {
    ja: "",
    en: "",
    tl: "",
    vi: "",
  },
  bright: {
    ja: "",
    en: "",
    tl: "",
    vi: "",
  },
  emotional: {
    ja: "",
    en: "",
    tl: "",
    vi: "",
  },
  short: {
    ja: "",
    en: "",
    tl: "",
    vi: "",
  },
};

/** Simulated latency so the interaction feels intentional. */
export async function polishMessage(
  input: PolishMessageInput,
): Promise<PolishMessageResult> {
  await new Promise((r) => setTimeout(r, 650 + Math.random() * 400));
  const text = mockPolish(input);
  return { text, isMock: true };
}

function mockPolish({ raw, tone, language }: PolishMessageInput): string {
  const handlers: Record<PolishLanguage, (r: string, t: MessageTone) => string> =
    {
      ja: polishJa,
      en: polishEn,
      tl: polishTl,
      vi: polishVi,
    };
  return handlers[language](raw.trim(), tone);
}

function polishJa(raw: string, tone: MessageTone): string {
  const lower = raw.toLowerCase();
  const hasBirthday =
    raw.includes("誕生日") || lower.includes("birthday") || raw.includes("たんじょう");
  const hasChild =
    raw.includes("子ども") ||
    raw.includes("子供") ||
    raw.includes("娘") ||
    raw.includes("息子");
  const hasMiss =
    raw.includes("会いたい") ||
    raw.includes("会えない") ||
    raw.includes("恋しい") ||
    raw.includes("ごめん");
  const hasLove = raw.includes("大好き") || raw.includes("愛");
  const hasThanks = raw.includes("ありがと");
  const hasWork =
    raw.includes("給料") ||
    raw.includes("仕事") ||
    raw.includes("がんば") ||
    raw.includes("元気");

  if (hasBirthday && hasChild) {
    const base =
      "誕生日おめでとう。そばにいられなくてごめんね。日本からいつもあなたのことを想っています。";
    const close = hasLove ? " 大好きだよ。" : " いつか一緒にお祝いしようね。";
    return applyToneJa(base + close, tone);
  }

  if (hasMiss && hasLove) {
    return applyToneJa(
      "会いたい気持ちは、いつも胸の中にあります。離れていても、あなたへの想いは変わりません。日本で一日一日、あなたのことを思いながら過ごしています。大好きだよ。",
      tone,
    );
  }

  if (hasThanks) {
    return applyToneJa(
      "いつも支えてくれて、本当にありがとう。日本で暮らす毎日のなかで、あなたのことを何度も思い出しています。",
      tone,
    );
  }

  if (hasWork) {
    return applyToneJa(
      "日本で仕事をがんばっています。大変な日もありますが、家族のことを思うと力が出ます。元気にしているから、心配しないでね。",
      tone,
    );
  }

  if (raw.length < 8) {
    return applyToneJa(
      "離れていても、あなたのことをいつも思っています。日本での毎日を、少しずつ家族に届けたいと思っています。",
      tone,
    );
  }

  const softened = raw
    .replace(/。+/g, "。")
    .replace(/\s+/g, "")
    .replace(/ごめん/g, "そばにいられなくてごめんね")
    .replace(/会えない/g, "会えないけれど");

  return applyToneJa(
    softened.endsWith("。") ? softened : `${softened}。日本から、あたたかい気持ちを送ります。`,
    tone,
  );
}

function applyToneJa(text: string, tone: MessageTone): string {
  switch (tone) {
    case "bright":
      return text.replace(/。/g, "！").replace(/！+/g, "！");
    case "emotional":
      return `${text} 離れていても、あなたは私の大切な家族です。`;
    case "short": {
      const first = text.split("。").filter(Boolean)[0];
      return first ? `${first}。` : text;
    }
    default:
      return text;
  }
}

function polishEn(raw: string, tone: MessageTone): string {
  const lower = raw.toLowerCase();
  if (
    lower.includes("birthday") &&
    (lower.includes("child") || lower.includes("kid") || lower.includes("son") || lower.includes("daughter"))
  ) {
    const base =
      "Happy birthday. I'm sorry I can't be there with you. I'm thinking of you every day from Japan.";
    return applyToneEn(
      tone === "short"
        ? "Happy birthday. I miss you and love you."
        : `${base}${lower.includes("love") ? " I love you so much." : ""}`,
      tone,
    );
  }
  if (lower.includes("miss") || lower.includes("can't see")) {
    return applyToneEn(
      "I miss you more than words can say. Even across the distance, you are always in my heart. I'm sending you warmth from Japan today.",
      tone,
    );
  }
  if (lower.includes("thank")) {
    return applyToneEn(
      "Thank you for always being there for me. On hard days here in Japan, thinking of you keeps me going.",
      tone,
    );
  }
  const base =
    raw.length > 20
      ? `${raw.replace(/\.\s*/g, ". ").trim()} I'm thinking of you from Japan.`
      : "I'm doing my best here in Japan, and you're always on my mind. Sending you a little warmth today.";
  return applyToneEn(base, tone);
}

function applyToneEn(text: string, tone: MessageTone): string {
  switch (tone) {
    case "bright":
      return text.replace(/\./g, "!").replace(/!+/g, "!");
    case "emotional":
      return `${text} No matter the miles, you are my family.`;
    case "short": {
      const first = text.split(/[.!]/).filter(Boolean)[0];
      return first ? `${first}.` : text;
    }
    default:
      return text;
  }
}

function polishTl(raw: string, tone: MessageTone): string {
  const lower = raw.toLowerCase();
  if (lower.includes("birthday") || raw.includes("kaarawan")) {
    return applyToneEn(
      "Maligayang kaarawan. Pasensya na hindi ako makakasama. Iniisip kita araw-araw dito sa Japan. Mahal na mahal kita.",
      tone,
    );
  }
  return applyToneEn(
    "Iniisip kita palagi, kahit malayo tayo. Pinapadala ko ang init ng puso ko mula sa Japan.",
    tone,
  );
}

function polishVi(raw: string, _tone: MessageTone): string {
  const lower = raw.toLowerCase();
  if (lower.includes("sinh nhật") || lower.includes("birthday")) {
    return "Chúc mừng sinh nhật. Xin lỗi vì không thể ở bên cạnh con. Mẹ/cha luôn nghĩ về con mỗi ngày từ Nhật Bản. Yêu con nhiều lắm.";
  }
  return "Dù ở xa, mình luôn nhớ và thương gia đình. Mình đang cố gắng từng ngày ở Nhật Bản và muốn gửi đến bạn chút ấm áp hôm nay.";
}

/** Labels for UI — kept here so API swap stays localized in one place. */
export const toneLabels: Record<
  MessageTone,
  Record<PolishLanguage | "ui", string>
> = {
  gentle: {
    ui: "Gentle",
    ja: "やさしい",
    en: "Gentle",
    tl: "Malumanay",
    vi: "Dịu dàng",
  },
  bright: {
    ui: "Bright",
    ja: "明るい",
    en: "Bright",
    tl: "Masigla",
    vi: "Vui vẻ",
  },
  emotional: {
    ui: "Emotional",
    ja: "泣ける",
    en: "Emotional",
    tl: "Damdamin",
    vi: "Xúc động",
  },
  short: {
    ui: "Short",
    ja: "短め",
    en: "Short",
    tl: "Maikli",
    vi: "Ngắn gọn",
  },
};

// Reserved for future API tone prefixes
void toneOpeners;
