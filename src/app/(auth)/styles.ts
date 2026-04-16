export const buttonStyles = {
  base: "w-65 h-17 my-10 mx-auto text-2xl rounded cursor-pointer transition-all duration-200",
  active:
    "bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active)",
  inactive: "bg-[#fcd5ba] text-[#ff6633]",
};

export const formStyles = {
  label: "text-base text-[#8f8f8f] block",
  input:
    "w-65 h-10 py-2 px-4 text-[#414141] text-base border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-(--shadow-button-default) focus:bg-white focus:outline-none caret-(--color-primary)",
  loginLink:
    "mb-10 mx-auto h-8 text-(--color-primary) hover:text-white active:text-white border-1 border-(--color-primary) bg-white hover:bg-(--color-primary) active:shadow-(--shadow-button-default) w-30 rounded flex items-center justify-center duration-300",
  radioLabel: "px-4 py-2 border rounded-lg cursor-pointer transition-colors",
  radioLabelActive: "bg-blue-500 text-white border-blue-500",
  wrapper: "max-w-[1200px] mx-auto px-4 py-8 md:py-12",
  container: "bg-white rounded-2xl shadow-md p-6 md:p-8 lg:p-10",
  header: "flex justify-between items-center mb-6 md:mb-8",
  closeButton: "p-2 hover:bg-gray-100 rounded-full transition-colors",
  title: "text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A3A3A] mb-2",
  subtitle: "text-base text-gray-500 mb-6",
  form: "space-y-6",
  formRow: "grid grid-cols-1 md:grid-cols-2 gap-6",
  inputError: "border-red-500 focus:ring-red-500",
  errorText: "text-red-500 text-sm mt-1",
  button: "w-full bg-[#2E7D64] text-white py-3 rounded-lg font-medium hover:bg-[#236B55] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  required: "text-red-500 ml-1",
};
