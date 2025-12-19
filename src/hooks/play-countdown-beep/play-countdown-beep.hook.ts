import { useEffect, useEffectEvent, useRef } from "react";

export function usePlayCountdownBeep(currentDuration: number, isPlaying: boolean) {
  const audioContextRef = useRef<AudioContext | undefined>(undefined);
  const oscillatorRef = useRef<OscillatorNode | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const cleanupBeep = useEffectEvent(async () => {
    clearTimeout(timeoutRef.current);
    oscillatorRef.current?.stop();
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      await audioContextRef.current.close();
    }
  });

  const playBeep = useEffectEvent(async (frequencyInHz: number, durationInMs: number) => {
    await cleanupBeep();

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequencyInHz;
    oscillator.connect(audioContext.destination);
    oscillator.start();

    audioContextRef.current = audioContext;
    oscillatorRef.current = oscillator;

    timeoutRef.current = setTimeout(async () => {
      await cleanupBeep();
    }, durationInMs);
  });

  useEffect(() => {
    if (isPlaying && currentDuration <= 10 && currentDuration > 1) {
      playBeep(440, 700);
    } else if (isPlaying && currentDuration <= 1 && currentDuration > 0) {
      playBeep(880, 1000);
    }
  }, [currentDuration, isPlaying]);
}
