// 日本語の読み上げ音声を、できるだけ自然で明るい高品質ボイスで再生するためのユーティリティ。
// Windows の既定オフライン音声（Haruka 等）はロボット的に聞こえやすいため、
// Google / Natural / Online 系の高品質ボイスを優先的に選択する。

/** 利用可能な中から、自然な日本語ボイスを優先順位つきで選ぶ。 */
export function pickJapaneseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const ja = voices.filter(
    (v) => v.lang?.toLowerCase().startsWith("ja") || /japanese|日本語/i.test(v.name),
  );
  const pool = ja.length ? ja : voices;

  // 上から順に優先（高品質・自然なものを先に）
  const priorities: RegExp[] = [
    /google/i, // Chrome の「Google 日本語」: 高品質で明るい
    /natural/i, // Edge/Windows の Natural ボイス
    /online/i, // Microsoft Online (Natural) ボイス
    /nanami|ayumi|ichiro|keita/i, // Microsoft の比較的自然なボイス
    /kyoko|o-ren|otoya|sayaka|mizuki/i, // Apple 系の良質ボイス
  ];
  for (const re of priorities) {
    const hit = pool.find((v) => re.test(v.name));
    if (hit) return hit;
  }
  return pool[0] ?? null;
}

export type SpeakOptions = {
  pitch?: number;
  rate?: number;
  volume?: number;
};

/**
 * 日本語テキストを高品質ボイスで読み上げる。
 * 音声リストが未ロードの場合は voiceschanged を待ってから再生する。
 */
export function speakJa(text: string, opts: SpeakOptions = {}): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;

  const doSpeak = () => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.pitch = opts.pitch ?? 1;
      u.rate = opts.rate ?? 1;
      u.volume = opts.volume ?? 1;
      const v = pickJapaneseVoice();
      if (v) u.voice = v;
      synth.cancel();
      synth.speak(u);
    } catch {
      /* noop */
    }
  };

  if (synth.getVoices().length === 0) {
    // 音声リストがまだ読み込まれていない → 一度だけ待ってから再生
    const handler = () => {
      synth.removeEventListener("voiceschanged", handler);
      doSpeak();
    };
    synth.addEventListener("voiceschanged", handler);
    // フォールバック：少し待っても来なければ再生を試みる
    window.setTimeout(() => {
      if (synth.getVoices().length) {
        synth.removeEventListener("voiceschanged", handler);
        doSpeak();
      }
    }, 300);
  } else {
    doSpeak();
  }
}
