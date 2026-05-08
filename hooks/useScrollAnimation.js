"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "./useGSAP";

export function useScrollAnimation() {
  const { gsap, fadeInOnScroll } = useGSAP();

  // Animation d'apparition progressive des éléments au scroll
  const animateOnScroll = useCallback((elements, options = {}) => {
    const {
      threshold = 0.1,
      rootMargin = "0px 0px -10% 0px",
      stagger = 0.1,
      direction = "up",
    } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            const fromVars = {
              opacity: 0,
              y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
              x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
            };

            gsap.fromTo(
              element,
              fromVars,
              {
                opacity: 1,
                y: 0,
                x: 0,
                duration: DURATIONS.normal,
                ease: EASE_CONFIGS.smooth,
                delay: index * stagger,
              }
            );

            observer.unobserve(element);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const elementArray = Array.isArray(elements) ? elements : [elements];
    elementArray.forEach((element) => {
      if (element) {
        // Masquer l'élément initialement
        gsap.set(element, { opacity: 0 });
        observer.observe(element);
      }
    });

    return () => {
      elementArray.forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [gsap]);

  return {
    animateOnScroll,
    fadeInOnScroll,
  };
}

// Hook pour les cartes qui apparaissent au scroll
export function useCardReveal() {
  const { animateOnScroll } = useScrollAnimation();
  
  const revealCards = useCallback((cardContainerRef) => {
    if (!cardContainerRef.current) return;
    
    const cards = cardContainerRef.current.querySelectorAll('.reveal-card');
    
    return animateOnScroll(cards, {
      threshold: 0.2,
      stagger: 0.1,
      direction: "up",
    });
  }, [animateOnScroll]);

  return { revealCards };
}

// Hook pour animer les éléments de liste
export function useListAnimation() {
  const { gsap } = useGSAP();

  const staggerList = useCallback((listRef, options = {}) => {
    if (!listRef.current) return;
    
    const {
      duration = DURATIONS.normal,
      stagger = 0.08,
      direction = "up",
    } = options;

    const items = listRef.current.children;
    
    const fromVars = {
      opacity: 0,
      y: direction === "up" ? 20 : -20,
    };

    gsap.fromTo(
      items,
      fromVars,
      {
        opacity: 1,
        y: 0,
        duration,
        ease: EASE_CONFIGS.smooth,
        stagger: stagger,
      }
    );
  }, [gsap]);

  return { staggerList };
}

// Hook pour les animations de progress et loading
export function useProgressAnimation() {
  const { gsap } = useGSAP();

  const animateProgress = useCallback((progressRef, value, options = {}) => {
    if (!progressRef.current) return;
    
    const {
      duration = DURATIONS.slow,
      ease = EASE_CONFIGS.smooth,
      onComplete,
    } = options;

    gsap.to(progressRef.current, {
      width: `${value}%`,
      duration,
      ease,
      onComplete,
    });
  }, [gsap]);

  const pulseElement = useCallback((elementRef, options = {}) => {
    if (!elementRef.current) return;
    
    const {
      scale = 1.05,
      duration = DURATIONS.normal,
    } = options;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(elementRef.current, {
      scale,
      duration,
      ease: EASE_CONFIGS.gentle,
    });

    return tl;
  }, [gsap]);

  return {
    animateProgress,
    pulseElement,
  };
}