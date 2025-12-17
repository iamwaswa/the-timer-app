import { useCallback, useEffect, useRef } from "react";

export function usePlayCountdownBeep(currentDuration: number, isPlaying: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const stopBeep = useCallback(() => {
    if (timeout.current) {
      oscillatorRef.current?.stop();
      audioContextRef.current?.close();
      clearTimeout(timeout.current);
    }
  }, []);

  const playBeep = useCallback(
    (frequencyInHz: number, durationInMs: number) => {
      audioContextRef.current = new AudioContext();
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = "sine";
      oscillatorRef.current.frequency.value = frequencyInHz;
      oscillatorRef.current.connect(audioContextRef.current.destination);
      oscillatorRef.current.start();

      timeout.current = setTimeout(stopBeep, durationInMs);
    },
    [stopBeep],
  );

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

    return stopBeep;
  }, [currentDuration, isPlaying, playBeep, stopBeep]);
}
