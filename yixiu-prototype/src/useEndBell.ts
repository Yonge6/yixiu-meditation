import { useCallback, useEffect, useRef } from 'react';

// Separate from ambience: its final fadeFactor is zero at the moment of completion.
export function useEndBell(enabled: boolean, volume: number) {
  const settings = useRef({ enabled, volume });
  settings.current = { enabled, volume };
  const context = useRef<AudioContext | null>(null);
  const buffer = useRef<AudioBuffer | null>(null);
  const playing = useRef<AudioBufferSourceNode | null>(null);
  const gain = useRef<GainNode | null>(null);

  useEffect(() => {
    let disposed = false;
    let loading = false;
    const abort = new AbortController();
    // Run synchronously inside the gesture, not a React effect after starting the timer.
    const prepare = () => {
      // Prepare silently even while off, so enabling mid-session needs no extra tap.
      try {
        const AudioContextClass = window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = context.current ??= new AudioContextClass();
        void ctx.resume().catch(() => {});
        if (buffer.current || loading) return;
        loading = true;
        void fetch('/assets/yixiu/audio/end-bell.wav', { signal: abort.signal })
          .then(response => { if (!response.ok) throw new Error('Bell unavailable'); return response.arrayBuffer(); })
          .then(bytes => ctx.decodeAudioData(bytes))
          .then(decoded => { if (!disposed) buffer.current = decoded; })
          .catch(() => { /* Keep completion usable if audio cannot be prepared; next gesture retries. */ })
          .finally(() => { loading = false; });
      } catch { /* Audio is optional in unsupported browsers. */ }
    };
    document.addEventListener('pointerdown', prepare, true);
    document.addEventListener('pointerup', prepare, true);
    document.addEventListener('keydown', prepare, true);
    return () => {
      disposed = true;
      abort.abort();
      document.removeEventListener('pointerdown', prepare, true);
      document.removeEventListener('pointerup', prepare, true);
      document.removeEventListener('keydown', prepare, true);
      playing.current?.stop();
      playing.current = null;
      buffer.current = null;
      void context.current?.close().catch(() => {});
      context.current = null;
    };
  }, []);

  useEffect(() => {
    if (!enabled) { playing.current?.stop(); playing.current = null; }
    if (gain.current) gain.current.gain.value = Math.max(0, Math.min(volume / 100, 1));
  }, [enabled, volume]);

  return useCallback(() => {
    const ctx = context.current;
    const { enabled: on, volume: currentVolume } = settings.current;
    // No asynchronous delayed ring when an interrupted/suspended browser later resumes.
    if (!on || currentVolume <= 0 || !ctx || ctx.state !== 'running' || !buffer.current) return;
    playing.current?.stop();
    const source = ctx.createBufferSource();
    const level = ctx.createGain();
    source.buffer = buffer.current;
    source.loop = false;
    level.gain.value = Math.max(0, Math.min(currentVolume / 100, 1));
    source.connect(level).connect(ctx.destination);
    playing.current = source;
    gain.current = level;
    source.onended = () => {
      source.disconnect(); level.disconnect();
      if (playing.current === source) { playing.current = null; gain.current = null; }
    };
    source.start();
  }, []);
}
