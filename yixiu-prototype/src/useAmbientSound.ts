import { useCallback, useEffect, useRef, useState } from "react";
import { AmbientAudioController, type AmbientScene, type AmbientState } from "./ambient-audio";
import { observeAudio } from "./product-analytics";

type AmbientOptions = {
  scene: AmbientScene;
  requested: boolean;
  volume: number;
  fadeFactor: number;
  onRequestChange(requested: boolean): void;
};

export function useAmbientSound({ scene, requested, volume, fadeFactor, onRequestChange }: AmbientOptions) {
  const [state, setState] = useState<AmbientState>({ status: "idle", error: null });
  const controllerRef = useRef<AmbientAudioController | null>(null);
  const latest = useRef({ scene, requested, volume, fadeFactor, onRequestChange });
  latest.current = { scene, requested, volume, fadeFactor, onRequestChange };

  useEffect(() => {
    const controller = new AmbientAudioController({
      createAudio: source => new Audio(source),
      observe: (audio, current) => observeAudio(audio, current.id, current.category, current.free),
      onState: setState,
      onInterrupted: () => latest.current.onRequestChange(false),
      requestFrame: callback => window.requestAnimationFrame(callback),
      cancelFrame: frame => window.cancelAnimationFrame(frame),
      now: () => performance.now(),
    });
    controllerRef.current = controller;
    controller.setVolume(latest.current.volume, latest.current.fadeFactor);
    controller.update(latest.current.scene, latest.current.requested);
    return () => {
      controller.dispose();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, []);

  useEffect(() => { controllerRef.current?.update(scene, requested); }, [scene.id, scene.audio, requested]);
  useEffect(() => { controllerRef.current?.setVolume(volume, fadeFactor); }, [volume, fadeFactor]);
  const retry = useCallback(() => {
    latest.current.onRequestChange(true);
    controllerRef.current?.retry();
  }, []);
  const pause = useCallback(() => {
    controllerRef.current?.pause();
    latest.current.onRequestChange(false);
  }, []);
  return { ...state, retry, pause };
}
