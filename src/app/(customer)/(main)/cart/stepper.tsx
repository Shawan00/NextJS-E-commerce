"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import CartItems from "./cartItems";
import BillingAndAddress from "./billingAdress";
import { BillingAddressType } from "@/schemaValidation/order.shema";
import Confirmation from "./confirmation";

type StepStatus = 'completed' | 'current' | 'pending';

interface Step {
  id: number;
  name: string;
  status: StepStatus;
}

function Stepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [billingAddressData, setBillingAddressData] = useState<BillingAddressType | null>(null);

  const steps: Step[] = [
    { id: 1, name: "Cart", status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending' },
    { id: 2, name: "Billing & address", status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending' },
    { id: 3, name: "Confirmation", status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending' },
  ];

  const handleNextStep = (stepData?: BillingAddressType) => {
    if (stepData) {
      setBillingAddressData(stepData);
    } else if (currentStep === 2) {
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CartItems onNextStep={() => handleNextStep()} />;
      case 2:
        return (
          <BillingAndAddress
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
          />
        );
      case 3:
        if (!billingAddressData) {
          setCurrentStep(2);
          return;
        };
        return (
          <Confirmation
            onPrevStep={handlePrevStep}
            billingAddressData={billingAddressData}
          />
        );
      default:
        return <CartItems onNextStep={() => handleNextStep()} />;
    }
  };

  return (
    <div className="w-full">
      {/* Stepper Navigation */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, stepIdx) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs
                  ${step.status === 'completed' 
                    ? 'bg-accent border-accent text-white' 
                    : step.status === 'current'
                    ? 'bg-accent border-accent text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-500'
                  }
                `}
              >
                {step.status === 'completed' ? (
                  <Check className="w-3 h-3" />
                ) : step.status === 'current' ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              {/* Step Name */}
              <span 
                className={`ml-3 text-sm font-medium ${
                  step.status === 'current' ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>

            {/* Connector Line */}
            {stepIdx < steps.length - 1 && (
              <div className={`ml-6 mr-6 w-16 h-0.5 ${
                steps[stepIdx + 1].status === 'completed' || step.status === 'completed' 
                  ? 'bg-accent' 
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
}

export default Stepper;