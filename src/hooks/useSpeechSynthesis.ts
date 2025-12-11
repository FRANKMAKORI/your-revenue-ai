import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface VoiceSettings {
  voiceId: string;
  rate: number;
  pitch: number;
}

// Map language codes to BCP 47 language tags for speech synthesis
const languageVoiceMap: Record<string, string> = {
  en: "en-US",
  sw: "sw-KE",
  ki: "sw-KE", // Kikuyu - use Swahili voice as fallback
  kam: "sw-KE", // Kamba - use Swahili voice as fallback
  luo: "sw-KE", // Luo - use Swahili voice as fallback
  som: "so-SO", // Somali
};

// Map voice IDs to their preferred language tags and accent preferences
const voiceIdConfig: Record<string, { lang: string; accent: string; keywords: string[] }> = {
  "en-US-female": { lang: "en-US", accent: "American", keywords: ["samantha", "allison", "ava", "susan", "zira"] },
  "en-US-male": { lang: "en-US", accent: "American", keywords: ["alex", "tom", "david", "mark"] },
  "en-GB-female": { lang: "en-GB", accent: "British", keywords: ["kate", "serena", "hazel", "martha"] },
  "en-GB-male": { lang: "en-GB", accent: "British", keywords: ["daniel", "oliver", "george", "arthur"] },
  "en-AU-female": { lang: "en-AU", accent: "Australian", keywords: ["karen", "lee", "catherine"] },
  "en-KE-female": { lang: "en-KE", accent: "Kenyan", keywords: ["kenya", "african"] },
  "sw-KE-female": { lang: "sw-KE", accent: "Swahili", keywords: ["swahili", "kiswahili"] },
  "sw-KE-male": { lang: "sw-KE", accent: "Swahili", keywords: ["swahili", "kiswahili"] },
  "sw-TZ-female": { lang: "sw-TZ", accent: "Tanzanian", keywords: ["tanzania", "swahili"] },
  "ki-KE-female": { lang: "sw-KE", accent: "Kikuyu", keywords: ["kikuyu", "gikuyu"] },
  "ki-KE-male": { lang: "sw-KE", accent: "Kikuyu", keywords: ["kikuyu", "gikuyu"] },
  "kam-KE-female": { lang: "sw-KE", accent: "Kamba", keywords: ["kamba", "ukambani"] },
  "kam-KE-male": { lang: "sw-KE", accent: "Kamba", keywords: ["kamba", "ukambani"] },
  "luo-KE-female": { lang: "sw-KE", accent: "Luo", keywords: ["luo", "dholuo"] },
  "luo-KE-male": { lang: "sw-KE", accent: "Luo", keywords: ["luo", "dholuo"] },
  "so-SO-female": { lang: "so-SO", accent: "Somali", keywords: ["somali", "soomaali"] },
  "so-SO-male": { lang: "so-SO", accent: "Somali", keywords: ["somali", "soomaali"] },
};

// Extract voice preferences from voice ID
const getVoicePreferences = (voiceId: string) => {
  const config = voiceIdConfig[voiceId];
  const gender = voiceId.includes("female") ? "female" : voiceId.includes("male") ? "male" : null;
  return {
    lang: config?.lang || "en-US",
    accent: config?.accent || "Default",
    keywords: config?.keywords || [],
    gender,
  };
};

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, languageCode?: string, settings?: VoiceSettings) => {
    if (!window.speechSynthesis) {
      toast.error("Speech synthesis is not supported in your browser");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply rate and pitch from settings
    if (settings) {
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
    }
    
    // Get voice preferences from settings
    const voicePrefs = settings?.voiceId 
      ? getVoicePreferences(settings.voiceId)
      : { lang: languageVoiceMap[languageCode || "en"] || "en-US", accent: "Default", keywords: [], gender: null };
    
    utterance.lang = voicePrefs.lang;
    
    // Try to find the best matching voice based on user preferences
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = voicePrefs.lang.split('-')[0];
    const exactLangMatch = voicePrefs.lang;
    
    // Score and sort voices by match quality
    const scoredVoices = voices.map(voice => {
      let score = 0;
      const nameLower = voice.name.toLowerCase();
      const voiceLang = voice.lang;
      
      // Exact language match (e.g., en-GB)
      if (voiceLang === exactLangMatch) score += 100;
      // Language prefix match (e.g., en)
      else if (voiceLang.startsWith(langPrefix)) score += 50;
      
      // Accent keyword matching
      voicePrefs.keywords.forEach(keyword => {
        if (nameLower.includes(keyword.toLowerCase())) score += 30;
      });
      
      // Gender preference matching
      if (voicePrefs.gender === "female") {
        const femaleKeywords = ["female", "woman", "samantha", "victoria", "karen", "moira", "kate", "serena", "hazel", "allison", "ava", "susan", "zira", "catherine"];
        if (femaleKeywords.some(k => nameLower.includes(k))) score += 20;
      } else if (voicePrefs.gender === "male") {
        const maleKeywords = ["male", "man", "daniel", "alex", "david", "mark", "tom", "oliver", "george", "arthur", "fred"];
        if (maleKeywords.some(k => nameLower.includes(k))) score += 20;
      }
      
      // Prefer local/native voices
      if (voice.localService) score += 5;
      
      return { voice, score };
    });
    
    // Sort by score (highest first) and pick the best match
    scoredVoices.sort((a, b) => b.score - a.score);
    
    const bestMatch = scoredVoices.find(v => v.score > 0);
    if (bestMatch) {
      utterance.voice = bestMatch.voice;
      console.log(`Selected voice: ${bestMatch.voice.name} (${bestMatch.voice.lang}) - Score: ${bestMatch.score}`);
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      toast.error("Failed to synthesize speech");
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
  };
};
