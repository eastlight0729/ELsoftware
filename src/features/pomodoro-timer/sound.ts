/**
 * Plays a simple sine wave notification sound.
 * Uses the Web Audio API.
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    osc.start();
    osc.stop(ctx.currentTime + 1.0);
  } catch (error) {
    console.error("Audio playback failed", error);
  }
}
