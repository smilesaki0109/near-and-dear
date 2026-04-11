/**
 * Minimal UI strings for Japanese / English.
 * Phase 1: home + browse only. Expand when create/share ships.
 */

export type Locale = "en" | "ja";

export const ui = {
  en: {
    brand: "Near & Dear",
    navHome: "Home",
    heroTitle: "A little warmth for the miles between you",
    heroSubtitle:
      "Browse gentle cards for special days and hard days—made for people living far from home.",
    searchPlaceholder: "Search cards by title…",
    categoryAll: "All",
    categoryEncouragement: "Encouragement",
    categoryBirthday: "Birthday",
    categoryGratitude: "Gratitude",
    categoryMissingHome: "Missing home",
    categoryNewChapter: "New chapter",
    cardsHeading: "Cards for your heart",
    cardsEmpty: "No cards match. Try another word or category.",
    chipHint: "Filter by feeling",
    footerNote: "You are not alone here.",
    navCreateHint: "Tap a card to begin",
    createBack: "Back to browse",
    createHeading: "Add your words",
    createSub:
      "Take your time. This space is only for you right now—nothing is saved online yet.",
    createSelectedLabel: "You chose",
    createMessageLabel: "Your message",
    createMessagePlaceholder:
      "Write what feels true, even if it’s simple…",
    createTemplatesHint: "Gentle starters — tap to add",
    createPhotoLabel: "One photo",
    createPhotoButton: "Choose a photo",
    createPhotoReplace: "Replace",
    createPhotoRemove: "Remove photo",
    createPhotoHint: "JPG or PNG, one image.",
    createPreviewLabel: "How your card will feel",
    createPreviewEmpty:
      "Your message will appear here…",
    createSave: "Save card",
    createSaveNote:
      "Creates a gentle link you can share. (Demo: kept in server memory for now.)",
    createSavedAck:
      "Saved on this device for preview. We’ll help you share it in the next step.",
    createSaving: "Opening your card…",
    createShareError: "We couldn’t save that. Please try again.",
    shareKicker: "A card for you",
    shareFooterNote:
      "Whoever sent this picked these words and colors with you in mind.",
    shareBrowseMore: "Browse more cards",
    shareMessageEmpty: "Sometimes words are hard. This space is still a hug.",
    shareNotFoundTitle: "This card isn’t here anymore",
    shareNotFoundBody:
      "In this demo, links can reset if the server restarts. Ask your friend to send a fresh one, or make a new card.",
  },
  ja: {
    brand: "ニア アンド ディア",
    navHome: "ホーム",
    navCreateHint: "カードを選んで始める",
    heroTitle: "遠くにいても、気持ちがそっと届くように",
    heroSubtitle:
      "特別な日も、つらい日も。故郷から離れて暮らす方へ、やさしいカードを集めました。",
    searchPlaceholder: "タイトルでさがす…",
    categoryAll: "すべて",
    categoryEncouragement: "応援",
    categoryBirthday: "おたんじょうび",
    categoryGratitude: "ありがとう",
    categoryMissingHome: "ふるさと",
    categoryNewChapter: "新しい一歩",
    cardsHeading: "心に寄り添うカード",
    cardsEmpty: "該当するカードがありません。別の言葉やカテゴリを試してください。",
    chipHint: "気持ちで絞り込み",
    footerNote: "ここでは、ひとりじゃありません。",
    createBack: "一覧に戻る",
    createHeading: "ことばを添える",
    createSub:
      "急がなくて大丈夫。いまはこの端末の中だけの下書きで、まだオンラインには保存されません。",
    createSelectedLabel: "えらんだカード",
    createMessageLabel: "メッセージ",
    createMessagePlaceholder:
      "短くても、正直な気持ちで…",
    createTemplatesHint: "やさしい文例 — タップで入ります",
    createPhotoLabel: "写真を1枚",
    createPhotoButton: "写真を選ぶ",
    createPhotoReplace: "差し替える",
    createPhotoRemove: "写真を外す",
    createPhotoHint: "JPG か PNG、1枚まで。",
    createPreviewLabel: "完成イメージ",
    createPreviewEmpty:
      "メッセージがここに表示されます…",
    createSave: "カードを保存",
    createSaveNote:
      "共有用のやさしいリンクができます（※デモではサーバーのメモリにだけ保存されます）。",
    createSavedAck:
      "この端末でのプレビュー用にとっておきました。共有は次のステップで。",
    createSaving: "カードをひらいています…",
    createShareError: "保存できませんでした。もう一度お試しください。",
    shareKicker: "あなたへ届くカード",
    shareFooterNote:
      "送ってくれた人が、あなたのことを思いながらえらびました。",
    shareBrowseMore: "ほかのカードを見る",
    shareMessageEmpty:
      "ことばにできない日もあるけれど、そのぶんやさしさが届きます。",
    shareNotFoundTitle: "このカードは見つかりませんでした",
    shareNotFoundBody:
      "デモではサーバーを再起動するとリンクが無効になることがあります。送り直してもらうか、新しいカードをつくってみてください。",
  },
} as const;
