import * as React from "react";


interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({ min = 0, max = 24, step = 0.25, value, onValueChange, label, ...props }) => {
  return (
    <div className="flex flex-col w-full items-center">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-center gap-3 w-full">
        <span className="text-xs text-gray-500 w-8 text-right">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onValueChange(Number(e.target.value))}
          className="w-full accent-indigo-600 h-2 rounded-lg appearance-none bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          {...props}
        />
        <span className="text-xs text-gray-500 w-8 text-left">{max}</span>
      </div>
      <span className="mt-1 text-xs text-gray-700 font-semibold">{value.toFixed(2).replace('.00','')}</span>
    </div>
  );
};
