import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { VoiceVisualizer } from "@/components/VoiceVisualizer";
import { ConversationMessage } from "@/components/ConversationMessage";
import { LanguageSelector } from "@/components/LanguageSelector";
import { GuidedWorkflow, type Workflow } from "@/components/GuidedWorkflow";
import { WorkflowSelector } from "@/components/WorkflowSelector";
import { FAQSection } from "@/components/FAQSection";
import { WebSearchFeedback } from "@/components/WebSearchFeedback";
import { VoiceSelector, type VoiceSettings } from "@/components/VoiceSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ChatHistoryPanel } from "@/components/ChatHistoryPanel";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useChatHistory } from "@/hooks/useChatHistory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mic, MicOff, Download, Volume2, VolumeX, Send, Link, BookOpen, ListChecks, HelpCircle, Globe, History } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [taxLawMode, setTaxLawMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languageName, setLanguageName] = useState<string>("");
  const [showWorkflows, setShowWorkflows] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceId: "",
    rate: 1,
    pitch: 1,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();
  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();
  const {
    sessions,
    currentSessionId,
    createNewSession,
    updateSession,
    loadSession,
    deleteSession,
    clearAllHistory,
  } = useChatHistory();

  useEffect(() => {
    if (transcript && !isListening) {
      handleTranscript(transcript);
    }
  }, [transcript, isListening]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isProcessing]);

  // Voice settings are now managed by VoiceSelector with localStorage persistence
  // The VoiceSelector automatically syncs with language changes

  // Save messages to current session whenever they change
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      updateSession(currentSessionId, messages);
    }
  }, [messages, currentSessionId, updateSession]);

  // Create a new session when starting fresh conversation
  useEffect(() => {
    if (selectedLanguage && !currentSessionId && messages.length === 0) {
      createNewSession();
    }
  }, [selectedLanguage, currentSessionId, messages.length, createNewSession]);

  const handleTranscript = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    if (searchMode) {
      setLastSearchQuery(text);
    }

    // Build conversation context from recent messages
    const conversationContext = messages
      .slice(-5)
      .map(m => `${m.role}: ${m.content.slice(0, 100)}`)
      .join("; ");

    try {
      const requestBody: any = {
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        language: selectedLanguage,
        languageName: languageName,
        conversationContext: conversationContext,
      };

      if (searchMode) {
        requestBody.searchQuery = text;
      }

      if (urlMode && text.match(/^https?:\/\//)) {
        requestBody.url = text;
      }

      if (taxLawMode) {
        requestBody.useTaxLawReference = true;
      }

      const { data, error } = await supabase.functions.invoke("chat-ai", {
        body: requestBody,
      });

      if (error) throw error;

      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      toast.success("Listening... Speak now!");
    }
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
      toast.success("Speech stopped");
    }
  };

  const downloadTranscript = () => {
    const transcriptText = messages
      .map((m) => {
        const time = m.timestamp.toLocaleTimeString();
        const speaker = m.role === "user" ? "You" : "YourRevenueAI";
        return `[${time}] ${speaker}: ${m.content}`;
      })
      .join("\n\n");

    const blob = new Blob([transcriptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `YourRevenueAI-transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Full transcript downloaded!");
  };

  const downloadMessage = (message: Message, index: number) => {
    const time = message.timestamp.toLocaleTimeString();
    const date = message.timestamp.toLocaleDateString();
    const speaker = message.role === "user" ? "You" : "YourRevenueAI";
    const messageText = `[${date} ${time}] ${speaker}: ${message.content}`;

    const blob = new Blob([messageText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `YourRevenueAI-message-${index + 1}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Message downloaded!");
  };

  const playMessage = (content: string) => {
    speak(content, selectedLanguage || undefined, voiceSettings);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim() || isProcessing) return;
    handleTranscript(textInput);
    setTextInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const handleLanguageSelect = (code: string, name: string) => {
    setSelectedLanguage(code);
    setLanguageName(name);
    // Voice will auto-adjust via useEffect
    toast.success(`Language set to ${name}. Voice adjusted automatically.`);
  };

  const handleWorkflowSelect = (workflow: Workflow) => {
    setActiveWorkflow(workflow);
    setShowWorkflows(false);
  };

  const handleWorkflowComplete = () => {
    toast.success(`${activeWorkflow?.title} workflow completed!`);
    setActiveWorkflow(null);
  };

  const handleFAQQuestion = (question: string) => {
    setTextInput(question);
    setShowFAQ(false);
  };

  const handleExtendSearch = (query: string) => {
    setTextInput(query);
    setSearchMode(true);
  };

  const handleSelectSession = (sessionId: string) => {
    const sessionMessages = loadSession(sessionId);
    if (sessionMessages) {
      setMessages(sessionMessages);
      setShowHistory(false);
      toast.success("Chat session loaded");
    }
  };

  const handleNewSession = () => {
    setMessages([]);
    createNewSession();
    setShowHistory(false);
    toast.success("New conversation started");
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    toast.success("Session deleted");
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setMessages([]);
    toast.success("All history cleared");
  };

  // Language selector screen
  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
        <header className="relative border-b border-border/30 glass-effect">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold font-heading gradient-text text-center">
                  YourRevenueAI
                </h1>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                  Kenya Revenue Authority AI Tax Assistant
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="relative flex-1 container mx-auto px-4 py-8 flex flex-col max-w-4xl">
          <LanguageSelector onLanguageSelect={handleLanguageSelect} />
        </main>
        <footer className="relative border-t border-border/30 glass-effect py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            Kenya Revenue Authority AI Tax Assistant - Powered by Advanced AI
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-mesh flex flex-col relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
      
      {/* Header - Fixed */}
      <header className="relative border-b border-border/30 glass-effect flex-shrink-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-heading gradient-text">
                YourRevenueAI
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kenya Revenue Authority AI Tax Assistant
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <VoiceSelector
                selectedLanguage={selectedLanguage}
                onVoiceChange={setVoiceSettings}
                currentSettings={voiceSettings}
              />
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTranscript}
                  className="gap-2 glass-effect border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="relative flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {/* Voice Visualizer */}
          {(isListening || isSpeaking) && (
            <Card className="mb-4 p-6 glass-effect border-primary/30 shadow-glow">
              <div className="flex flex-col items-center justify-center space-y-3">
                <VoiceVisualizer isActive={isListening} isSpeaking={isSpeaking} />
                <p className="text-sm text-muted-foreground text-center font-medium">
                  {isListening ? "Listening..." : "Speaking..."}
                </p>
                {transcript && isListening && (
                  <p className="text-sm text-primary text-center italic animate-pulse">"{transcript}"</p>
                )}
              </div>
            </Card>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            <Button
              size="sm"
              onClick={handleVoiceToggle}
              disabled={isProcessing}
              className={`gap-2 transition-all duration-300 hover:scale-105 ${
                isListening
                  ? "bg-destructive hover:bg-destructive/90 shadow-glow"
                  : "bg-gradient-primary hover:opacity-90 shadow-soft"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? "Stop" : "Voice"}
            </Button>

            <Button
              size="sm"
              variant={searchMode ? "default" : "outline"}
              onClick={() => setSearchMode(!searchMode)}
              className={`gap-2 transition-all duration-300 hover:scale-105 ${
                searchMode 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30 text-white" 
                  : "glass-effect border-primary/30 hover:border-blue-500/50 hover:bg-blue-500/10"
              }`}
            >
              <Globe className="w-4 h-4" />
              Search
              {searchMode && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
            </Button>

            <Button
              size="sm"
              variant={urlMode ? "default" : "outline"}
              onClick={() => setUrlMode(!urlMode)}
              className={`gap-2 transition-all duration-300 hover:scale-105 ${
                urlMode ? "bg-gradient-primary shadow-soft" : "glass-effect border-primary/30"
              }`}
            >
              <Link className="w-4 h-4" />
              URL
            </Button>

            <Button
              size="sm"
              variant={taxLawMode ? "default" : "outline"}
              onClick={() => setTaxLawMode(!taxLawMode)}
              className={`gap-2 transition-all duration-300 hover:scale-105 ${
                taxLawMode ? "bg-gradient-primary shadow-soft" : "glass-effect border-primary/30"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Tax Law
            </Button>

            <Button
              size="sm"
              variant={showWorkflows ? "default" : "outline"}
              onClick={() => {
                setShowWorkflows(!showWorkflows);
                setActiveWorkflow(null);
                setShowFAQ(false);
                setShowHistory(false);
              }}
              className={`gap-2 transition-all duration-300 hover:scale-105 ${
                showWorkflows ? "bg-gradient-primary shadow-soft" : "glass-effect border-primary/30"
              }`}
            >
              <ListChecks className="w-4 h-4" />
              Workflows
            </Button>

            <Button
              size="sm"
              variant={showFAQ ? "default" : "outline"}
              onClick={() => {
                setShowFAQ(!showFAQ);
                setShowWorkflows(false);
                setActiveWorkflow(null);
                setShowHistory(false);
              }}
              className={`gap-2 transition-all duration-300 hover:scale-105 ${
                showFAQ ? "bg-gradient-primary shadow-soft" : "glass-effect border-primary/30"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Button>

            <Button
              size="sm"
              variant={showHistory ? "default" : "outline"}
              onClick={() => {
                setShowHistory(!showHistory);
                setShowFAQ(false);
                setShowWorkflows(false);
                setActiveWorkflow(null);
              }}
              className={`gap-2 transition-all duration-300 hover:scale-105 ${
                showHistory ? "bg-gradient-primary shadow-soft" : "glass-effect border-primary/30"
              }`}
            >
              <History className="w-4 h-4" />
              History
            </Button>

            {isSpeaking && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSpeechToggle}
                className="gap-2 glass-effect border-primary/30 hover:bg-primary/10 transition-all hover:scale-105"
              >
                <VolumeX className="w-4 h-4" />
                Stop
              </Button>
            )}
          </div>

          {/* Web Search Feedback Panel */}
          {searchMode && messages.length > 0 && (
            <div className="mb-4">
              <WebSearchFeedback
                isActive={searchMode}
                lastQuery={lastSearchQuery}
                onExtendSearch={handleExtendSearch}
                onClose={() => setSearchMode(false)}
              />
            </div>
          )}

          {/* Chat History Panel */}
          {showHistory && (
            <div className="mb-4">
              <ChatHistoryPanel
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={handleSelectSession}
                onNewSession={handleNewSession}
                onDeleteSession={handleDeleteSession}
                onClearAll={handleClearAllHistory}
                onClose={() => setShowHistory(false)}
              />
            </div>
          )}

          {/* FAQ Section */}
          {showFAQ && (
            <div className="mb-4">
              <FAQSection onQuestionClick={handleFAQQuestion} />
            </div>
          )}

          {/* Workflow Section */}
          {showWorkflows && !activeWorkflow && (
            <div className="mb-4">
              <WorkflowSelector
                onSelectWorkflow={handleWorkflowSelect}
                onClose={() => setShowWorkflows(false)}
              />
            </div>
          )}

          {activeWorkflow && (
            <div className="mb-4">
              <GuidedWorkflow
                workflow={activeWorkflow}
                onClose={() => setActiveWorkflow(null)}
                onComplete={handleWorkflowComplete}
              />
            </div>
          )}

          {/* Empty State */}
          {messages.length === 0 && !isListening && !showFAQ && !showWorkflows && !showHistory && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-heading gradient-text">YourRevenueAI</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your professional Kenya Revenue Authority tax assistant.
                </p>
                <div className="space-y-2 text-xs text-muted-foreground text-left bg-card/50 p-3 rounded-lg glass-effect border border-primary/20">
                  <p className="font-semibold text-foreground text-sm">How I can assist you:</p>
                  <ul className="space-y-1 pl-3">
                    <li>Tax registration and PIN services</li>
                    <li>iTax system guidance and support</li>
                    <li>eTIMS invoice management</li>
                    <li>Tax filing and payment procedures</li>
                    <li>KRA compliance requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Conversation Messages */}
          {messages.length > 0 && (
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <ConversationMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  onPlay={message.role === "assistant" ? () => playMessage(message.content) : undefined}
                  onDownload={() => downloadMessage(message, index)}
                />
              ))}
              
              {/* Typing Indicator */}
              {isProcessing && <TypingIndicator />}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Fixed Input Area at Bottom */}
      <div className="relative flex-shrink-0 border-t border-border/30 glass-effect z-10">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          {(searchMode || urlMode || taxLawMode) && (
            <div className="mb-2 text-xs text-muted-foreground flex flex-wrap gap-2">
              {searchMode && (
                <span className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-full">
                  <Globe className="w-3 h-3 text-blue-500" />
                  Web search active
                </span>
              )}
              {urlMode && (
                <span className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                  <Link className="w-3 h-3 text-primary" />
                  URL mode active
                </span>
              )}
              {taxLawMode && (
                <span className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                  <BookOpen className="w-3 h-3 text-primary" />
                  Tax Law reference
                </span>
              )}
            </div>
          )}
          <div className="flex gap-2 items-end">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                searchMode 
                  ? "What KRA information would you like me to search for?" 
                  : urlMode 
                  ? "Paste a KRA URL to analyze..."
                  : "Ask me about KRA services, tax matters, or compliance..."
              }
              className="resize-none min-h-[50px] max-h-[150px] bg-background/50 border-primary/30 focus:border-primary/60 transition-all text-sm"
              disabled={isProcessing}
              rows={1}
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isProcessing}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-glow hover:scale-105 transition-all h-[50px] px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-center">
            Press Enter to send - Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
