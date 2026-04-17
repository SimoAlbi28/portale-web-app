"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion } from "framer-motion";

type NavItem = { label: string; href: string };

export function MobileMenu({
  items,
  onNavigate,
  onClose,
  triggerRef,
}: {
  items: NavItem[];
  onNavigate: (href: string) => void;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (triggerRef?.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, triggerRef]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="fixed top-[4.25rem] left-6 z-[95] md:hidden w-48 rounded-xl border border-white/10 bg-[#07021c]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-2"
    >
      {items.map((item) => (
        <button
          key={item.href}
          type="button"
          data-cursor="hover"
          onClick={() => onNavigate(item.href)}
          className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
        >
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}
