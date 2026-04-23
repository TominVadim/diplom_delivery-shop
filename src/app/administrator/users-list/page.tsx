"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import NavAndInfo from "./_components/NavAndInfo";
import UsersTable from "./_components/UsersTable";
import Loader from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";

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

const pageSizeOptions = [5, 10, 20, 50, 100];

const UsersListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  
  const router = useRouter();

  // Загрузка текущего пользователя
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.replace("/");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const role = user.role || "user";
      setCurrentUserRole(role);
      if (role !== "admin" && role !== "manager") {
        router.replace("/");
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("pageSize", pageSize.toString());
      params.append("sortBy", sortBy);
      params.append("sort", sortDirection);
      
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Ошибка загрузки пользователей");
      }
      
      const data = await response.json();
      setUsers(data.users);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Ошибка загрузки"));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDirection]);

  useEffect(() => {
    if (currentUserRole === "admin" || currentUserRole === "manager") {
      loadUsers();
    }
  }, [loadUsers, currentUserRole]);

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortBy(field);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleRoleChange = () => {
    loadUsers();
  };

  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <ErrorComponent
        error={error}
        userMessage="Не удалось загрузить список пользователей"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#414141] mb-6">
      </h1>
      
      <NavAndInfo
        totalCount={totalCount}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={handlePageSizeChange}
      />
      
      <UsersTable
        users={users}
        sortBy={sortBy}
        sortDirection={sortDirection}
        currentPage={currentPage}
        totalPages={totalPages}
        currentUserRole={currentUserRole}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default UsersListPage;
