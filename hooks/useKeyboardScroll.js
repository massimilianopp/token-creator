import { useEffect } from "react";

export function useKeyboardScroll() {
  useEffect(() => {
    const handleFocus = (e) => {
      const el = e.target;
      if (!["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      
      // Attendre que le clavier soit complètement ouvert (600ms sur iOS)
      setTimeout(() => {
        el.scrollIntoView({ 
          behavior: "smooth", 
          block: "center"
        });
      }, 600);
    };

    const handleResize = () => {
      // Quand le clavier s'ouvre, window.visualViewport change
      // On scrolle l'élément actif dans la zone visible
      const el = document.activeElement;
      if (!el || !["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      
      setTimeout(() => {
        el.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      }, 100);
    };

    document.addEventListener("focusin", handleFocus);
    window.visualViewport?.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("focusin", handleFocus);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);
}