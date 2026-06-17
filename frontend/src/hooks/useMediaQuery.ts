import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function useSidebarState() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setIsOpen(false);
  }, [isDesktop]);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return { isOpen, isDesktop, toggle, close };
}
