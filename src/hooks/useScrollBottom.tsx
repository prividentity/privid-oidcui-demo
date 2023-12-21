import { useState, useEffect } from "react";

const useScrollToBottom = (
  threshold = 10,
  targetElement: HTMLElement | null
) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  useEffect(() => {
    if (!targetElement) return;
    const handleScroll = () => {
      const element = targetElement || document.documentElement;
      const scrollable = element.scrollHeight - element.clientHeight;
      const scrolled = element.scrollTop;

      if (scrollable - scrolled <= threshold) {
        setIsScrolledToBottom(true);
      }
    };

    const scrollElement = targetElement || window;
    scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, targetElement]);

  return isScrolledToBottom;
};

export default useScrollToBottom;
