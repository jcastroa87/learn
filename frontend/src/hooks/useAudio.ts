"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  playSuccess,
  playTap,
  playWhoosh,
  playPop,
  playError,
  speak,
  cancelSpeech,
} from "@/lib/audio";

interface UseAudioOptions {
  soundEnabled: boolean;
  language: string;
}

export function useAudio({ soundEnabled, language }: UseAudioOptions) {
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  const success = useCallback(() => {
    if (soundEnabled) playSuccess();
  }, [soundEnabled]);

  const tap = useCallback(() => {
    if (soundEnabled) playTap();
  }, [soundEnabled]);

  const whoosh = useCallback(() => {
    if (soundEnabled) playWhoosh();
  }, [soundEnabled]);

  const pop = useCallback(() => {
    if (soundEnabled) playPop();
  }, [soundEnabled]);

  const error = useCallback(() => {
    if (soundEnabled) playError();
  }, [soundEnabled]);

  const tts = useCallback(
    (text: string) => {
      if (soundEnabled) {
        speak(text, languageRef.current);
      }
    },
    [soundEnabled]
  );

  return { success, tap, whoosh, pop, error, tts };
}
