interface RegisterProps {
  createdAt: string;
}

const Register = ({ createdAt }: RegisterProps) => {
  if (!createdAt) return <div className="text-gray-400">—</div>;
  
  const date = new Date(createdAt);
  const formatted = date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  
  return <div className="text-[#414141] text-sm">{formatted}</div>;
};

export default Register;
