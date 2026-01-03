"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  fill?: FillMode;
}

/**
 * Hook for micro-animations using Web Animations API
 */
export function useMicroAnimation() {
  const animationRef = useRef<Animation | null>(null);

  const animate = useCallback(
    (
      element: HTMLElement | null,
      keyframes: Keyframe[] | PropertyIndexedKeyframes,
      options: AnimationOptions = {}
    ) => {
      if (!element) return null;

      // Cancel any existing animation
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      const animation = element.animate(keyframes, {
        duration: options.duration ?? 200,
        easing: options.easing ?? "cubic-bezier(0.4, 0, 0.2, 1)",
        delay: options.delay ?? 0,
        fill: options.fill ?? "forwards",
      });

      animationRef.current = animation;
      return animation;
    },
    []
  );

  // Preset animations
  const fadeIn = useCallback(
    (element: HTMLElement | null, duration = 200) => {
      return animate(element, [{ opacity: 0 }, { opacity: 1 }], { duration });
    },
    [animate]
  );

  const fadeOut = useCallback(
    (element: HTMLElement | null, duration = 200) => {
      return animate(element, [{ opacity: 1 }, { opacity: 0 }], { duration });
    },
    [animate]
  );

  const scaleIn = useCallback(
    (element: HTMLElement | null, duration = 200) => {
      return animate(
        element,
        [
          { transform: "scale(0.95)", opacity: 0 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
      );
    },
    [animate]
  );

  const slideUp = useCallback(
    (element: HTMLElement | null, distance = 10, duration = 200) => {
      return animate(
        element,
        [
          { transform: `translateY(${distance}px)`, opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        { duration }
      );
    },
    [animate]
  );

  const slideDown = useCallback(
    (element: HTMLElement | null, distance = 10, duration = 200) => {
      return animate(
        element,
        [
          { transform: "translateY(0)", opacity: 1 },
          { transform: `translateY(${distance}px)`, opacity: 0 },
        ],
        { duration }
      );
    },
    [animate]
  );

  const pulse = useCallback(
    (element: HTMLElement | null, color = "rgba(34, 197, 94, 0.3)") => {
      return animate(
        element,
        [
          { backgroundColor: color },
          { backgroundColor: "transparent" },
        ],
        { duration: 600, easing: "ease-out" }
      );
    },
    [animate]
  );

  const shake = useCallback(
    (element: HTMLElement | null, intensity = 5) => {
      return animate(
        element,
        [
          { transform: "translateX(0)" },
          { transform: `translateX(-${intensity}px)` },
          { transform: `translateX(${intensity}px)` },
          { transform: `translateX(-${intensity}px)` },
          { transform: "translateX(0)" },
        ],
        { duration: 300, easing: "ease-out" }
      );
    },
    [animate]
  );

  return {
    animate,
    fadeIn,
    fadeOut,
    scaleIn,
    slideUp,
    slideDown,
    pulse,
    shake,
  };
}

/**
 * Hook for staggered animations on lists
 */
export function useStaggeredAnimation(
  items: unknown[],
  options: {
    stagger?: number;
    initialDelay?: number;
    duration?: number;
  } = {}
) {
  const { stagger = 50, initialDelay = 0, duration = 200 } = options;
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    items.forEach((_, index) => {
      const delay = initialDelay + index * stagger;
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, index]));
      }, delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
      setVisibleItems(new Set());
    };
  }, [items, stagger, initialDelay]);

  const getItemStyle = useCallback(
    (index: number): React.CSSProperties => ({
      opacity: visibleItems.has(index) ? 1 : 0,
      transform: visibleItems.has(index) ? "translateY(0)" : "translateY(10px)",
      transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    }),
    [visibleItems, duration]
  );

  const isVisible = useCallback(
    (index: number) => visibleItems.has(index),
    [visibleItems]
  );

  return { getItemStyle, isVisible };
}

/**
 * Hook for number counter animation
 */
export function useCountAnimation(
  targetValue: number,
  options: {
    duration?: number;
    formatter?: (value: number) => string;
    easing?: (t: number) => number;
  } = {}
) {
  const {
    duration = 500,
    formatter = (v) => v.toFixed(2),
    easing = (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
  } = options;

  const [displayValue, setDisplayValue] = useState(targetValue);
  const startValueRef = useRef(targetValue);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startValue = startValueRef.current;
    const startTime = performance.now();

    const animateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      const currentValue = startValue + (targetValue - startValue) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animateValue);
      } else {
        startValueRef.current = targetValue;
      }
    };

    frameRef.current = requestAnimationFrame(animateValue);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetValue, duration, easing]);

  return formatter(displayValue);
}

/**
 * Hook for typing animation effect
 */
export function useTypingAnimation(
  text: string,
  options: {
    speed?: number;
    delay?: number;
    onComplete?: () => void;
  } = {}
) {
  const { speed = 50, delay = 0, onComplete } = options;
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete]);

  return { displayText, isComplete };
}
