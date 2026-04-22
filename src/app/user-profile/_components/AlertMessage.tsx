interface AlertMessageProps {
  type: "success" | "warning" | "error";
  message: string;
}

const AlertMessage = ({ type, message }: AlertMessageProps) => {
  const bgColor = {
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  }[type];

  return (
    <div className={`${bgColor} border rounded-lg p-3 text-sm`}>
      {message}
    </div>
  );
};

export default AlertMessage;
