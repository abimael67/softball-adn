import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SetupStep {
  id: string;
  label: string;
  description: string;
  count?: number;
  completed: boolean;
}

interface SetupWizardProps {
  steps: SetupStep[];
  activeStep: string;
  onStepClick: (stepId: string) => void;
}

export function SetupWizard({ steps, activeStep, onStepClick }: SetupWizardProps) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
              isActive && "border-primary bg-primary/5",
              !isActive && "hover:bg-muted/50",
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                step.completed && "bg-green-500 text-white",
                isActive && !step.completed && "bg-primary text-primary-foreground",
                !isActive && !step.completed && "bg-muted text-muted-foreground",
              )}
            >
              {step.completed ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", isActive && "text-primary")}>
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground truncate">{step.description}</p>
            </div>
            {step.count !== undefined && (
              <span className="text-xs text-muted-foreground shrink-0">{step.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
