"use client";

import { useEffect, useRef, useState } from "react";

import { tv } from "@/lib/utils";

const reveal = tv({
  base: "reveal",
  variants: {
    visible: {
      true: "reveal-in",
    },
  },
});

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("reveal-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={reveal({ visible, class: className })}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
