"use client";

import { useState, useEffect } from "react";
import { getRoleStyles, getRoleLabel, UserRole } from "@/utils/admin/rolesUtils";
import Image from "next/image";

interface RoleProps {
  userId: number;
  initialRole: UserRole;
  currentUserRole: string;
  onRoleChange?: () => void;
}

const Role = ({ userId, initialRole, currentUserRole, onRoleChange }: RoleProps) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Только admin может менять роли
  const canChangeRole = currentUserRole === "admin";
  
  const handleRoleChange = async (newRole: UserRole) => {
    if (!canChangeRole || newRole === role) {
      setShowDropdown(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (response.ok) {
        setRole(newRole);
        onRoleChange?.();
      } else {
        const error = await response.json();
        console.error("Ошибка изменения роли:", error);
      }
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setIsLoading(false);
      setShowDropdown(false);
    }
  };
  
  const roleOptions: UserRole[] = ["user", "manager", "admin"];
  
  // Для admin нельзя менять свою роль
  const allowRoleChange = canChangeRole && role !== "admin";
  
  return (
    <div className="relative">
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${getRoleStyles(role)} ${
          allowRoleChange ? "cursor-pointer" : ""
        }`}
        onClick={() => allowRoleChange && setShowDropdown(!showDropdown)}
      >
        <span>{getRoleLabel(role)}</span>
        {allowRoleChange && !isLoading && (
          <Image
            src="/icons-header/icon-arrow.svg"
            alt="Изменить"
            width={12}
            height={12}
            className="transform rotate-90"
          />
        )}
        {isLoading && <span className="text-xs">...</span>}
      </div>
      
      {showDropdown && allowRoleChange && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[120px]">
            {roleOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleRoleChange(option)}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                  option === role ? "font-bold bg-gray-50" : ""
                }`}
              >
                {getRoleLabel(option)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Role;
