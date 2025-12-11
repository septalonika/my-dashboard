"use client";

interface LeadAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function LeadAvatar({ name, size = "md" }: LeadAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      className={`${sizeClasses[size]} bg-linear-to-br from-zinc-400 to-zinc-600 rounded-full flex items-center justify-center`}
    >
      <span className="text-white font-semibold">{initials}</span>
    </div>
  );
}
