let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3
) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playSuccess() {
  playTone(523.25, 0.15, "sine", 0.3); // C5
  setTimeout(() => playTone(659.25, 0.15, "sine", 0.3), 100); // E5
  setTimeout(() => playTone(783.99, 0.3, "sine", 0.3), 200); // G5
}

export function playTap() {
  playTone(800, 0.05, "square", 0.1);
}

export function playWhoosh() {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = 400;
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
  gain.gain.value = 0.15;
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

export function playPop() {
  playTone(600, 0.08, "sine", 0.25);
}

export function playError() {
  playTone(200, 0.15, "square", 0.2);
  setTimeout(() => playTone(150, 0.2, "square", 0.2), 100);
}

const LANGUAGE_MAP: Record<string, string> = {
  es: "es-ES",
  en: "en-US",
  ru: "ru-RU",
};

export function speak(text: string, language: string): SpeechSynthesisUtterance | null {
  if (!("speechSynthesis" in window)) return null;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE_MAP[language] || language;
  utterance.rate = 0.85;
  utterance.pitch = 1.1;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function cancelSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
