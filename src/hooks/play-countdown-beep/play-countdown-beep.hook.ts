import { useEffect, useEffectEvent, useRef } from "react";

export function usePlayCountdownBeep(currentDuration: number, isPlaying: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const playBeep = useEffectEvent((frequencyInHz: number, durationInMs: number) => {
    audioContextRef.current = new AudioContext();
    oscillatorRef.current = audioContextRef.current.createOscillator();
    oscillatorRef.current.type = "sine";
    oscillatorRef.current.frequency.value = frequencyInHz;
    oscillatorRef.current.connect(audioContextRef.current.destination);
    oscillatorRef.current.start();

    const timeout = setTimeout(() => {
      oscillatorRef.current?.stop();
      audioContextRef.current?.close();
      clearTimeout(timeout);
    }, durationInMs);
  });

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (currentDuration <= 10 && currentDuration > 1) {
      playBeep(440, 700);
    }

    if (currentDuration <= 1 && currentDuration > 0) {
      playBeep(880, 1000);
    }
  }, [currentDuration, isPlaying]);
}
