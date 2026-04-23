const UserId = ({ id }: { id: number }) => {
  const shortId = id.toString().slice(-4);
  return <div className="text-[#414141] font-mono text-sm">#{shortId}</div>;
};

export default UserId;
