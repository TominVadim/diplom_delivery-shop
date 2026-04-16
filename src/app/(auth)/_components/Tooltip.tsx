'use client';

interface TooltipProps {
  text: string;
}

const Tooltip = ({ text }: TooltipProps) => {
  return (
    <div className="absolute top-full left-0 mt-1 z-10 animate-fadeIn">
      <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
        {text}
        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </div>
  );
};

export default Tooltip;
