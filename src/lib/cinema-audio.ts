/** Generative Interstellar-inspired organ drone — original synthesis, no samples. */
export class CinemaAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: OscillatorNode[] = [];
  private running = false;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  async start() {
    const ctx = this.ensureContext();
    if (!this.master || this.running) return;

    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 820;
    filter.Q.value = 0.6;

    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.35;

    const delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.38;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.master);

    filter.connect(this.master);
    filter.connect(reverbSend);
    reverbSend.connect(delay);

    const freqs = [55, 82.5, 110, 165, 220];
    const types: OscillatorType[] = [
      "sine",
      "triangle",
      "sine",
      "triangle",
      "sine",
    ];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = types[i];
      osc.frequency.value = freq;
      gain.gain.value = i === 0 ? 0.22 : i === 1 ? 0.14 : 0.08;
      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      this.nodes.push(osc);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.04 + i * 0.01;
      lfoGain.gain.value = 2 + i;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);
      this.nodes.push(lfo);
    });

    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0, now);
    this.master.gain.linearRampToValueAtTime(0.55, now + 4);
    this.running = true;
  }

  async stop() {
    if (!this.ctx || !this.master || !this.running) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 2.5);

    window.setTimeout(() => {
      this.nodes.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* already stopped */
        }
      });
      this.nodes = [];
      this.running = false;
    }, 2600);
  }

  isRunning() {
    return this.running;
  }
}

export const cinemaAudio = new CinemaAudioEngine();
