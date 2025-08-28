import React from "react";

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
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent mb-8">
      <div className="flex flex-row items-center min-w-0 justify-between px-2 gap-0">
        {steps.map((step, idx) => {
          const isActive = currentStep === idx + 1;
          const isCompleted = realCompleted(idx);
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center min-w-0 max-w-[90px] sm:max-w-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 relative select-none
                      ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                        isActive ? 'bg-white border-primary-600 text-primary-700' :
                        'bg-white border-gray-300 text-gray-400'}
                    `}
                    style={{ boxSizing: 'border-box', verticalAlign: 'middle', padding: 0 }}
                  >
                    {isCompleted ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="block" style={{ display: 'block' }}>
                        <circle cx="12" cy="12" r="11" fill="#22c55e" opacity="0.15"/>
                        <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className="text-base font-bold flex items-center justify-center w-full h-full" style={{ lineHeight: '40px' }}>{idx + 1}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs sm:text-[13px] font-medium ${isActive ? 'text-primary-700 font-bold' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}>{step}</span>
                  {chosenOptions[idx + 1] && (
                    <span className="mt-1 text-[11px] sm:text-xs text-gray-400 max-w-[70px] sm:max-w-[80px] truncate">{chosenOptions[idx + 1]}</span>
                  )}
                </div>
              </div>
              {idx !== steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 relative flex items-center">
                  {/* Línea base continua */}
                  <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 rounded" style={{ transform: 'translateY(-50%)' }} />
                  {/* Línea de progreso encima */}
                  {isCompleted && (
                    <div className="absolute left-0 top-1/2 h-1 bg-green-500 rounded" style={{ width: '100%', transform: 'translateY(-50%)' }} />
                  )}
                  {isActive && !isCompleted && (
                    <div className="absolute left-0 top-1/2 h-1 bg-primary-400 rounded" style={{ width: '50%', transform: 'translateY(-50%)' }} />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <style>{`
        .border-primary-600 { border-color: #6366f1 !important; }
        .bg-primary-100 { background: #eef2ff !important; }
        .text-primary-700 { color: #3730a3 !important; }
        .bg-primary-200 { background: #c7d2fe !important; }
        .shadow-lg { box-shadow: 0 4px 16px 0 rgba(99,102,241,0.10); }
        .scrollbar-thin { scrollbar-width: thin; }
        .scrollbar-thumb-gray-200::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 8px; }
        .scrollbar-track-transparent::-webkit-scrollbar-track { background: transparent; }
        .stepbar-active { box-shadow: 0 0 0 4px #c7d2fe; }
      `}</style>
    </div>
  );
};

export default StepBar;
