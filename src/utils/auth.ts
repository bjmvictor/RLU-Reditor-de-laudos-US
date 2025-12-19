import type { User, Role, UnitSettings, Permission } from "@/types";

const USERS_KEY = "flowus_users";
const ROLES_KEY = "flowus_roles";
const SETTINGS_KEY = "flowus_settings";
const CURRENT_USER_KEY = "flowus_current_user";

// Dados padrão
const defaultRoles: Role[] = [
  {
    id: "role-admin",
    name: "Administrador",
    description: "Acesso total ao sistema",
    permissions: ["view_reports", "create_reports", "edit_reports", "delete_reports", "manage_users", "manage_roles", "manage_settings"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "role-doctor",
    name: "Médico",
    description: "Pode criar e visualizar laudos",
    permissions: ["view_reports", "create_reports", "edit_reports"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "role-user",
    name: "Usuário",
    description: "Apenas visualizar laudos",
    permissions: ["view_reports"],
    createdAt: new Date().toISOString(),
  },
];

const defaultUsers: User[] = [
  {
    id: "user-admin",
    username: "admin",
    password: "admin", // Em produção, usar hash
    name: "Administrador do Sistema",
    roleIds: ["role-admin"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const defaultSettings: UnitSettings = {
  unitName: "FlowUS - Clínica de Ultrassom",
  address: "Rua Exemplo, 123 - Cidade/UF",
  phone: "(00) 0000-0000",
  primaryColor: "#3b82f6",
  secondaryColor: "#1e40af",
};

// Inicializa dados padrão se não existirem
export function initializeStorage() {
  if (!localStorage.getItem(ROLES_KEY)) {
    localStorage.setItem(ROLES_KEY, JSON.stringify(defaultRoles));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  }
}

// Auth
export function login(username: string, password: string): User | null {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find((u) => u.username === username && u.password === password && u.isActive);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Users
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function saveUser(user: User) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function deleteUser(id: string) {
  const users = getUsers().filter((u) => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Roles
export function getRoles(): Role[] {
  return JSON.parse(localStorage.getItem(ROLES_KEY) || "[]");
}

export function saveRole(role: Role) {
  const roles = getRoles();
  const index = roles.findIndex((r) => r.id === role.id);
  if (index >= 0) {
    roles[index] = role;
  } else {
    roles.push(role);
  }
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

export function deleteRole(id: string) {
  const roles = getRoles().filter((r) => r.id !== id);
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

// Settings
export function getSettings(): UnitSettings {
  return JSON.parse(localStorage.getItem(SETTINGS_KEY) || JSON.stringify(defaultSettings));
}

export function saveSettings(settings: UnitSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Permissions
export function getUserPermissions(user: User): Permission[] {
  const roles = getRoles();
  const userRoles = roles.filter((r) => user.roleIds.includes(r.id));
  const allPermissions = userRoles.flatMap((r) => r.permissions);
  return Array.from(new Set(allPermissions));
}

export function hasPermission(user: User, permission: Permission): boolean {
  return getUserPermissions(user).includes(permission);
}
