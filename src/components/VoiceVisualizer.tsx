import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps {
  isActive: boolean;
  isSpeaking?: boolean;
}

export const VoiceVisualizer = ({ isActive, isSpeaking }: VoiceVisualizerProps) => {
  const [bars] = useState(Array.from({ length: 7 }));

  return (
    <div className="flex items-center justify-center gap-2 h-20">
      {bars.map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-2 rounded-full transition-all duration-300",
            isActive || isSpeaking
              ? "bg-gradient-primary shadow-glow animate-wave"
              : "bg-muted/50 h-8"
          )}
          style={{
            height: isActive || isSpeaking ? `${24 + Math.random() * 24}px` : "32px",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};
