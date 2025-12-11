import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Receipt, CreditCard, UserPlus, Building, Truck } from "lucide-react";
import type { Workflow } from "./GuidedWorkflow";

export const kraWorkflows: Workflow[] = [
  {
    id: "pin-registration",
    title: "KRA PIN Registration",
    description: "Step-by-step guide to register for a KRA Personal Identification Number",
    steps: [
      {
        title: "Access iTax Portal",
        description: "Visit the official KRA iTax portal at itax.kra.go.ke. Click on 'New PIN Registration' on the homepage.",
        tips: [
          "Use a modern browser (Chrome, Firefox, Edge)",
          "Ensure you have a stable internet connection",
          "Have your documents ready before starting"
        ],
        link: { url: "https://itax.kra.go.ke", label: "Go to iTax Portal" }
      },
      {
        title: "Select Taxpayer Type",
        description: "Choose your taxpayer category: Individual (Resident/Non-Resident), Company, Partnership, or other entity types.",
        tips: [
          "Individuals select 'Individual - Resident' for Kenyan citizens",
          "Foreign nationals select 'Individual - Non-Resident'",
          "Businesses select appropriate entity type"
        ]
      },
      {
        title: "Fill Personal Details",
        description: "Enter your personal information including full names (as per ID), date of birth, gender, nationality, and ID number.",
        tips: [
          "Names must match exactly as on your ID document",
          "Double-check ID number for accuracy",
          "Use your primary phone number"
        ]
      },
      {
        title: "Enter Contact Information",
        description: "Provide your email address, mobile phone number, postal address, and physical address details.",
        tips: [
          "Use an active email you can access",
          "Phone number must be able to receive SMS",
          "Physical address should be current residence"
        ]
      },
      {
        title: "Upload Documents",
        description: "Upload scanned copies of required documents: National ID/Passport, Passport photo, and proof of address if required.",
        tips: [
          "Documents should be clear and legible",
          "File size usually limited to 2MB",
          "Accepted formats: PDF, JPG, PNG"
        ]
      },
      {
        title: "Review and Submit",
        description: "Review all entered information for accuracy, then submit your application. You'll receive a confirmation via email/SMS.",
        tips: [
          "Save or print the acknowledgment receipt",
          "PIN is usually generated instantly for individuals",
          "Download and save your PIN certificate"
        ]
      }
    ]
  },
  {
    id: "vat-filing",
    title: "VAT Return Filing",
    description: "Guide to filing your monthly VAT returns on iTax",
    steps: [
      {
        title: "Log into iTax",
        description: "Access itax.kra.go.ke and log in using your KRA PIN and password. Navigate to 'Returns' menu.",
        tips: [
          "Reset password if forgotten via 'Forgot Password'",
          "Ensure your iTax profile is up to date",
          "VAT returns are due by 20th of following month"
        ],
        link: { url: "https://itax.kra.go.ke", label: "Login to iTax" }
      },
      {
        title: "Select VAT Return",
        description: "From the Returns menu, select 'File Returns' then choose 'VAT' from the tax obligation list.",
        tips: [
          "Ensure VAT obligation is registered on your PIN",
          "Select correct return period (month/year)",
          "Check for any pending returns first"
        ]
      },
      {
        title: "Enter Sales Information",
        description: "Fill in total sales/turnover for the period, including zero-rated and exempt supplies. Enter output VAT collected.",
        tips: [
          "Standard VAT rate is 16%",
          "Zero-rated supplies are taxed at 0%",
          "Exempt supplies are not subject to VAT"
        ]
      },
      {
        title: "Enter Purchases Information",
        description: "Enter your purchases with VAT (input tax), imports, and any exempt purchases for the period.",
        tips: [
          "Only claim VAT on tax invoices with VAT numbers",
          "Import VAT from customs declarations",
          "Keep all supporting documents for 5 years"
        ]
      },
      {
        title: "Calculate and Verify",
        description: "System calculates net VAT (Output - Input). If positive, you owe KRA. If negative, you have a credit.",
        tips: [
          "Verify calculations before submission",
          "VAT credit can be carried forward",
          "Refunds require separate application"
        ]
      },
      {
        title: "Submit and Pay",
        description: "Submit the return and generate a payment slip if VAT is payable. Pay via M-Pesa, bank, or e-slip.",
        tips: [
          "Download and save acknowledgment receipt",
          "Payment due by 20th of month following period",
          "Late filing attracts penalties (Ksh 10,000 or 5%)"
        ]
      }
    ]
  },
  {
    id: "etims-setup",
    title: "eTIMS Invoice Generation",
    description: "How to set up and use eTIMS for electronic tax invoicing",
    steps: [
      {
        title: "Register for eTIMS",
        description: "Log into iTax and navigate to eTIMS registration. Complete the online registration form for your business.",
        tips: [
          "VAT registered businesses must use eTIMS",
          "Have business details and turnover ready",
          "Choose between eTIMS Lite, Online, or Integrated"
        ],
        link: { url: "https://itax.kra.go.ke", label: "Access iTax" }
      },
      {
        title: "Choose eTIMS Solution",
        description: "Select appropriate eTIMS solution: eTIMS Lite (mobile app), eTIMS Online (web portal), or eTIMS Integrated (API).",
        tips: [
          "eTIMS Lite: Best for small businesses, mobile-based",
          "eTIMS Online: Web-based, no integration needed",
          "eTIMS Integrated: For businesses with existing systems"
        ]
      },
      {
        title: "Download/Access eTIMS",
        description: "For eTIMS Lite, download the app from Play Store/App Store. For Online, access via etims.kra.go.ke.",
        tips: [
          "Use official KRA app only",
          "Ensure device has internet connectivity",
          "Keep login credentials secure"
        ],
        link: { url: "https://etims.kra.go.ke", label: "eTIMS Online Portal" }
      },
      {
        title: "Configure Business Details",
        description: "Set up your business information including name, PIN, branch details, and invoice preferences.",
        tips: [
          "Add all business locations/branches",
          "Set up item codes and descriptions",
          "Configure tax rates correctly"
        ]
      },
      {
        title: "Create Invoice",
        description: "Generate invoices by entering customer details, items/services, quantities, and prices. System calculates VAT automatically.",
        tips: [
          "Customer PIN required for B2B transactions",
          "Invoice auto-transmitted to KRA",
          "Each invoice gets unique eTIMS number"
        ]
      },
      {
        title: "Manage and Report",
        description: "View transmitted invoices, generate reports, and reconcile with VAT returns. Handle credit notes if needed.",
        tips: [
          "Regularly check transmission status",
          "Credit notes for returns/corrections",
          "Reports help with VAT filing"
        ]
      }
    ]
  },
  {
    id: "paye-filing",
    title: "PAYE Returns Filing",
    description: "Guide to filing Pay As You Earn (PAYE) returns for employers",
    steps: [
      {
        title: "Prepare Payroll Data",
        description: "Gather monthly payroll information including employee details, gross pay, deductions, and PAYE calculated.",
        tips: [
          "Use current PAYE tax bands",
          "Include all taxable benefits",
          "Deduct NHIF, NSSF, and housing levy"
        ]
      },
      {
        title: "Access P10 Form",
        description: "Log into iTax, go to Returns > File Returns > PAYE. Select the return period and download P10 template.",
        tips: [
          "P10 is the monthly PAYE return form",
          "Template available in Excel format",
          "One row per employee"
        ],
        link: { url: "https://itax.kra.go.ke", label: "Access iTax" }
      },
      {
        title: "Fill Employee Details",
        description: "Complete the P10 template with each employee's PIN, names, gross pay, taxable pay, and PAYE deducted.",
        tips: [
          "Employee PIN is mandatory",
          "Ensure calculations are accurate",
          "Include all allowances in gross pay"
        ]
      },
      {
        title: "Upload and Validate",
        description: "Upload the completed P10 file to iTax. System validates data and shows any errors to correct.",
        tips: [
          "Fix all validation errors before proceeding",
          "Common errors: wrong PIN format, calculation mismatches",
          "Re-upload corrected file if needed"
        ]
      },
      {
        title: "Submit Return",
        description: "After successful validation, submit the return. Generate payment slip for total PAYE amount.",
        tips: [
          "Due by 9th of following month",
          "Late filing penalty: Ksh 25,000 or 25%",
          "Keep acknowledgment receipt"
        ]
      },
      {
        title: "Make Payment",
        description: "Pay total PAYE via M-Pesa (Paybill 572572), bank transfer, or e-slip. Quote the payment registration number.",
        tips: [
          "Payment also due by 9th",
          "Interest charged on late payment",
          "Verify payment reflects on iTax"
        ]
      }
    ]
  },
  {
    id: "company-registration",
    title: "Company Tax Registration",
    description: "Register your company for KRA obligations after incorporation",
    steps: [
      {
        title: "Complete Company Incorporation",
        description: "Ensure your company is registered with the Registrar of Companies (eCitizen BRS portal) before KRA registration.",
        tips: [
          "Have Certificate of Incorporation ready",
          "CR12 form showing directors",
          "Company PIN applications need director PINs"
        ],
        link: { url: "https://brs.ecitizen.go.ke", label: "BRS Portal" }
      },
      {
        title: "Director PIN Registration",
        description: "All company directors must have individual KRA PINs. Register personal PINs first if not already done.",
        tips: [
          "At least one director PIN required",
          "Use personal registration process",
          "PIN should be in active status"
        ]
      },
      {
        title: "Company PIN Application",
        description: "On iTax, select 'New PIN Registration' > 'Non-Individual'. Choose 'Company' and fill in company details.",
        tips: [
          "Use exact company name from certificate",
          "Registration number from CR document",
          "Main business activity/sector"
        ],
        link: { url: "https://itax.kra.go.ke", label: "iTax Portal" }
      },
      {
        title: "Upload Company Documents",
        description: "Upload: Certificate of Incorporation, CR12, ID copies of directors, KRA PIN copies of directors.",
        tips: [
          "Clear, legible scanned copies",
          "CR12 should be recent (within 6 months)",
          "All pages of multi-page documents"
        ]
      },
      {
        title: "Register Tax Obligations",
        description: "Select applicable tax obligations: Income Tax, VAT (if turnover >Ksh 5M), PAYE (if have employees), etc.",
        tips: [
          "Income Tax is mandatory for all companies",
          "VAT mandatory if turnover exceeds threshold",
          "PAYE if you employ staff"
        ]
      },
      {
        title: "Complete and Download PIN",
        description: "Submit application, await approval. Once approved, download Company PIN certificate from iTax.",
        tips: [
          "May take 1-3 working days for approval",
          "Check iTax for status updates",
          "PIN certificate needed for bank accounts"
        ]
      }
    ]
  },
  {
    id: "import-clearance",
    title: "Import Tax Clearance",
    description: "Guide to clearing imported goods through Kenya Revenue Authority customs",
    steps: [
      {
        title: "Obtain Import Documents",
        description: "Gather required documents from supplier: Commercial Invoice, Packing List, Bill of Lading/Airway Bill.",
        tips: [
          "Ensure documents are original or certified",
          "Invoice should show item values in detail",
          "HS codes help with classification"
        ]
      },
      {
        title: "Register on iCMS",
        description: "Access KRA's Integrated Customs Management System (iCMS) portal. Register as an importer if first time.",
        tips: [
          "Need valid KRA PIN to register",
          "Can appoint customs agent to clear",
          "Agents handle most clearances"
        ],
        link: { url: "https://icms.kra.go.ke", label: "iCMS Portal" }
      },
      {
        title: "Lodge Import Declaration",
        description: "Submit Import Declaration Form (IDF) or Entry on iCMS with goods description, values, and origin.",
        tips: [
          "Accurate HS code classification important",
          "Declare correct values (CIF basis)",
          "Wrong declaration = penalties"
        ]
      },
      {
        title: "Assessment and Duties",
        description: "KRA assesses duties payable: Import Duty, VAT (16%), IDF fee (2.25%), Railway Development Levy (2%), etc.",
        tips: [
          "Import duty varies by product (0-25%)",
          "Some goods exempt or zero-rated",
          "Check EAC Tariff for rates"
        ]
      },
      {
        title: "Make Payment",
        description: "Pay assessed duties and taxes through approved banks or electronic payment. Get customs receipt.",
        tips: [
          "Payment must be cleared before release",
          "Keep all receipts for records",
          "Can pay via iTax linked to iCMS"
        ]
      },
      {
        title: "Clear and Collect Goods",
        description: "After payment confirmation, customs releases goods. Collect from port/airport with release order.",
        tips: [
          "May face verification/scanning",
          "Keep clearance documents safe",
          "Claim input VAT on VAT return"
        ]
      }
    ]
  }
];

const workflowIcons: Record<string, React.ReactNode> = {
  "pin-registration": <UserPlus className="w-6 h-6" />,
  "vat-filing": <FileText className="w-6 h-6" />,
  "etims-setup": <Receipt className="w-6 h-6" />,
  "paye-filing": <CreditCard className="w-6 h-6" />,
  "company-registration": <Building className="w-6 h-6" />,
  "import-clearance": <Truck className="w-6 h-6" />,
};

interface WorkflowSelectorProps {
  onSelectWorkflow: (workflow: Workflow) => void;
  onClose: () => void;
}

export const WorkflowSelector = ({ onSelectWorkflow, onClose }: WorkflowSelectorProps) => {
  return (
    <Card className="glass-effect border-primary/30 shadow-glow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold gradient-text">KRA Guided Workflows</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Select a task to get step-by-step guidance
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kraWorkflows.map((workflow) => (
          <Card
            key={workflow.id}
            className="p-4 bg-card/50 border-border/50 hover:border-primary/50 hover:shadow-soft cursor-pointer transition-all"
            onClick={() => onSelectWorkflow(workflow)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {workflowIcons[workflow.id]}
              </div>
              <div>
                <h4 className="font-semibold mb-1">{workflow.title}</h4>
                <p className="text-sm text-muted-foreground">{workflow.description}</p>
                <p className="text-xs text-primary mt-2">{workflow.steps.length} steps</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
