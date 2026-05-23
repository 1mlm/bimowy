"use client";
import { type RefObject, useEffect, useState } from "react";

export function useIsFocused(ref: RefObject<HTMLElement | null>) {
  const [isFocused, setIsFocused] = useState(false);

  const focusEvents = ["focus", "mouseenter"];
  const blurEvents = ["blur", "mouseleave"];

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    focusEvents.forEach((event) => {
      element.addEventListener(event, handleFocus);
    });
    blurEvents.forEach((event) => {
      element.addEventListener(event, handleBlur);
    });

    return () => {
      focusEvents.forEach((event) => {
        element.removeEventListener(event, handleFocus);
      });
      blurEvents.forEach((event) => {
        element.removeEventListener(event, handleBlur);
      });
    };
  }, [ref]);

  return isFocused;
}
