/**
 * オフィスデモ動画（50秒）に同期させるARアシストのタイムライン。
 * video.currentTime（秒）に応じて、表示するシーンを切り替える。
 * すべてデモ用のモックデータ。実際の画像認識・人物特定は行わない。
 */
export type TimelineScene = {
  id: "arrival" | "desk" | "meeting" | "slides" | "code" | "wellness";
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
    end: 4.2,
    title: "Office Arrival",
    okmeMessage: "おはようございます、Sakiさん。今日も1日、一緒に頑張りましょう。",
  },
  {
    id: "desk",
    start: 4.2,
    end: 13.9,
    title: "Desk & Schedule",
    okmeMessage:
      "このあと10分後に打ち合わせがあります。前回のメモと今日の相談事項を確認しておきましょう。",
    chatMessage: "今日の予定と次の打ち合わせを整理しました。",
  },
  {
    id: "meeting",
    start: 14.0,
    end: 23.5,
    title: "Meeting Assist",
    okmeMessage:
      "進捗報告だけでなく、今後の課題と対応方針まで話せると良さそうです。",
    chatMessage: "会議の要点を3つに整理しました。",
  },
  {
    id: "slides",
    start: 23.5,
    end: 31.8,
    title: "Slide Review Assist",
    okmeMessage:
      "売上5倍を伝えるには、目標だけでなく、なぜ実現できるのかを資料に入れると説得力が上がります。",
    chatMessage: "資料の改善案を2つ作成しました。",
  },
  {
    id: "code",
    start: 31.8,
    end: 42.5,
    title: "Code Assist",
    okmeMessage:
      "APIレスポンスの形式が想定と異なるようです。nullチェックと型定義の修正をおすすめします。",
    chatMessage: "修正候補を表示しました。",
  },
  {
    id: "wellness",
    start: 43.0,
    end: 50.0,
    title: "Wellness Check",
    okmeMessage:
      "今日はよく頑張りました。少し疲れが溜まっているようです。一緒にリラックスしましょう。",
    chatMessage: "リフレッシュメニューを用意しました。",
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
