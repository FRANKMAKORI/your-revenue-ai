import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  region?: string;
}

const languages: Language[] = [
  // International
  { code: "en", name: "English", nativeName: "English", region: "International" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", region: "International" },
  
  // Central Kenya (Bantu)
  { code: "ebu", name: "Embu", nativeName: "Kĩembu", region: "Central Kenya" },
  { code: "ki", name: "Kikuyu", nativeName: "Gĩkũyũ", region: "Central Kenya" },
  { code: "mbe", name: "Mbeere", nativeName: "Kĩmbeere", region: "Central Kenya" },
  { code: "mer", name: "Meru", nativeName: "Kĩmĩrũ", region: "Central Kenya" },
  { code: "tha", name: "Tharaka", nativeName: "Kitharaka", region: "Central Kenya" },
  
  // Eastern Kenya (Bantu)
  { code: "kam", name: "Kamba", nativeName: "Kikamba", region: "Eastern Kenya" },
  { code: "dav", name: "Taita", nativeName: "Kidawida", region: "Eastern Kenya" },
  { code: "tav", name: "Taveta", nativeName: "Kitaveta", region: "Eastern Kenya" },
  
  // Western Kenya (Luhya sub-tribes)
  { code: "buk", name: "Bukusu", nativeName: "Lubukusu", region: "Western Kenya" },
  { code: "isu", name: "Isukha", nativeName: "Lwisukha", region: "Western Kenya" },
  { code: "khy", name: "Khayo", nativeName: "Olukhayo", region: "Western Kenya" },
  { code: "luy", name: "Luhya", nativeName: "Luluhya", region: "Western Kenya" },
  { code: "mra", name: "Maragoli", nativeName: "Lulogooli", region: "Western Kenya" },
  { code: "sam", name: "Samia", nativeName: "Lusamia", region: "Western Kenya" },
  { code: "tir", name: "Tiriki", nativeName: "Ludirichi", region: "Western Kenya" },
  { code: "wan", name: "Wanga", nativeName: "Oluwanga", region: "Western Kenya" },
  { code: "ban", name: "Banyala", nativeName: "Lunyala", region: "Western Kenya" },
  { code: "guz", name: "Kisii", nativeName: "Ekegusii", region: "Western Kenya" },
  { code: "kuj", name: "Kuria", nativeName: "Ikuria", region: "Western Kenya" },
  
  // Nyanza Region (Nilotic)
  { code: "luo", name: "Luo", nativeName: "Dholuo", region: "Nyanza" },
  { code: "sub", name: "Suba", nativeName: "Suba", region: "Nyanza" },
  
  // Rift Valley (Nilotic & Cushitic)
  { code: "elo", name: "El Molo", nativeName: "El Molo", region: "Rift Valley" },
  { code: "kal", name: "Kalenjin", nativeName: "Kalenjin", region: "Rift Valley" },
  { code: "kei", name: "Keiyo", nativeName: "Keiyo", region: "Rift Valley" },
  { code: "mrk", name: "Marakwet", nativeName: "Markweta", region: "Rift Valley" },
  { code: "nan", name: "Nandi", nativeName: "Kalenjin", region: "Rift Valley" },
  { code: "pko", name: "Pokot", nativeName: "Pökoot", region: "Rift Valley" },
  { code: "sab", name: "Sabaot", nativeName: "Sabaot", region: "Rift Valley" },
  { code: "tug", name: "Tugen", nativeName: "Tugen", region: "Rift Valley" },
  { code: "mas", name: "Maasai", nativeName: "Maa", region: "Rift Valley" },
  { code: "saq", name: "Samburu", nativeName: "Samburu", region: "Rift Valley" },
  { code: "tuv", name: "Turkana", nativeName: "Turkana", region: "Rift Valley" },
  { code: "oki", name: "Ogiek", nativeName: "Ogiek", region: "Rift Valley" },
  
  // Coastal Kenya (Mijikenda sub-tribes)
  { code: "cho", name: "Chonyi", nativeName: "Chichonyi", region: "Coastal Kenya" },
  { code: "dig", name: "Digo", nativeName: "Chidigo", region: "Coastal Kenya" },
  { code: "dur", name: "Duruma", nativeName: "Chiduruma", region: "Coastal Kenya" },
  { code: "nyf", name: "Giriama", nativeName: "Kigiriama", region: "Coastal Kenya" },
  { code: "jib", name: "Jibana", nativeName: "Chijibana", region: "Coastal Kenya" },
  { code: "kau", name: "Kauma", nativeName: "Chikauma", region: "Coastal Kenya" },
  { code: "kmb", name: "Kambe", nativeName: "Chikambe", region: "Coastal Kenya" },
  { code: "rab", name: "Rabai", nativeName: "Chirabai", region: "Coastal Kenya" },
  { code: "rib", name: "Ribe", nativeName: "Chiribe", region: "Coastal Kenya" },
  { code: "pkb", name: "Pokomo", nativeName: "Kipfokomo", region: "Coastal Kenya" },
  
  // Northern Kenya (Cushitic)
  { code: "bor", name: "Borana", nativeName: "Borana", region: "Northern Kenya" },
  { code: "das", name: "Dasenach", nativeName: "Dasenach", region: "Northern Kenya" },
  { code: "gax", name: "Gabra", nativeName: "Gabra", region: "Northern Kenya" },
  { code: "rel", name: "Rendille", nativeName: "Rendille", region: "Northern Kenya" },
  { code: "sak", name: "Sakuye", nativeName: "Sakuye", region: "Northern Kenya" },
  { code: "som", name: "Somali", nativeName: "Soomaali", region: "Northern Kenya" },
  
  // Other / Minority Groups
  { code: "nub", name: "Nubi", nativeName: "Kinubi", region: "Other" },
  { code: "yaa", name: "Yaaku", nativeName: "Yaaku", region: "Other" },
  { code: "sheng", name: "Sheng", nativeName: "Sheng", region: "Urban" },
];

interface LanguageSelectorProps {
  onLanguageSelect: (languageCode: string, languageName: string) => void;
}

export const LanguageSelector = ({ onLanguageSelect }: LanguageSelectorProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="max-w-2xl w-full p-8 glass-effect border-primary/30 shadow-glow">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Languages className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-heading gradient-text mb-2">
              Welcome to YourRevenueAI
            </h2>
            <p className="text-muted-foreground">
              Choose your preferred language / Chagua lugha yako
            </p>
          </div>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {["International", "Central Kenya", "Eastern Kenya", "Western Kenya", "Nyanza", "Rift Valley", "Coastal Kenya", "Northern Kenya", "Other", "Urban"].map((region) => {
              const regionLanguages = languages.filter(lang => lang.region === region);
              if (regionLanguages.length === 0) return null;
              
              return (
                <div key={region} className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                    {region}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {regionLanguages.map((lang) => (
                      <Button
                        key={lang.code}
                        onClick={() => onLanguageSelect(lang.code, lang.name)}
                        variant="outline"
                        size="sm"
                        className="glass-effect border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all h-auto py-3"
                      >
                        <div className="text-left w-full">
                          <div className="font-semibold text-sm">{lang.name}</div>
                          <div className="text-xs text-muted-foreground">{lang.nativeName}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
