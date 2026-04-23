import { maskedPhone } from "@/utils/admin/maskPhone";

interface PhoneProps {
  phone: string | null;
  phoneVerified: boolean;
}

const Phone = ({ phone, phoneVerified }: PhoneProps) => {
  if (!phone) return <div className="text-gray-400">—</div>;
  
  const formattedPhone = maskedPhone(phone);
  
  return (
    <div className={phoneVerified ? "text-green-600" : "text-red-500"}>
      {formattedPhone}
    </div>
  );
};

export default Phone;
