export function playQueueChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    
    // First high tone (E5 ~659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second higher tone (B5 ~987Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Ignore audio autoplay/context errors
  }
}

export function playWelcomeChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    // Harmonic progression: C5 -> E5 -> G5 -> C6 (crystal hospital welcome chime)
    const notes = [
      { freq: 523.25, time: 0, dur: 0.4, vol: 0.18 }, // C5
      { freq: 659.25, time: 0.1, dur: 0.45, vol: 0.22 }, // E5
      { freq: 783.99, time: 0.2, dur: 0.55, vol: 0.25 }, // G5
      { freq: 1046.50, time: 0.32, dur: 0.8, vol: 0.28 } // C6
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);
      gain.gain.setValueAtTime(note.vol, now + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });
  } catch (e) {
    // Audio context safe fallback
  }
}

let hasSpokenWelcomeOnceGlobal = false;
let lastSpokenTime = 0;

/**
 * Speaks "Welcome to CheckMed" in a natural, polite male AI voice
 * strictly once and plays a gentle welcoming chime sound.
 */
export function speakWelcomeToCheckmed(force: boolean = false) {
  if (!force && hasSpokenWelcomeOnceGlobal) {
    return; // Strictly once, never duplicate
  }
  
  const now = Date.now();
  if (!force && now - lastSpokenTime < 6000) {
    return;
  }
  lastSpokenTime = now;
  hasSpokenWelcomeOnceGlobal = true;

  // 1. Play futuristic medical chime
  playWelcomeChimeSound();

  // 2. Perform speech synthesis
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  const executeSpeech = () => {
    try {
      window.speechSynthesis.cancel(); // Clear any existing speech queue

      const utterance = new SpeechSynthesisUtterance("Welcome to CheckMed");
      utterance.rate = 0.92; // Crisp, dignified pace
      utterance.pitch = 0.82; // Deep, confident professional male tone
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      // Strictly select a male AI voice
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const maleKeywords = [
          'male', 'david', 'guy', 'george', 'daniel', 'alex', 'mark', 'ravi',
          'james', 'oliver', 'arthur', 'ryan', 'tom', 'google us english male',
          'google uk english male', 'en-us-standard-b', 'en-us-standard-d', 'en-in-standard-b',
          'microsoft david', 'microsoft mark', 'microsoft george'
        ];
        const femaleKeywords = [
          'female', 'woman', 'girl', 'samantha', 'zira', 'jenny', 'victoria',
          'susan', 'karen', 'hazel', 'helena', 'catherine', 'linda', 'ava',
          'emma', 'sophia', 'moira', 'fiona', 'veena', 'priya', 'microsoft zira'
        ];

        // 1. Search for explicit male voice in English
        let selectedVoice = voices.find(v => {
          const name = v.name.toLowerCase();
          const isEnglish = v.lang.startsWith('en');
          const isExplicitMale = maleKeywords.some(k => name.includes(k));
          const isFemale = femaleKeywords.some(k => name.includes(k));
          return isEnglish && isExplicitMale && !isFemale;
        });

        // 2. If not found, find any English voice that is not female
        if (!selectedVoice) {
          selectedVoice = voices.find(v => {
            const name = v.name.toLowerCase();
            const isEnglish = v.lang.startsWith('en');
            const isFemale = femaleKeywords.some(k => name.includes(k));
            return isEnglish && !isFemale;
          });
        }

        // 3. Fallback to any non-female voice
        if (!selectedVoice) {
          selectedVoice = voices.find(v => {
            const name = v.name.toLowerCase();
            const isFemale = femaleKeywords.some(k => name.includes(k));
            return !isFemale;
          });
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Short delay after chime so user hears chime and then the voice
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('Speech synthesis speak error:', err);
        }
      }, 220);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  };

  const currentVoices = window.speechSynthesis.getVoices();
  if (currentVoices && currentVoices.length > 0) {
    executeSpeech();
  } else {
    const voiceListener = () => {
      window.speechSynthesis.onvoiceschanged = null;
      executeSpeech();
    };
    window.speechSynthesis.onvoiceschanged = voiceListener;
    setTimeout(() => {
      window.speechSynthesis.onvoiceschanged = null;
      executeSpeech();
    }, 250);
  }
}

