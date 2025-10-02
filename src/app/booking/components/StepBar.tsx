import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface StepBarProps {
  steps: string[];
  currentStep: number;
  completedSteps: { [key: number]: boolean };
  chosenOptions: { [key: number]: string };
}

const StepBar: React.FC<StepBarProps> = ({ steps, currentStep, completedSteps, chosenOptions }) => {
  // Si el usuario vuelve atrás, los pasos siguientes no deben estar completos
  const realCompleted = (idx: number) => idx + 1 < currentStep ? completedSteps[idx + 1] : false;

  return (
    <div className="w-full mb-6 sm:mb-8 md:mb-10">
      {/* Una sola fila para todos los tamaños */}
      <div className="flex flex-row items-start justify-between px-1 sm:px-2 gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const isActive = currentStep === idx + 1;
          const isCompleted = realCompleted(idx);
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 shadow-sm
                      ${isCompleted ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-emerald-200' :
                        isActive ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-indigo-200' :
                        'bg-gray-100 text-gray-400 border-2 border-gray-200'}
                    `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    ) : (
                      <span className="text-sm sm:text-base md:text-lg font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`mt-1.5 sm:mt-2 md:mt-3 text-[9px] sm:text-[10px] md:text-xs font-semibold text-center leading-tight px-0.5 ${isActive ? 'text-indigo-700' : isCompleted ? 'text-emerald-700' : 'text-gray-500'}`}>
                    {step}
                  </span>
                  {chosenOptions[idx + 1] && (
                    <span className="hidden sm:block mt-0.5 md:mt-1 text-[9px] md:text-[10px] text-gray-400 truncate text-center w-full px-1">
                      {chosenOptions[idx + 1]}
                    </span>
                  )}
                </div>
              </div>
              {idx !== steps.length - 1 && (
                <div className="flex-shrink-0 w-3 sm:w-6 md:w-12 h-1 mt-3.5 sm:mt-4 md:mt-5 relative flex items-center">
                  <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 rounded-full" style={{ transform: 'translateY(-50%)' }} />
                  {isCompleted && (
                    <div className="absolute left-0 top-1/2 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500" style={{ width: '100%', transform: 'translateY(-50%)' }} />
                  )}
                  {isActive && !isCompleted && (
                    <div className="absolute left-0 top-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: '50%', transform: 'translateY(-50%)' }} />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepBar;
