/**
 * Short phrases users can tap to insert into the message.
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
    textEn: "Happy birthday. I wish I could be there with you.",
    textJa: "お誕生日おめでとう。そばにいられなくてごめんね。",
    textTl: "Happy birthday. Sana makasama kita.",
  },
  {
    id: "t2",
    textEn: "Mom, Dad—thank you for always believing in me.",
    textJa: "お父さん、お母さん。いつも信じてくれてありがとう。",
    textTl: "Mama, Papa—salamat sa pagtitiwala sa akin.",
  },
  {
    id: "t3",
    textEn: "I miss you today more than usual.",
    textJa: "きょうは、いつもより会いたい気持ちが強いです。",
    textTl: "Miss kita ngayon, sobra.",
  },
  {
    id: "t4",
    textEn: "I'm doing okay in Japan. Please don't worry too much.",
    textJa: "日本では元気にしています。あまり心配しないでね。",
    textTl: "Okay ako dito sa Japan. Huwag masyadong mag-alala.",
  },
  {
    id: "t5",
    textEn: "Got paid today—I thought of you first.",
    textJa: "お給料日。真っ先にあなたのことを思い出した。",
    textTl: "Sahod day—naisip kita agad.",
  },
  {
    id: "t6",
    textEn: "This is what my day in Japan looked like.",
    textJa: "今日の日本での一日を、少しだけ見せたい。",
    textTl: "Ito ang itsura ng araw ko sa Japan.",
  },
];
