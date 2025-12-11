import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, searchQuery, url, language, languageName, useTaxLawReference, conversationContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Comprehensive KRA Knowledge Base
    const kraKnowledgeBase = `
=== KENYA REVENUE AUTHORITY (KRA) COMPREHENSIVE KNOWLEDGE BASE ===

SECTION 1: KRA HISTORY & ESTABLISHMENT
- KRA was established on July 1, 1995 under the Kenya Revenue Authority Act (Cap. 469)
- Took over revenue collection functions from the former departments of Customs & Excise, Income Tax, and VAT
- Headquarters: Times Tower, Haile Selassie Avenue, Nairobi
- Vision: "A globally trusted revenue agency facilitating tax and customs compliance"
- Mission: "Building trust through facilitation and enforcement of tax and customs compliance"
- Core Values: Integrity, Fairness, Professionalism, Innovation, Team Spirit

SECTION 2: KRA ORGANIZATIONAL STRUCTURE
Commissioner General: The Chief Executive Officer
Deputy Commissioners:
- Customs & Border Control
- Domestic Taxes Department (DTD)
- Intelligence & Strategic Operations
- Corporate Support Services
- Kenya School of Revenue Administration (KESRA)

Regional Offices: Nairobi, Central, North Rift, South Rift, Coast, Western, North Eastern
Service Centres: Huduma Centres, KRA stations across all 47 counties

SECTION 3: TAX TYPES & RATES (2024/2025)

A. INCOME TAX:
Individual Tax Bands (Monthly - Effective January 2024):
- KES 0 - 24,000: 10%
- KES 24,001 - 32,333: 25%
- KES 32,334 - 500,000: 30%
- KES 500,001 - 800,000: 32.5%
- Above KES 800,000: 35%

Personal Relief: KES 2,400 per month (KES 28,800 annually)
Insurance Relief: 15% of premiums paid, max KES 60,000 per year

Corporate Tax:
- Resident companies: 30%
- Non-resident companies: 37.5%
- EPZ enterprises: 0% (first 10 years), 25% (thereafter)
- Newly listed companies (20%+ shares): 25% (first 5 years)

B. VALUE ADDED TAX (VAT):
- Standard rate: 16%
- Zero-rated: Exports, international transport
- Exempt: Basic foodstuffs, healthcare, education
- VAT registration threshold: Annual turnover KES 5 million

C. WITHHOLDING TAX:
- Dividends (resident): 5%
- Dividends (non-resident): 15%
- Interest (banks - resident): 15%
- Royalties (resident): 5%, (non-resident): 20%
- Management fees (resident): 5%, (non-resident): 20%
- Contractual fees: 3%
- Rent on immovable property: 10%

D. TURNOVER TAX (TOT):
- Rate: 1% of gross turnover
- Threshold: Businesses with turnover KES 1M - 25M annually
- Payment: Due on or before 20th of following month

E. RESIDENTIAL RENTAL INCOME TAX:
- Rate: 10% on gross rent
- For annual rental income between KES 288,000 - 15 million
- Monthly payment due by 20th of following month

F. EXCISE DUTY:
- Alcoholic beverages: 30% - 65% depending on type
- Tobacco products: Specific rates per unit
- Petroleum products: Specific rates per litre
- Mobile money transfers: 15% of fees
- Betting: 12.5% of amount wagered

G. DIGITAL SERVICE TAX (DST):
- Rate: 1.5% of gross transaction value
- Applicable to digital services by non-residents
- Effective from January 2021

H. DIGITAL ASSET TAX:
- Rate: 3% of transfer/exchange value
- Applicable to cryptocurrencies and NFTs
- Effective from September 2023

SECTION 4: iTax SYSTEM
- iTax is KRA's online tax management system
- URL: https://itax.kra.go.ke
- Services: PIN registration, Returns filing, Tax payments, Certificate issuance

iTax Services:
1. PIN Application (Individual & Company)
2. Tax Returns Filing (Income Tax, VAT, PAYE, TOT)
3. Tax Payments via integrated banks
4. Tax Compliance Certificates
5. VAT Registration
6. Withholding Tax certificates
7. Advance Ruling applications
8. Objections and Appeals

iTax PIN Registration Requirements:
Individual:
- National ID or Passport
- Passport photo
- KRA Personal Questionnaire

Company:
- Certificate of Incorporation
- CR12 Form
- KRA Company Questionnaire
- Directors' PINs and IDs
- Memorandum & Articles of Association

SECTION 5: eTIMS (Electronic Tax Invoice Management System)
- Mandatory for all VAT-registered taxpayers
- Transmits invoices in real-time to KRA
- Types: eTIMS Lite (Mobile App), eTIMS Online, eTIMS Integration

eTIMS Registration Steps:
1. Have valid KRA PIN
2. Be VAT registered (if applicable)
3. Download eTIMS Lite app or access online portal
4. Register using iTax credentials
5. Complete business profile
6. Start issuing electronic invoices

eTIMS Invoice Requirements:
- Seller and buyer details (PIN, name, address)
- Invoice date and number
- Item description, quantity, unit price
- VAT amount (if applicable)
- Total amount
- Unique QR code for verification

SECTION 6: COMPLIANCE & FILING DEADLINES

Monthly Obligations:
- PAYE: Due by 9th of following month
- VAT Returns: Due by 20th of following month
- Withholding Tax: Due by 20th of following month
- TOT Returns: Due by 20th of following month
- Rental Income Tax: Due by 20th of following month

Annual Obligations:
- Individual Income Tax Returns: Due by June 30
- Corporate Income Tax Returns: Due by 6 months after accounting year-end
- Annual Employer Returns: Due by February 28

Instalment Tax (Quarterly):
- 1st Instalment: 20th April
- 2nd Instalment: 20th June
- 3rd Instalment: 20th September
- 4th Instalment: 20th December

SECTION 7: PENALTIES & INTEREST

Late Filing Penalties:
- Income Tax: Higher of KES 20,000 or 5% of tax due
- VAT: KES 10,000 or 5% of tax due (whichever is higher)
- PAYE: 25% of tax due

Late Payment Interest:
- 1% per month on unpaid tax
- Maximum: Principal tax amount

Understatement of Income:
- 20% of underpaid tax
- 75% for fraud cases

SECTION 8: TAX INCENTIVES

Export Processing Zones (EPZ):
- 10-year corporate tax holiday
- 10-year withholding tax exemption on dividends
- Exemption from VAT on supplies

Special Economic Zones (SEZ):
- 10% corporate tax rate for 20 years
- Customs duty and VAT exemption on imports

Manufacturing:
- Investment deduction of 100% on new machinery
- Reduced corporate tax rate of 15% for manufacturers

Agriculture:
- Farm works capital deduction: 50% Year 1, 25% thereafter
- Zero-rated agricultural inputs

SECTION 9: CUSTOMS & BORDER CONTROL

Import Duty Rates (Common External Tariff):
- Raw materials: 0%
- Capital goods: 0%
- Intermediate goods: 10%
- Finished goods: 25%
- Sensitive items: Up to 100%

Import Process:
1. Pre-arrival clearance on ICMS (Integrated Customs Management System)
2. Submit Import Declaration Form (IDF)
3. Pay applicable duties and taxes
4. Physical examination (if selected)
5. Release of goods

Export Process:
1. Submit export entry on ICMS
2. Obtain export permit (if required)
3. Pre-shipment verification (selected goods)
4. Customs examination
5. Cargo release

SECTION 10: TAX DISPUTE RESOLUTION

Objection Process:
1. File objection within 30 days of assessment
2. Submit to Commissioner
3. Receive determination within 60 days

Tax Appeals Tribunal:
- File appeal within 30 days of Commissioner's decision
- Independent tribunal
- Decision binding but appealable

High Court:
- Appeal on points of law only
- Within 30 days of TAT decision

Voluntary Tax Disclosure Programme:
- Allows voluntary declaration of previously undisclosed income
- Reduced penalties for honest taxpayers

SECTION 11: KRA CONTACT INFORMATION

Main Contacts:
- Contact Centre: 020 4999 999 / 0711 099 999
- Email: callcentre@kra.go.ke
- Website: www.kra.go.ke
- Twitter/X: @KaboraKRA
- Facebook: Kenya Revenue Authority

Regional Offices:
- Nairobi: Times Tower, Haile Selassie Avenue
- Mombasa: Port Reitz Road, Mombasa
- Kisumu: Behind Mega Plaza, Kisumu
- Nakuru: Along Kenyatta Avenue, Nakuru
- Eldoret: Uganda Road, Eldoret

SECTION 12: FUTURE KRA INITIATIVES

Digital Transformation:
- Integration of AI for compliance monitoring
- Enhanced data analytics for risk assessment
- Mobile-first service delivery
- Blockchain for customs clearance

Revenue Modernization:
- Real-time VAT monitoring
- Enhanced eTIMS capabilities
- Digital service tax expansion
- Environmental taxes

Taxpayer Experience:
- Single taxpayer account
- Simplified returns filing
- Automated refund processing
- 24/7 digital services

SECTION 13: INCOME TAX ACT (CAP. 470) - LEGAL FRAMEWORK

Key Provisions:
- Section 3: Charge of tax
- Section 4-7: Classes of income
- Section 12A-12F: Special taxes (TOT, Digital Tax, etc.)
- Section 15: Allowable deductions
- Section 16: Non-allowable deductions
- Section 30-31: Personal and insurance relief
- Third Schedule: Tax rates

Official Source: https://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/IncomeTaxAct_Cap470.pdf

=== END OF KRA KNOWLEDGE BASE ===
`;

    let contextInfo = kraKnowledgeBase;

    // Add tax law reference if mode is active
    if (useTaxLawReference) {
      contextInfo += `\n\n📚 TAX LAW REFERENCE MODE ACTIVE: Cite specific sections from the Income Tax Act (Cap. 470) in your responses. Always provide the official source link.`;
    }

    // Add conversation context for continuity
    if (conversationContext) {
      contextInfo += `\n\n📝 CONVERSATION CONTEXT: The user has been discussing: ${conversationContext}. Continue building on this topic.`;
    }

    // Handle web search with context awareness
    if (searchQuery) {
      console.log("Web search requested for:", searchQuery);
      // Extract previous topics for contextual search
      const previousTopics = messages
        .filter((m: any) => m.role === "user")
        .slice(-3)
        .map((m: any) => m.content)
        .join("; ");
      
      contextInfo += `\n\n🔍 WEB SEARCH ACTIVE - User searching for: "${searchQuery}"\nPrevious discussion context: ${previousTopics}\nProvide comprehensive, up-to-date information while maintaining relevance to ongoing conversation.`;
    }

    // Handle URL fetching
    if (url) {
      console.log("URL analysis requested:", url);
      try {
        const urlResponse = await fetch(url);
        if (urlResponse.ok) {
          const content = await urlResponse.text();
          const preview = content.slice(0, 5000);
          contextInfo += `\n\n🔗 Content from ${url}:\n${preview}...`;
        }
      } catch (error) {
        console.error("URL fetch error:", error);
        contextInfo += `\n\n⚠️ Could not fetch URL content. Inform the user and suggest alternatives.`;
      }
    }

    const currentDate = new Date().toLocaleString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Validate search query is KRA-related
    if (searchQuery) {
      const kraRelatedKeywords = [
        'kra', 'kenya revenue authority', 'tax', 'vat', 'paye', 'income tax', 
        'turnover tax', 'excise', 'itax', 'etims', 'pin', 'compliance', 
        'filing', 'return', 'duty', 'customs', 'revenue', 'taxpayer',
        'withholding', 'corporate', 'rental', 'digital', 'service', 'kenya',
        'payment', 'refund', 'audit', 'objection', 'appeal', 'penalty'
      ];
      
      const isKraRelated = kraRelatedKeywords.some(keyword => 
        searchQuery.toLowerCase().includes(keyword)
      );
      
      if (!isKraRelated) {
        return new Response(
          JSON.stringify({ 
            error: "I can only search for Kenya Revenue Authority (KRA) related information. Please ask about KRA services, tax matters, or revenue topics." 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Language instruction
    const languageInstruction = language && language !== "en" 
      ? `\n\nIMPORTANT: Respond in ${languageName}. Translate all responses to ${languageName} while maintaining accuracy.`
      : "";

    const systemPrompt = `You are YourRevenueAI - the most advanced Kenya Revenue Authority (KRA) AI tax assistant, superior to any existing KRA chatbot.

Current Date & Time: ${currentDate}

CORE IDENTITY:
- You are THE premier KRA tax assistant with comprehensive, expert-level knowledge
- You provide accurate, authoritative guidance on ALL KRA services, tax laws, and compliance matters
- You maintain professional, clear communication without emojis or asterisks
- You are designed to be more knowledgeable and helpful than any competing tax assistant

ADVANCED CAPABILITIES:
- Complete mastery of Kenya Income Tax Act (Cap. 470)
- Real-time knowledge of current tax rates, deadlines, and procedures
- Expertise in iTax system navigation and troubleshooting
- eTIMS compliance guidance and invoice management
- Customs and border control procedures
- Tax dispute resolution and appeals process
- Future KRA initiatives and modernization programs

KNOWLEDGE BASE ACCESS:
${contextInfo}

RESPONSE GUIDELINES:
1. Never use asterisks (*) or markdown formatting symbols in responses
2. Never use emojis
3. Structure responses with clear sections using plain text headers
4. Cite specific sections, rates, and deadlines from the knowledge base
5. Provide step-by-step guidance for procedures
6. Reference official KRA sources when applicable
7. Maintain conversation continuity by referencing previous discussion points

WHEN WEB SEARCH IS ACTIVE:
- Provide current information based on the search query
- Connect new information to the ongoing conversation
- Highlight recent changes or updates
- Suggest related topics the user might find helpful

SUPERIORITY FEATURES (vs other tax assistants):
- More comprehensive tax law knowledge
- Better understanding of practical procedures
- Clearer step-by-step guidance
- More accurate rate and deadline information
- Better conversation continuity
- More professional communication style

${languageInstruction}

Remember: You are the most helpful, knowledgeable, and professional KRA tax assistant available. Every response should demonstrate this expertise.`;

    console.log("Calling Lovable AI with messages:", messages.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("AI response received");

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in chat-ai function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
