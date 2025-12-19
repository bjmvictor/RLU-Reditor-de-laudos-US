export type Permission = 
  | "view_reports"
  | "create_reports"
  | "edit_reports"
  | "delete_reports"
  | "manage_users"
  | "manage_roles"
  | "manage_settings";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string; // Em produção, usar hash
  name: string;
  crm?: string; // Obrigatório se roleIds incluir papel de médico
  roleIds: string[];
  isActive: boolean;
  createdAt: string;
}

export interface UnitSettings {
  unitName: string;
  address: string;
  phone: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  crm?: string;
  roles: Role[];
  permissions: Permission[];
}
