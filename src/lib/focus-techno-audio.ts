/** Procedural peak-hours psych beats — Tame Impala vibe, scroll-modulated filter. */
export const FOCUS_BPM = 124;

const CHORD_ROOTS = [82.41, 98.0, 110.0, 123.47]; // E2, G2, A2, B2
const CHORD_INTERVALS = [
  [0, 4, 7, 11], // maj7
  [0, 3, 7, 10], // min7
  [0, 4, 7, 10], // dom7
  [0, 3, 7, 11], // min maj7
];

export class FocusTechnoAudioEngine {
  readonly bpm = FOCUS_BPM;

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private bassGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private phaserDelay: DelayNode | null = null;
  private phaserFeedback: GainNode | null = null;
  private phaserLfo: OscillatorNode | null = null;
  private running = false;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private nextStepTime = 0;
  private step = 0;
  private modulation = 0;
  private padOscs: OscillatorNode[] = [];
  private chordIndex = 0;

  private readonly stepsPerBar = 16;
  private readonly bars = 4;

  /** 0–1 — scroll / pointer intensity opens the low-pass slightly. */
  setModulation(value: number) {
    this.modulation = Math.max(0, Math.min(1, value));
    this.applyFilter();
  }

  getModulation() {
    return this.modulation;
  }

  private applyFilter() {
    if (!this.filter || !this.ctx) return;
    const base = 620;
    const range = 3800;
    const target = base + range * this.modulation;
    this.filter.frequency.cancelScheduledValues(this.ctx.currentTime);
    this.filter.frequency.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    this.filter.Q.value = 0.6 + this.modulation * 1.8;
  }

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.filter = this.ctx.createBiquadFilter();
      this.bassGain = this.ctx.createGain();
      this.padGain = this.ctx.createGain();

      this.filter.type = "lowpass";
      this.filter.Q.value = 0.7;
      this.bassGain.gain.value = 0.42;
      this.padGain.gain.value = 0.22;

      // Simple phaser — delay feedback loop with LFO
      this.phaserDelay = this.ctx.createDelay(0.02);
      this.phaserDelay.delayTime.value = 0.006;
      this.phaserFeedback = this.ctx.createGain();
      this.phaserFeedback.gain.value = 0.35;

      this.phaserDelay.connect(this.phaserFeedback);
      this.phaserFeedback.connect(this.phaserDelay);

      this.filter.connect(this.phaserDelay);
      this.phaserDelay.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.applyFilter();
    }
    return this.ctx;
  }

  private startPad() {
    const ctx = this.ctx!;
    if (!this.padGain || this.padOscs.length > 0) return;

    const root = CHORD_ROOTS[0];
    const freqs = CHORD_INTERVALS[0].map((semi) => root * Math.pow(2, semi / 12));

    for (const freq of freqs) {
      for (const detune of [-7, 0, 7]) {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = freq;
        osc.detune.value = detune;

        const env = ctx.createGain();
        env.gain.value = 0.04;

        osc.connect(env);
        env.connect(this.padGain!);
        osc.start();
        this.padOscs.push(osc);
      }
    }

    this.padGain.connect(this.filter!);
  }

  private stopPad() {
    for (const osc of this.padOscs) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
    this.padOscs = [];
  }

  private startPhaserLfo() {
    const ctx = this.ctx!;
    if (!this.phaserDelay || this.phaserLfo) return;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.25;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.004;

    lfo.connect(lfoGain);
    lfoGain.connect(this.phaserDelay.delayTime);
    lfo.start();
    this.phaserLfo = lfo;
  }

  private stopPhaserLfo() {
    if (this.phaserLfo) {
      try {
        this.phaserLfo.stop();
      } catch {
        /* noop */
      }
      this.phaserLfo = null;
    }
  }

  async start() {
    const ctx = this.ensureContext();
    if (!this.master || !this.filter || !this.bassGain || this.running) return;

    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0, now);
    this.master.gain.linearRampToValueAtTime(0.68, now + 2.2);

    this.startPad();
    this.startPhaserLfo();

    this.step = 0;
    this.nextStepTime = now + 0.05;
    this.running = true;
    this.scheduleLoop();
  }

  async stop() {
    if (!this.ctx || !this.master || !this.running) return;

    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 1.4);

    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    window.setTimeout(() => {
      this.stopPad();
      this.stopPhaserLfo();
      this.running = false;
    }, 1500);
  }

  isRunning() {
    return this.running;
  }

  private scheduleLoop() {
    if (this.timerId !== null) clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      if (!this.ctx || !this.running) return;

      const ctx = this.ctx;
      const stepDur = 60 / (this.bpm * 4);
      const horizon = ctx.currentTime + 0.14;

      while (this.nextStepTime < horizon) {
        this.playStep(this.step, this.nextStepTime);
        this.nextStepTime += stepDur;
        this.step = (this.step + 1) % (this.stepsPerBar * this.bars);
      }
    }, 25);
  }

  private playStep(index: number, time: number) {
    if (!this.ctx || !this.filter || !this.bassGain) return;

    const barStep = index % this.stepsPerBar;
    const bar = Math.floor(index / this.stepsPerBar);

    // Kick on 1 & 3 — softer than pure techno
    if (barStep === 0 || barStep === 8) {
      this.playKick(time, barStep === 0 ? 0.72 : 0.58);
      this.duckBass(time);
    }

    // Snare/clap on 2 & 4
    if (barStep === 4 || barStep === 12) {
      this.playSnare(time, barStep === 4 ? 0.38 : 0.32);
    }

    // Offbeat shaker
    if (barStep % 4 === 2) {
      this.playShaker(time, 0.045 + (barStep === 10 ? 0.02 : 0));
    }

    // Syncopated rim
    if (barStep === 6 || barStep === 14) {
      this.playRim(time, 0.22);
    }

    // Hi-hats — 8ths with swing accent
    if (barStep % 2 === 1) {
      this.playHiHat(time, barStep === 3 || barStep === 11 ? 0.04 : 0.028);
    }

    // Chord stabs every bar
    if (barStep === 0) {
      this.chordIndex = (this.chordIndex + 1) % CHORD_ROOTS.length;
      this.playChordStab(time, CHORD_ROOTS[this.chordIndex], CHORD_INTERVALS[bar % 4]);
    }

    // Groovy bass — funk pattern
    const bassPattern: Record<number, number | null> = {
      0: CHORD_ROOTS[bar % 4],
      3: CHORD_ROOTS[bar % 4] * 1.25,
      6: CHORD_ROOTS[(bar + 1) % 4],
      10: CHORD_ROOTS[bar % 4] * 0.75,
      12: CHORD_ROOTS[bar % 4],
      14: CHORD_ROOTS[bar % 4] * 1.5,
    };
    const bassFreq = bassPattern[barStep];
    if (bassFreq) {
      this.playBass(time, bassFreq, barStep === 0 || barStep === 12 ? 0.55 : 0.42);
    }
  }

  private playKick(time: number, level: number) {
    const ctx = this.ctx!;
    const out = ctx.createGain();
    out.gain.value = level;
    out.connect(this.filter!);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.055);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(0.75, time + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.38);

    osc.connect(env);
    env.connect(out);
    osc.start(time);
    osc.stop(time + 0.4);
  }

  private playSnare(time: number, level: number) {
    const ctx = this.ctx!;
    const dur = 0.12;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 2200;
    band.Q.value = 0.7;

    const env = ctx.createGain();
    env.gain.setValueAtTime(level, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    noise.connect(band);
    band.connect(env);
    env.connect(this.filter!);
    noise.start(time);
    noise.stop(time + dur);

    // Body tone
    const body = ctx.createOscillator();
    body.type = "triangle";
    body.frequency.value = 180;
    const bodyEnv = ctx.createGain();
    bodyEnv.gain.setValueAtTime(level * 0.5, time);
    bodyEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);
    body.connect(bodyEnv);
    bodyEnv.connect(this.filter!);
    body.start(time);
    body.stop(time + 0.1);
  }

  private playShaker(time: number, level: number) {
    const ctx = this.ctx!;
    const dur = 0.06;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.7;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 6000;

    const env = ctx.createGain();
    env.gain.setValueAtTime(level, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    noise.connect(hp);
    hp.connect(env);
    env.connect(this.filter!);
    noise.start(time);
    noise.stop(time + dur);
  }

  private playRim(time: number, level: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 520;

    const env = ctx.createGain();
    env.gain.setValueAtTime(level, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    osc.connect(env);
    env.connect(this.filter!);
    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playHiHat(time: number, level: number) {
    const ctx = this.ctx!;
    const dur = 0.035;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 9000;
    band.Q.value = 0.8;

    const env = ctx.createGain();
    env.gain.setValueAtTime(level, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    noise.connect(band);
    band.connect(env);
    env.connect(this.filter!);
    noise.start(time);
    noise.stop(time + dur);
  }

  private playChordStab(
    time: number,
    root: number,
    intervals: number[],
  ) {
    const ctx = this.ctx!;
    const stabGain = ctx.createGain();
    stabGain.gain.setValueAtTime(0.0001, time);
    stabGain.gain.linearRampToValueAtTime(0.18 + this.modulation * 0.08, time + 0.02);
    stabGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.55);
    stabGain.connect(this.filter!);

    for (const semi of intervals) {
      const freq = root * Math.pow(2, semi / 12);
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 12;

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.14;

      osc.connect(oscGain);
      oscGain.connect(stabGain);
      osc.start(time);
      osc.stop(time + 0.6);
    }
  }

  private playBass(time: number, freq: number, level: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, time);
    filter.frequency.exponentialRampToValueAtTime(180, time + 0.18);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(level, time + 0.012);
    env.gain.setValueAtTime(level * 0.75, time + 0.08);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.bassGain!);
    this.bassGain!.connect(this.filter!);
    osc.start(time);
    osc.stop(time + 0.35);
  }

  private duckBass(time: number) {
    if (!this.bassGain || !this.ctx) return;
    const g = this.bassGain.gain;
    g.cancelScheduledValues(time);
    g.setValueAtTime(g.value, time);
    g.linearRampToValueAtTime(0.1, time + 0.015);
    g.linearRampToValueAtTime(0.42, time + 0.16);
  }
}

export const focusTechnoAudio = new FocusTechnoAudioEngine();
