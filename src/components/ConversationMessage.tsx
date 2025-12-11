import { cn } from "@/lib/utils";
import { User, Bot, Volume2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMessage } from "@/lib/formatMessage";

interface ConversationMessageProps {
  role: "user" | "assistant";
  content: string;
  onPlay?: () => void;
  onDownload?: () => void;
}

export const ConversationMessage = ({ role, content, onPlay, onDownload }: ConversationMessageProps) => {
  const isUser = role === "user";
  const formattedContent = isUser ? content : formatMessage(content);

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500 transition-all hover:scale-[1.01]",
        isUser ? "glass-effect border border-primary/20" : "bg-card/60 border border-border/30"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-soft",
          isUser ? "bg-gradient-primary text-white" : "bg-gradient-secondary text-white"
        )}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold text-foreground">
          {isUser ? "You" : "YourRevenueAI"}
        </p>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{formattedContent}</p>
        {(onPlay || onDownload) && (
          <div className="flex gap-2 mt-3">
            {onPlay && (
              <Button
                size="sm"
                variant="outline"
                onClick={onPlay}
                className="h-8 gap-2 text-xs glass-effect border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Play Audio
              </Button>
            )}
            {onDownload && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDownload}
                className="h-8 gap-2 text-xs glass-effect border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
