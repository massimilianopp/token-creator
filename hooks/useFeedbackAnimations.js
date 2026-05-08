"use client";

import { useCallback } from "react";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "./useGSAP";

export function useFeedbackAnimations() {
  const { gsap, createTimeline } = useGSAP();

  // Animation de succès avec effet de confettis
  const showSuccessFeedback = useCallback((element, options = {}) => {
    if (!element) return;

    const {
      message = "Success!",
      duration = DURATIONS.slow,
      showConfetti = true,
    } = options;

    const tl = createTimeline();

    // Animation de l'élément principal
    tl.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.8,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: DURATIONS.normal,
        ease: EASE_CONFIGS.bounce,
      }
    );

    // Effet de brillance
    tl.to(
      element,
      {
        boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
        duration: DURATIONS.quick,
        yoyo: true,
        repeat: 1,
      },
      "-=0.2"
    );

    return tl;
  }, [gsap, createTimeline]);

  // Animation d'erreur avec secousse
  const showErrorFeedback = useCallback((element, options = {}) => {
    if (!element) return;

    const {
      intensity = 10,
      repeat = 3,
    } = options;

    const tl = createTimeline();

    // Effet de secousse
    tl.to(element, {
      x: intensity,
      duration: 0.1,
      ease: "power2.out",
    })
    .to(element, {
      x: -intensity,
      duration: 0.1,
      ease: "power2.out",
    })
    .to(element, {
      x: intensity * 0.5,
      duration: 0.1,
      ease: "power2.out",
    })
    .to(element, {
      x: 0,
      duration: 0.1,
      ease: "power2.out",
    });

    // Changement de couleur temporaire
    const originalBorderColor = element.style.borderColor;
    tl.to(element, {
      borderColor: "var(--red)",
      duration: DURATIONS.quick,
    }, 0)
    .to(element, {
      borderColor: originalBorderColor || "var(--border)",
      duration: DURATIONS.normal,
      delay: 0.5,
    });

    return tl;
  }, [createTimeline]);

  // Animation de chargement avec pulsation
  const showLoadingFeedback = useCallback((element, options = {}) => {
    if (!element) return;

    const {
      pulseScale = 1.02,
      opacity = 0.7,
    } = options;

    const tl = createTimeline({ repeat: -1 });

    tl.to(element, {
      scale: pulseScale,
      opacity,
      duration: DURATIONS.normal,
      ease: EASE_CONFIGS.gentle,
      yoyo: true,
      repeat: 1,
    });

    return tl;
  }, [createTimeline]);

  // Animation de validation en temps réel
  const showValidationFeedback = useCallback((element, isValid, options = {}) => {
    if (!element) return;

    const {
      validColor = "var(--green)",
      invalidColor = "var(--red)",
      neutralColor = "var(--border)",
    } = options;

    const targetColor = isValid === true ? validColor : 
                       isValid === false ? invalidColor : neutralColor;

    return gsap.to(element, {
      borderColor: targetColor,
      duration: DURATIONS.quick,
      ease: EASE_CONFIGS.smooth,
    });
  }, [gsap]);

  // Animation de toast notification
  const showToastNotification = useCallback((container, options = {}) => {
    if (!container) return;

    const {
      message = "Notification",
      type = "info", // info, success, warning, error
      position = "top-right",
      duration = 3000,
    } = options;

    // Créer l'élément toast
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 300px;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Geist', sans-serif;
      font-size: 14px;
      z-index: 999999;
      pointer-events: auto;
      backdrop-filter: blur(20px);
    `;

    // Styles selon le type
    const typeStyles = {
      info: {
        background: "rgba(22,22,22,0.95)",
        border: "1px solid var(--border)",
        color: "var(--text)",
      },
      success: {
        background: "rgba(34,197,94,0.1)",
        border: "1px solid var(--green-border)",
        color: "var(--green)",
      },
      warning: {
        background: "rgba(245,158,11,0.1)",
        border: "1px solid rgba(245,158,11,0.2)",
        color: "var(--amber)",
      },
      error: {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid var(--red-border)",
        color: "var(--red)",
      },
    };

    Object.assign(toast.style, typeStyles[type]);
    toast.textContent = message;

    document.body.appendChild(toast);

    const tl = createTimeline({
      onComplete: () => {
        document.body.removeChild(toast);
      }
    });

    // Animation d'entrée
    tl.fromTo(toast, {
      x: 300,
      opacity: 0,
    }, {
      x: 0,
      opacity: 1,
      duration: DURATIONS.normal,
      ease: EASE_CONFIGS.smooth,
    });

    // Pause
    tl.to({}, { duration: duration / 1000 });

    // Animation de sortie
    tl.to(toast, {
      x: 300,
      opacity: 0,
      duration: DURATIONS.quick,
      ease: EASE_CONFIGS.quick,
    });

    return tl;
  }, [createTimeline]);

  // Animation de progression de formulaire
  const showFormProgress = useCallback((progressBar, percentage, options = {}) => {
    if (!progressBar) return;

    const {
      showPercentage = false,
      color = "var(--green)",
    } = options;

    return gsap.to(progressBar, {
      width: `${percentage}%`,
      backgroundColor: color,
      duration: DURATIONS.normal,
      ease: EASE_CONFIGS.smooth,
    });
  }, [gsap]);

  return {
    showSuccessFeedback,
    showErrorFeedback,
    showLoadingFeedback,
    showValidationFeedback,
    showToastNotification,
    showFormProgress,
  };
}

// Hook pour les animations de status des transactions
export function useTransactionFeedback() {
  const { gsap, createTimeline } = useGSAP();

  const animateTransactionStep = useCallback((stepElement, status, options = {}) => {
    if (!stepElement) return;

    const {
      pendingColor = "var(--muted)",
      processingColor = "var(--text)",
      successColor = "var(--green)",
      errorColor = "var(--red)",
    } = options;

    const indicator = stepElement.querySelector('.step-indicator');
    const text = stepElement.querySelector('.step-text');

    if (!indicator || !text) return;

    const tl = createTimeline();

    switch (status) {
      case "pending":
        tl.to([indicator, text], {
          color: pendingColor,
          duration: DURATIONS.quick,
        });
        break;

      case "processing":
        tl.to([indicator, text], {
          color: processingColor,
          duration: DURATIONS.quick,
        })
        .to(indicator, {
          scale: 1.2,
          duration: DURATIONS.normal,
          ease: EASE_CONFIGS.gentle,
          yoyo: true,
          repeat: -1,
        });
        break;

      case "success":
        tl.killTweensOf(indicator) // Arrêter l'animation de processing
        .to(indicator, {
          scale: 1,
          color: successColor,
          duration: DURATIONS.quick,
        })
        .to(text, {
          color: successColor,
          duration: DURATIONS.quick,
        }, "<")
        .fromTo(stepElement, {
          backgroundColor: "transparent",
        }, {
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          duration: DURATIONS.quick,
        }, "<");
        break;

      case "error":
        tl.killTweensOf(indicator)
        .to([indicator, text], {
          color: errorColor,
          duration: DURATIONS.quick,
        })
        .fromTo(stepElement, {
          x: 0,
        }, {
          x: 5,
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          ease: "power2.out",
        });
        break;
    }

    return tl;
  }, [createTimeline]);

  return {
    animateTransactionStep,
  };
}