import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_30px_90px_-45px_rgba(8,47,73,0.45)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
