import { useEffect, useState } from "react";

function useElementOnScreen(el: HTMLElement, callback: () => void) {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        //@ts-expect-error
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.5 },
    );

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);

  useEffect(() => {
    setRef(el);
  }, [el]);

  return { ref };
}

export default useElementOnScreen;
