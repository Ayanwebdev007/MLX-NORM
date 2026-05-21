import React from 'react';
import { CircleCheck, Clock } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';

const DashboardStepper = () => {
  const { isFormWizard, currentStepIndex, steps, isStepFilled } = useRegistration();

  if (!isFormWizard) return null;

  return (
    <div className="py-4 select-none">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-green-600 transition-all duration-300 -z-10" 
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s, idx) => {
          const isPast = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          const isFilled = isStepFilled(s.key);
          
          return (
            <div key={s.key} className="flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-normal transition-all duration-200 border-2 ${
                  isPast 
                    ? isFilled
                      ? 'border-green-600 bg-green-600 text-white' 
                      : 'border-amber-500 bg-amber-500 text-white'
                    : isActive 
                    ? 'border-green-600 text-green-600 ring-4 ring-green-50 bg-white' 
                    : 'border-slate-300 text-slate-800 bg-white'
                }`}
              >
                {isPast ? (
                  isFilled ? <CircleCheck size={16} /> : <Clock size={16} />
                ) : (
                  s.num
                )}
              </div>
              <span 
                className={`hidden md:block text-sm font-normal mt-3 tracking-tight ${
                  isActive 
                    ? 'text-green-600 font-medium' 
                    : isPast 
                    ? isFilled 
                      ? 'text-slate-700' 
                      : 'text-amber-600 font-medium' 
                    : 'text-slate-800'
                }`}
              >
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStepper;
