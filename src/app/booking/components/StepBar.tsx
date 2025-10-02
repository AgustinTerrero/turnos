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
    <div className="w-full overflow-x-auto mb-8 sm:mb-10 -mx-2 px-2 sm:mx-0 sm:px-0">
      <div className="flex flex-row items-start min-w-[600px] sm:min-w-0 justify-between px-1 sm:px-2 gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const isActive = currentStep === idx + 1;
          const isCompleted = realCompleted(idx);
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center min-w-[80px] sm:min-w-0 sm:max-w-none flex-1">
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 relative select-none shadow-sm
                      ${isCompleted ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-emerald-200' :
                        isActive ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-indigo-200' :
                        'bg-gray-100 text-gray-400 border-2 border-gray-200'}
                    `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <span className="text-base sm:text-lg font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm font-semibold text-center transition-colors duration-200 leading-tight ${isActive ? 'text-indigo-700' : isCompleted ? 'text-emerald-700' : 'text-gray-500'}`}>{step}</span>
                  {chosenOptions[idx + 1] && (
                    <span className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs text-gray-400 max-w-[70px] sm:max-w-[80px] md:max-w-[100px] truncate text-center">{chosenOptions[idx + 1]}</span>
                  )}
                </div>
              </div>
              {idx !== steps.length - 1 && (
                <div className="flex-1 h-1 mx-1 sm:mx-2 mt-4 sm:mt-5 md:mt-6 relative flex items-center max-w-[40px] sm:max-w-[60px] md:max-w-[100px]">
                  {/* Línea base */}
                  <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 rounded-full" style={{ transform: 'translateY(-50%)' }} />
                  {/* Línea de progreso */}
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
