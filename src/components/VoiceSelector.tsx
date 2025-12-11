import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2, Settings2, Play } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface VoiceSettings {
  voiceId: string;
  rate: number;
  pitch: number;
}

interface VoiceSelectorProps {
  selectedLanguage: string;
  onVoiceChange: (settings: VoiceSettings) => void;
  currentSettings: VoiceSettings;
}

const STORAGE_KEY = "yourrevenueai-voice-settings";

// Voice options mapped by language with accent info
const voicesByLanguage: Record<string, { id: string; name: string; accent: string; sampleText: string }[]> = {
  en: [
    { id: "en-US-female", name: "Sarah", accent: "American Female", sampleText: "Hello, I'm Sarah with an American accent." },
    { id: "en-US-male", name: "James", accent: "American Male", sampleText: "Hello, I'm James with an American accent." },
    { id: "en-GB-female", name: "Emma", accent: "British Female", sampleText: "Hello, I'm Emma with a British accent." },
    { id: "en-GB-male", name: "Oliver", accent: "British Male", sampleText: "Hello, I'm Oliver with a British accent." },
    { id: "en-AU-female", name: "Charlotte", accent: "Australian Female", sampleText: "G'day, I'm Charlotte with an Australian accent." },
    { id: "en-KE-female", name: "Amina", accent: "Kenyan Female", sampleText: "Habari, I'm Amina with a Kenyan English accent." },
  ],
  sw: [
    { id: "sw-KE-female", name: "Zawadi", accent: "Swahili Female", sampleText: "Habari, mimi ni Zawadi, msaidizi wako wa kodi." },
    { id: "sw-KE-male", name: "Juma", accent: "Swahili Male", sampleText: "Habari, mimi ni Juma, msaidizi wako wa kodi." },
    { id: "sw-TZ-female", name: "Neema", accent: "Tanzanian Female", sampleText: "Habari, mimi ni Neema kutoka Tanzania." },
  ],
  ki: [
    { id: "ki-KE-female", name: "Wanjiku", accent: "Kikuyu Female", sampleText: "Wĩmwega, nĩ Wanjiku, mũthuuri waku wa mĩthuko." },
    { id: "ki-KE-male", name: "Kamau", accent: "Kikuyu Male", sampleText: "Wĩmwega, nĩ Kamau, mũthuuri waku wa mĩthuko." },
  ],
  kam: [
    { id: "kam-KE-female", name: "Mutheu", accent: "Kamba Female", sampleText: "Uvoo mweu, ni Mutheu, mwĩĩi waku wa musyolo." },
    { id: "kam-KE-male", name: "Mutua", accent: "Kamba Male", sampleText: "Uvoo mweu, ni Mutua, mwĩĩi waku wa musyolo." },
  ],
  luo: [
    { id: "luo-KE-female", name: "Akinyi", accent: "Luo Female", sampleText: "Ber, an Akinyi, jakony mari mar osuru." },
    { id: "luo-KE-male", name: "Ochieng", accent: "Luo Male", sampleText: "Ber, an Ochieng, jakony mari mar osuru." },
  ],
  som: [
    { id: "so-SO-female", name: "Halima", accent: "Somali Female", sampleText: "Salaan, waxaan ahay Halima, kaaliyahaaga canshuurta." },
    { id: "so-SO-male", name: "Ahmed", accent: "Somali Male", sampleText: "Salaan, waxaan ahay Ahmed, kaaliyahaaga canshuurta." },
  ],
};

// Default voices for languages not specifically listed
const defaultVoices = [
  { id: "default-female", name: "Default", accent: "Female Voice", sampleText: "Hello, I'm your tax assistant." },
  { id: "default-male", name: "Default", accent: "Male Voice", sampleText: "Hello, I'm your tax assistant." },
];

// Load settings from localStorage
const loadStoredSettings = (language: string): VoiceSettings | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Return language-specific settings if available
      if (parsed[language]) {
        return parsed[language];
      }
    }
  } catch (error) {
    console.error("Error loading voice settings:", error);
  }
  return null;
};

// Save settings to localStorage
const saveSettings = (language: string, settings: VoiceSettings) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[language] = settings;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error("Error saving voice settings:", error);
  }
};

export const VoiceSelector = ({
  selectedLanguage,
  onVoiceChange,
  currentSettings,
}: VoiceSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  const availableVoices = voicesByLanguage[selectedLanguage] || defaultVoices;

  // Load stored settings on mount and when language changes
  useEffect(() => {
    const storedSettings = loadStoredSettings(selectedLanguage);
    if (storedSettings) {
      onVoiceChange(storedSettings);
    } else {
      // Auto-select first voice for the language
      const defaultVoice = availableVoices[0];
      if (defaultVoice) {
        const newSettings = { ...currentSettings, voiceId: defaultVoice.id };
        onVoiceChange(newSettings);
        saveSettings(selectedLanguage, newSettings);
      }
    }
  }, [selectedLanguage]);

  // Save settings whenever they change
  useEffect(() => {
    if (currentSettings.voiceId) {
      saveSettings(selectedLanguage, currentSettings);
    }
  }, [currentSettings, selectedLanguage]);

  const handleVoiceSelect = (voiceId: string) => {
    const newSettings = { ...currentSettings, voiceId };
    onVoiceChange(newSettings);
    
    // Get accent name for toast
    const voice = availableVoices.find(v => v.id === voiceId);
    if (voice) {
      toast.success(`Voice changed to ${voice.name} (${voice.accent})`);
    }
  };

  const handleRateChange = (value: number[]) => {
    onVoiceChange({ ...currentSettings, rate: value[0] });
  };

  const handlePitchChange = (value: number[]) => {
    onVoiceChange({ ...currentSettings, pitch: value[0] });
  };

  const handlePreviewVoice = (voiceId?: string) => {
    const targetVoiceId = voiceId || currentSettings.voiceId;
    const voice = availableVoices.find(v => v.id === targetVoiceId);
    
    if (!voice) {
      toast.error("No voice selected for preview");
      return;
    }

    if (isPreviewing) {
      window.speechSynthesis.cancel();
      setIsPreviewing(false);
      return;
    }

    setIsPreviewing(true);
    
    const utterance = new SpeechSynthesisUtterance(voice.sampleText);
    utterance.rate = currentSettings.rate;
    utterance.pitch = currentSettings.pitch;
    
    // Try to match the selected voice
    const voices = window.speechSynthesis.getVoices();
    const langCode = targetVoiceId.split("-").slice(0, 2).join("-");
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
    
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    
    utterance.onend = () => setIsPreviewing(false);
    utterance.onerror = () => setIsPreviewing(false);
    
    window.speechSynthesis.speak(utterance);
    toast.success(`Playing preview: ${voice.name}`);
  };

  const selectedVoice = availableVoices.find(v => v.id === currentSettings.voiceId) || availableVoices[0];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 glass-effect border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all"
        >
          <Settings2 className="w-4 h-4" />
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">{selectedVoice?.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-effect border-primary/30" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Voice Selection</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePreviewVoice()}
                className={`gap-1 h-7 px-2 ${isPreviewing ? "text-primary animate-pulse" : ""}`}
              >
                <Play className="w-3 h-3" />
                {isPreviewing ? "Stop" : "Preview"}
              </Button>
            </div>
            <Select
              value={currentSettings.voiceId || availableVoices[0]?.id}
              onValueChange={handleVoiceSelect}
            >
              <SelectTrigger className="w-full bg-background/50 border-primary/30">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-primary/30">
                {availableVoices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-primary" />
                      <span>{voice.name}</span>
                      <span className="text-xs text-muted-foreground">({voice.accent})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Speech Rate</Label>
              <span className="text-xs text-muted-foreground">{currentSettings.rate.toFixed(1)}x</span>
            </div>
            <Slider
              value={[currentSettings.rate]}
              onValueChange={handleRateChange}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Pitch</Label>
              <span className="text-xs text-muted-foreground">{currentSettings.pitch.toFixed(1)}</span>
            </div>
            <Slider
              value={[currentSettings.pitch]}
              onValueChange={handlePitchChange}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Voice preferences are saved automatically. Click Preview to hear the selected voice with current settings.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
