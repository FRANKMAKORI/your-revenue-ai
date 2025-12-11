import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Trash2, X } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatHistoryPanelProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const ChatHistoryPanel = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAll,
  onClose,
}: ChatHistoryPanelProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="p-4 glass-effect border-primary/30 shadow-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg gradient-text">Chat History</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onNewSession}
            className="gap-2 bg-gradient-primary hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            New
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-64 pr-2">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chat history yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-primary/10 border ${
                  currentSessionId === session.id
                    ? "border-primary/50 bg-primary/10"
                    : "border-transparent"
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(session.updatedAt)} • {session.messages.length} messages
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {sessions.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="w-full mt-4 text-destructive hover:bg-destructive/10 border-destructive/30"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All History
        </Button>
      )}
    </Card>
  );
};
