"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

// Configurations d'easing personnalisées pour l'app
export const EASE_CONFIGS = {
  smooth: "power2.out",
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  quick: "power3.out",
  gentle: "power1.out",
};

// Durées standards
export const DURATIONS = {
  instant: 0.1,
  quick: 0.2,
  normal: 0.3,
  slow: 0.5,
  page: 0.4,
};

export function useGSAP() {
  const timelineRef = useRef(null);

  // Animation de page entrante
  const pageEnter = useCallback((element, options = {}) => {
    const {
      duration = DURATIONS.page,
      ease = EASE_CONFIGS.smooth,
      delay = 0,
      direction = "up",
      onComplete,
    } = options;

    const fromVars = {
      opacity: 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
      x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
    };

    return gsap.fromTo(
      element,
      fromVars,
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        ease,
        delay,
        onComplete,
      }
    );
  }, []);

  // Animation de page sortante
  const pageExit = useCallback((element, options = {}) => {
    const {
      duration = DURATIONS.quick,
      ease = EASE_CONFIGS.quick,
      direction = "up",
      onComplete,
    } = options;

    const toVars = {
      opacity: 0,
      y: direction === "up" ? -10 : direction === "down" ? 10 : 0,
      x: direction === "left" ? -10 : direction === "right" ? 10 : 0,
      duration,
      ease,
      onComplete,
    };

    return gsap.to(element, toVars);
  }, []);

  // Animation de montée échelonnée pour les listes
  const staggerUp = useCallback((elements, options = {}) => {
    const {
      duration = DURATIONS.normal,
      ease = EASE_CONFIGS.smooth,
      stagger = 0.1,
      delay = 0,
    } = options;

    return gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        delay,
      }
    );
  }, []);

  // Animation de mise à l'échelle douce
  const scaleIn = useCallback((element, options = {}) => {
    const {
      duration = DURATIONS.quick,
      ease = EASE_CONFIGS.bounce,
      delay = 0,
      onComplete,
    } = options;

    return gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration,
        ease,
        delay,
        onComplete,
      }
    );
  }, []);

  // Animation de feedback pour boutons
  const buttonPress = useCallback((element, options = {}) => {
    const {
      duration = DURATIONS.instant,
      ease = EASE_CONFIGS.quick,
      scale = 0.98,
    } = options;

    const tl = gsap.timeline();
    tl.to(element, {
      scale,
      duration,
      ease,
    }).to(element, {
      scale: 1,
      duration,
      ease,
    });

    return tl;
  }, []);

  // Animation d'apparition au scroll
  const fadeInOnScroll = useCallback((element, options = {}) => {
    const {
      duration = DURATIONS.normal,
      ease = EASE_CONFIGS.smooth,
      threshold = 0.2,
    } = options;

    // Observer pour déclencher l'animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration,
                ease,
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Animation de loading spinner
  const spin = useCallback((element, options = {}) => {
    const { duration = 1, ease = "none" } = options;

    return gsap.to(element, {
      rotation: 360,
      duration,
      ease,
      repeat: -1,
    });
  }, []);

  // Créer une timeline
  const createTimeline = useCallback((options = {}) => {
    const tl = gsap.timeline(options);
    timelineRef.current = tl;
    return tl;
  }, []);

  // Nettoyage des animations
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      gsap.killTweensOf("*");
    };
  }, []);

  return {
    pageEnter,
    pageExit,
    staggerUp,
    scaleIn,
    buttonPress,
    fadeInOnScroll,
    spin,
    createTimeline,
    gsap,
    EASE_CONFIGS,
    DURATIONS,
  };
}

// Hook spécialisé pour les transitions de page
export function usePageTransition() {
  const { pageEnter, pageExit, createTimeline } = useGSAP();

  const transitionIn = useCallback((element) => {
    const tl = createTimeline();
    
    // Animation du contenu principal
    tl.fromTo(
      element,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: DURATIONS.page,
        ease: EASE_CONFIGS.smooth,
      }
    );

    // Animation des éléments enfants en cascade
    const children = element.children;
    if (children.length > 0) {
      tl.fromTo(
        children,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: DURATIONS.normal,
          ease: EASE_CONFIGS.smooth,
          stagger: 0.08,
        },
        "-=0.2"
      );
    }

    return tl;
  }, [pageEnter, createTimeline]);

  const transitionOut = useCallback((element) => {
    return pageExit(element, {
      duration: DURATIONS.quick,
      direction: "up",
    });
  }, [pageExit]);

  return {
    transitionIn,
    transitionOut,
  };
}