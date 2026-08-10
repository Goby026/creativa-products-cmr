import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    let observer: IntersectionObserver;
    let mutationObserver: MutationObserver;

    const observeNew = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        ".reveal:not(.reveal-visible)",
      );
      elements.forEach((el) => observer.observe(el));
    };

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );

    observeNew();

    mutationObserver = new MutationObserver(observeNew);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
