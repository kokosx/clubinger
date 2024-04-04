import { useEffect } from "react";

export const useOnScrollDown = (callback: () => void) => {
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      callback();
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback]);
};
