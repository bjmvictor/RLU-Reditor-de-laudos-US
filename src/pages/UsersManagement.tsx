import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getUsers, saveUser, deleteUser, getRoles, type User, type Role } from "@/utils/auth";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Lock, Unlock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formName, setFormName] = useState("");
  const [formCrm, setFormCrm] = useState("");
  const [formRoleIds, setFormRoleIds] = useState<string[]>([]);
  const [formIsActive, setFormIsActive] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(getUsers());
    setRoles(getRoles());
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormUsername(user.username);
      setFormPassword("");
      setFormName(user.name);
      setFormCrm(user.crm || "");
      setFormRoleIds(user.roleIds);
      setFormIsActive(user.isActive);
    } else {
      setEditingUser(null);
      setFormUsername("");
      setFormPassword("");
      setFormName("");
      setFormCrm("");
      setFormRoleIds([]);
      setFormIsActive(true);
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formUsername || !formName || formRoleIds.length === 0) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    if (!editingUser && !formPassword) {
      toast.error("Senha é obrigatória para novos usuários");
      return;
    }

    const user: User = {
      id: editingUser?.id || crypto.randomUUID(),
      username: formUsername,
      password: formPassword || editingUser?.password || "",
      name: formName,
      crm: formCrm || undefined,
      roleIds: formRoleIds,
      isActive: formIsActive,
      createdAt: editingUser?.createdAt || new Date().toISOString(),
    };

    saveUser(user);
    toast.success(editingUser ? "Usuário atualizado" : "Usuário criado");
    setDialogOpen(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUser(id);
      toast.success("Usuário excluído");
      loadData();
    }
  };

  const toggleRoleSelection = (roleId: string) => {
    setFormRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto p-6">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Gerenciamento de Usuários</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do usuário e selecione os papéis.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Usuário*</Label>
                      <Input
                        id="username"
                        value={formUsername}
                        onChange={(e) => setFormUsername(e.target.value)}
                        placeholder="usuario123"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">
                        Senha{editingUser ? " (deixe em branco para não alterar)" : "*"}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="******"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name">Nome Completo*</Label>
                    <Input
                      id="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Dr. João Silva"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crm">CRM (opcional)</Label>
                    <Input
                      id="crm"
                      value={formCrm}
                      onChange={(e) => setFormCrm(e.target.value)}
                      placeholder="12345-SP"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Papéis (selecione ao menos um)*</Label>
                    <div className="space-y-2 border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                      {roles.map((role) => (
                        <div key={role.id} className="flex items-center gap-2">
                          <Checkbox
                            id={role.id}
                            checked={formRoleIds.includes(role.id)}
                            onCheckedChange={() => toggleRoleSelection(role.id)}
                          />
                          <Label htmlFor={role.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">{role.name}</span>
                            <span className="text-xs text-gray-500 ml-2">{role.description}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={formIsActive}
                      onCheckedChange={(checked) => setFormIsActive(checked as boolean)}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">Usuário ativo</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-md bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{user.name}</p>
                      {!user.isActive && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Bloqueado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{user.username} {user.crm && `• CRM: ${user.crm}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Papéis: {roles.filter((r) => user.roleIds.includes(r.id)).map((r) => r.name).join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
