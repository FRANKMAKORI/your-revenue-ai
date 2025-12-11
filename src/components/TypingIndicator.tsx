import { Card } from "@/components/ui/card";

export const TypingIndicator = () => {
  return (
    <Card className="p-4 glass-effect border-primary/30 max-w-[80%] mr-auto">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
          AI
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
        </div>
        <span className="text-sm text-muted-foreground ml-2">YourRevenueAI is typing...</span>
      </div>
    </Card>
  );
};
