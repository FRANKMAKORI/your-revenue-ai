import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, X, ExternalLink } from "lucide-react";

export interface WorkflowStep {
  title: string;
  description: string;
  tips?: string[];
  link?: { url: string; label: string };
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
}

interface GuidedWorkflowProps {
  workflow: Workflow;
  onClose: () => void;
  onComplete: () => void;
}

export const GuidedWorkflow = ({ workflow, onClose, onComplete }: GuidedWorkflowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const progress = ((completedSteps.length) / workflow.steps.length) * 100;
  const step = workflow.steps[currentStep];

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < workflow.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <Card className="glass-effect border-primary/30 shadow-glow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold gradient-text">{workflow.title}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {workflow.steps.map((s, index) => (
          <button
            key={index}
            onClick={() => handleStepClick(index)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              currentStep === index
                ? "bg-primary text-primary-foreground"
                : completedSteps.includes(index)
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {completedSteps.includes(index) ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
            <span>Step {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Current step content */}
      <Card className="bg-card/50 border-border/50 p-5 mb-6">
        <h4 className="text-lg font-semibold mb-3">{step.title}</h4>
        <p className="text-muted-foreground mb-4">{step.description}</p>

        {step.tips && step.tips.length > 0 && (
          <div className="bg-primary/10 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-primary mb-2">Tips:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {step.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step.link && (
          <a
            href={step.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            {step.link.label}
          </a>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button onClick={handleNext} className="gap-2 bg-gradient-primary">
          {currentStep === workflow.steps.length - 1 ? "Complete" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
