import { useEffect, useRef, useState } from "react";

interface IUseIntersectionObserver extends IntersectionObserverInit {
  isObservable?: unknown;
  onIntersectionChange?: (isIntersecting: boolean) => void;
}

const useIntersectionObserver = ({
  isObservable = true,
  onIntersectionChange,
  ...observerOptions
}: IUseIntersectionObserver = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const intersectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isObservable) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          onIntersectionChange?.(true);
        } else {
          setIsIntersecting(false);
          onIntersectionChange?.(false);
        }
      });
    }, observerOptions);

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => {
      if (intersectionRef.current) {
        observer.unobserve(intersectionRef.current);
      }
    };
  }, [isObservable]);

  return {
    intersectionRef,
    isIntersecting,
  };
};

export default useIntersectionObserver;
