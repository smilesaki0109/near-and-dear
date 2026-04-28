/**
 * Short phrases users can tap to insert into the message (Phase 2: local only).
 * Paired EN/JA so the chip text matches the active UI language.
 */

export type MessageTemplate = {
  id: string;
  textEn: string;
  textJa: string;
  textTl: string;
};

export const messageTemplates: MessageTemplate[] = [
  {
    id: "t1",
    textEn: "I’m thinking of you today.",
    textJa: "きょうもあなたのことを思っています。",
    textTl: "Iniisip kita today.",
  },
  {
    id: "t2",
    textEn: "Thank you for always being in my corner.",
    textJa: "いつも味方でいてくれて、ありがとう。",
    textTl: "Salamat sa laging pag-alalay sa akin.",
  },
  {
    id: "t3",
    textEn: "Even far away, you’re close in my heart.",
    textJa: "遠くにいても、心のそばにいます。",
    textTl: "Kahit malayo, malapit ka sa puso ko.",
  },
  {
    id: "t4",
    textEn: "I’m proud of you—please take it slow when you need to.",
    textJa: "えらいよ。つらかったら、ゆっくりでいいからね。",
    textTl: "Proud ako sa iyo. Dahan-dahan lang kapag kailangan.",
  },
  {
    id: "t5",
    textEn: "I miss the little everyday moments with you.",
    textJa: "あなたとのふつうの時間が恋しいです。",
    textTl: "Namimiss ko ang maliliit na araw kasama ka.",
  },
  {
    id: "t6",
    textEn: "You deserve something gentle today.",
    textJa: "きょうは、自分にやさしくしていい日です。",
    textTl: "Deserve mo ng gentle na araw today.",
  },
];
