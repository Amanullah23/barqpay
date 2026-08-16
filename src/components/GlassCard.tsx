import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-4 ${onClick ? "cursor-pointer hover:bg-white/[0.14] transition-colors" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
