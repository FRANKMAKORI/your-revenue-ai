import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "PIN Registration",
    question: "How do I register for a KRA PIN?",
    answer: "Visit the iTax portal at itax.kra.go.ke, click on 'New PIN Registration', select your taxpayer type (Individual/Non-Individual), fill in your personal/business details, upload required documents (ID/Passport), and submit. You'll receive your PIN certificate via email within 24-48 hours."
  },
  {
    category: "PIN Registration",
    question: "What documents are required for KRA PIN registration?",
    answer: "For individuals: National ID or Passport. For businesses: Certificate of Incorporation, CR12 form, Directors' IDs/Passports, and KRA PINs of all directors. Foreign nationals need a valid passport and work permit."
  },
  {
    category: "iTax",
    question: "How do I reset my iTax password?",
    answer: "Go to itax.kra.go.ke, click 'Forgot Password', enter your KRA PIN, answer security questions or use OTP sent to your registered email/phone. Create a new password following the requirements (8+ characters, uppercase, lowercase, number, special character)."
  },
  {
    category: "iTax",
    question: "How do I file my annual tax returns?",
    answer: "Log into iTax, go to Returns > File Returns > Income Tax - Resident Individual. Complete the return form with income details, deductions, and tax credits. Submit before June 30th each year to avoid penalties of KES 2,000 per month for individuals."
  },
  {
    category: "VAT",
    question: "Who is required to register for VAT?",
    answer: "Businesses with annual taxable turnover exceeding KES 5 million must register for VAT. Registration is done through iTax. VAT returns are filed monthly by the 20th of the following month."
  },
  {
    category: "VAT",
    question: "What is the current VAT rate in Kenya?",
    answer: "Standard VAT rate is 16%. Some goods are zero-rated (exports, basic foodstuffs) or exempt (unprocessed agricultural products, financial services). Digital services provided by non-residents are taxed at 16%."
  },
  {
    category: "eTIMS",
    question: "What is eTIMS and who needs to use it?",
    answer: "Electronic Tax Invoice Management System (eTIMS) is mandatory for all VAT-registered taxpayers. It validates tax invoices in real-time. Businesses must integrate their systems or use the KRA eTIMS app/web portal to generate compliant invoices."
  },
  {
    category: "eTIMS",
    question: "How do I set up eTIMS for my business?",
    answer: "Apply through iTax for eTIMS onboarding, receive your Control Unit (CU) credentials, integrate with your accounting system or use the eTIMS Trader app. All invoices must have a QR code and unique invoice number from KRA."
  },
  {
    category: "PAYE",
    question: "How do I file PAYE returns?",
    answer: "Log into iTax, go to Returns > File Returns > PAYE. Download the PAYE template, fill in employee details and tax deductions, upload the completed file, and submit by the 9th of every month. Late filing attracts 25% penalty on tax due."
  },
  {
    category: "Compliance",
    question: "What are the penalties for late tax filing?",
    answer: "Individual Income Tax: KES 2,000/month. Company Income Tax: 5% of tax due or KES 20,000, whichever is higher. VAT: 5% of tax due or KES 10,000. PAYE: 25% of tax due. Interest of 1% per month also applies on unpaid taxes."
  },
  {
    category: "Compliance",
    question: "How do I apply for a Tax Compliance Certificate (TCC)?",
    answer: "Log into iTax, go to Applications > Apply for TCC. Ensure all returns are filed and taxes paid. The system verifies compliance automatically. If approved, download your TCC valid for 12 months. Processing takes 1-7 days."
  },
  {
    category: "Payments",
    question: "How do I make tax payments?",
    answer: "Generate a Payment Registration Number (PRN) on iTax, then pay via M-Pesa (Paybill 572572), bank transfer, or at any KRA-authorized bank. Keep the payment receipt for records. Payments reflect within 24-48 hours on iTax."
  }
];

interface FAQSectionProps {
  onQuestionClick: (question: string) => void;
}

export const FAQSection = ({ onQuestionClick }: FAQSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFaqs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <Card className="p-4 glass-effect border-primary/30 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "text-xs transition-all",
              selectedCategory === category 
                ? "bg-gradient-primary shadow-soft" 
                : "glass-effect border-primary/30 hover:bg-primary/10"
            )}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border/30 rounded-lg overflow-hidden transition-all hover:border-primary/40"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-card/50 transition-all"
            >
              <span className="text-sm font-medium text-foreground pr-4">{faq.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {expandedIndex === index && (
              <div className="px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onQuestionClick(faq.question)}
                  className="text-xs gap-2 glass-effect border-primary/30 hover:bg-primary/10"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ask AI for more details
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
