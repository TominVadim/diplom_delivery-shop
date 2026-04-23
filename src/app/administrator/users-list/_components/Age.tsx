import { calculateAge } from "@/utils/admin/calculateAge";

interface AgeProps {
  birthDate: string | null;
}

const Age = ({ birthDate }: AgeProps) => {
  const age = calculateAge(birthDate);
  return <div className="text-[#414141]">{age > 0 ? age : "—"}</div>;
};

export default Age;
