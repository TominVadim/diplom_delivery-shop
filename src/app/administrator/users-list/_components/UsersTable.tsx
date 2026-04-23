"use client";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

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

interface UsersTableProps {
  users: User[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  currentPage: number;
  totalPages: number;
  currentUserRole: string;
  onSort: (field: string, direction: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onRoleChange: () => void;
}

const UsersTable = ({
  users,
  sortBy,
  sortDirection,
  currentPage,
  totalPages,
  currentUserRole,
  onSort,
  onPageChange,
  onRoleChange,
}: UsersTableProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Пользователи не найдены
      </div>
    );
  }

  return (
    <div>
      <TableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      
      <div className="mt-2">
        {users.map((user) => (
          <TableRow
            key={user.id}
            user={user}
            currentUserRole={currentUserRole}
            onRoleChange={onRoleChange}
          />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UsersTable;
