"use client";

interface PriceFilterHeaderProps {
  onResetAction: () => void;
}

const PriceFilterHeader = ({ onResetAction }: PriceFilterHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <p className="text-black text-base">Цена</p>
      <button
        type="button"
        onClick={onResetAction}
        className="text-xs rounded bg-[#f3f2f1] h-8 p-2 cursor-pointer hover:bg-[#70c05b] hover:shadow-md hover:text-white active:shadow-sm duration-300"
      >
        Очистить
      </button>
    </div>
  );
};

export default PriceFilterHeader;
