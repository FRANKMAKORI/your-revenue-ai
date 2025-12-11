import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, ThumbsUp, ThumbsDown, ExternalLink, X, Globe, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WebSearchFeedbackProps {
  isActive: boolean;
  lastQuery: string;
  onExtendSearch: (query: string) => void;
  onClose: () => void;
}

export const WebSearchFeedback = ({ isActive, lastQuery, onExtendSearch, onClose }: WebSearchFeedbackProps) => {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const [extendedQuery, setExtendedQuery] = useState("");
  const [showExtendInput, setShowExtendInput] = useState(false);

  const suggestedSearches = [
    `${lastQuery} latest updates 2024`,
    `${lastQuery} KRA guidelines`,
    `${lastQuery} step by step process`,
    `${lastQuery} penalties and fines`,
    `${lastQuery} deadlines`,
  ].slice(0, 4);

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    toast.success(type === "positive" 
      ? "Thank you for your positive feedback!" 
      : "We'll work on improving our responses."
    );
  };

  const handleExtendSearch = () => {
    if (extendedQuery.trim()) {
      onExtendSearch(extendedQuery);
      setExtendedQuery("");
      setShowExtendInput(false);
    }
  };

  const handleSuggestedSearch = (query: string) => {
    onExtendSearch(query);
  };

  if (!isActive || !lastQuery) return null;

  return (
    <Card className="p-4 glass-effect border-primary/30 shadow-soft animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-primary">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">Web Search Active</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-destructive/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Last Query Display */}
      <div className="mb-4 p-3 rounded-lg bg-card/50 border border-border/30">
        <p className="text-xs text-muted-foreground mb-1">Last search query:</p>
        <p className="text-sm font-medium text-foreground truncate">{lastQuery}</p>
      </div>

      {/* Feedback Section */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Was this search helpful?</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={feedback === "positive" ? "default" : "outline"}
            onClick={() => handleFeedback("positive")}
            className={cn(
              "gap-2 transition-all",
              feedback === "positive" 
                ? "bg-green-600 hover:bg-green-700" 
                : "glass-effect border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50"
            )}
          >
            <ThumbsUp className="w-4 h-4" />
            Helpful
          </Button>
          <Button
            size="sm"
            variant={feedback === "negative" ? "default" : "outline"}
            onClick={() => handleFeedback("negative")}
            className={cn(
              "gap-2 transition-all",
              feedback === "negative" 
                ? "bg-destructive hover:bg-destructive/90" 
                : "glass-effect border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
            )}
          >
            <ThumbsDown className="w-4 h-4" />
            Not Helpful
          </Button>
        </div>
      </div>

      {/* Suggested Searches */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Extend your research:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedSearches.map((suggestion, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              onClick={() => handleSuggestedSearch(suggestion)}
              className="text-xs glass-effect border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all"
            >
              <Search className="w-3 h-3 mr-1" />
              {suggestion.length > 30 ? suggestion.slice(0, 30) + "..." : suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Search Extension */}
      {!showExtendInput ? (
        <Button
          size="sm"
          onClick={() => setShowExtendInput(true)}
          className="w-full gap-2 bg-gradient-primary hover:opacity-90 shadow-soft transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Custom Search Query
        </Button>
      ) : (
        <div className="space-y-2 animate-in fade-in duration-200">
          <Textarea
            value={extendedQuery}
            onChange={(e) => setExtendedQuery(e.target.value)}
            placeholder="Enter your custom search query..."
            className="resize-none min-h-[60px] bg-background/50 border-primary/30 text-sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleExtendSearch}
              disabled={!extendedQuery.trim()}
              className="flex-1 gap-2 bg-gradient-primary hover:opacity-90"
            >
              <ArrowRight className="w-4 h-4" />
              Search
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowExtendInput(false)}
              className="glass-effect border-primary/30"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* External Resources */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground mb-2">Official KRA Resources:</p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://www.kra.go.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            KRA Website
          </a>
          <a
            href="https://itax.kra.go.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            iTax Portal
          </a>
          <a
            href="https://kenyalaw.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Kenya Law
          </a>
        </div>
      </div>
    </Card>
  );
};
