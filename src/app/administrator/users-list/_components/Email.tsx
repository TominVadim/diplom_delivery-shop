interface EmailProps {
  email: string | null;
  emailVerified: boolean;
}

const Email = ({ email, emailVerified }: EmailProps) => {
  // Технический email (phone@temp.com) не показываем
  if (!email || email.includes("@temp.com")) {
    return <div className="text-gray-400 text-sm">—</div>;
  }
  
  return (
    <div className={emailVerified ? "text-green-600" : "text-red-500"}>
      {email}
    </div>
  );
};

export default Email;
