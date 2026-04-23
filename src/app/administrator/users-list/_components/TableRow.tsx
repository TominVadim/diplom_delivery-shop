"use client";

import UserId from "./UserId";
import Person from "./Person";
import Age from "./Age";
import Email from "./Email";
import Phone from "./Phone";
import Role from "./Role";
import Register from "./Register";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string | null;
  location: string;
  region: string;
  gender: string;
  role: "user" | "admin" | "manager";
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

interface TableRowProps {
  user: User;
  currentUserRole: string;
  onRoleChange?: () => void;
}

const getSpanClass = (colName: string): string => {
  const spans: Record<string, string> = {
    userId: "col-span-1",
    person: "col-span-2",
    age: "col-span-1",
    email: "col-span-2",
    phone: "col-span-2",
    role: "col-span-2",
    register: "col-span-2",
  };
  return spans[colName] || "col-span-1";
};

const TableRow = ({ user, currentUserRole, onRoleChange }: TableRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
      <div className={getSpanClass("userId")}>
        <UserId id={user.id} />
      </div>
      
      <div className={getSpanClass("person")}>
        <Person name={user.name} birthDate={user.birthDate} />
      </div>
      
      <div className={getSpanClass("age")}>
        <Age birthDate={user.birthDate} />
      </div>
      
      <div className={getSpanClass("email")}>
        <Email email={user.email} emailVerified={user.emailVerified} />
      </div>
      
      <div className={getSpanClass("phone")}>
        <Phone phone={user.phone} phoneVerified={user.phoneVerified} />
      </div>
      
      <div className={getSpanClass("role")}>
        <Role 
          userId={user.id}
          initialRole={user.role}
          currentUserRole={currentUserRole}
          onRoleChange={onRoleChange}
        />
      </div>
      
      <div className={getSpanClass("register")}>
        <Register createdAt={user.createdAt} />
      </div>
    </div>
  );
};

export default TableRow;
