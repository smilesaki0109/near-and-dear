/**
 * Short phrases users can tap to insert into the message (Phase 2: local only).
 * Paired EN/JA so the chip text matches the active UI language.
 */

export type MessageTemplate = {
  id: string;
  textEn: string;
  textJa: string;
};

export const messageTemplates: MessageTemplate[] = [
  {
    id: "t1",
    textEn: "I’m thinking of you today.",
    textJa: "きょうもあなたのことを思っています。",
  },
  {
    id: "t2",
    textEn: "Thank you for always being in my corner.",
    textJa: "いつも味方でいてくれて、ありがとう。",
  },
  {
    id: "t3",
    textEn: "Even far away, you’re close in my heart.",
    textJa: "遠くにいても、心のそばにいます。",
  },
  {
    id: "t4",
    textEn: "I’m proud of you—please take it slow when you need to.",
    textJa: "えらいよ。つらかったら、ゆっくりでいいからね。",
  },
  {
    id: "t5",
    textEn: "I miss the little everyday moments with you.",
    textJa: "あなたとのふつうの時間が恋しいです。",
  },
  {
    id: "t6",
    textEn: "You deserve something gentle today.",
    textJa: "きょうは、自分にやさしくしていい日です。",
  },
];
