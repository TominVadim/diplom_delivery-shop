// Пустой блок-заглушка вместо SelectRegion (сохраняет вёрстку)
interface SelectRegionPlaceholderProps {
  value?: string;
  onChangeAction?: (value: any) => void;
}

const SelectRegionPlaceholder = ({ value, onChangeAction }: SelectRegionPlaceholderProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[#414141] mb-1 opacity-0">
        Регион
      </label>
      <div className="h-[56px]"></div>
    </div>
  );
};

export default SelectRegionPlaceholder;
