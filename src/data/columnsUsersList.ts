export interface ColumnConfig {
  key: string;
  label: string;
  colSpan: number;
  sortable: boolean;
}

export const columnsUsersList: ColumnConfig[] = [
  { key: "userId", label: "ID", colSpan: 1, sortable: true },
  { key: "person", label: "Пользователь", colSpan: 2, sortable: true },
  { key: "age", label: "Возраст", colSpan: 1, sortable: true },
  { key: "email", label: "Email", colSpan: 2, sortable: true },
  { key: "phone", label: "Телефон", colSpan: 2, sortable: true },
  { key: "role", label: "Роль", colSpan: 2, sortable: false },
  { key: "register", label: "Дата регистрации", colSpan: 2, sortable: true },
];
