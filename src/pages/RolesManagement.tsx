import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getRoles, saveRole, deleteRole, type Role, type Permission } from "@/utils/auth";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const allPermissions: Permission[] = [
  "view_reports",
  "create_reports",
  "edit_reports",
  "delete_reports",
  "manage_users",
  "manage_roles",
  "manage_settings",
];

const permissionLabels: Record<Permission, string> = {
  view_reports: "Visualizar Laudos",
  create_reports: "Criar Laudos",
  edit_reports: "Editar Laudos",
  delete_reports: "Excluir Laudos",
  manage_users: "Gerenciar Usuários",
  manage_roles: "Gerenciar Papéis",
  manage_settings: "Gerenciar Configurações",
};

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPermissions, setFormPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => setRoles(getRoles());

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormName(role.name);
      setFormDescription(role.description);
      setFormPermissions(role.permissions);
    } else {
      setEditingRole(null);
      setFormName("");
      setFormDescription("");
      setFormPermissions([]);
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName) {
      toast.error("Nome é obrigatório");
      return;
    }
    const role: Role = {
      id: editingRole?.id || crypto.randomUUID(),
      name: formName,
      description: formDescription,
      permissions: formPermissions,
      createdAt: editingRole?.createdAt || new Date().toISOString(),
    };
    saveRole(role);
    toast.success(editingRole ? "Papel atualizado" : "Papel criado");
    setDialogOpen(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este papel?")) {
      deleteRole(id);
      toast.success("Papel excluído");
      loadData();
    }
  };

  const togglePermission = (perm: Permission) => {
    setFormPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto p-6">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Gerenciamento de Papéis</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Papel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingRole ? "Editar Papel" : "Novo Papel"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="name">Nome*</Label>
                    <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={2} />
                  </div>
                  <div>
                    <Label className="mb-2 block">Permissões</Label>
                    <div className="space-y-2 border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                      {allPermissions.map((perm) => (
                        <div key={perm} className="flex items-center gap-2">
                          <Checkbox
                            id={perm}
                            checked={formPermissions.includes(perm)}
                            onCheckedChange={() => togglePermission(perm)}
                          />
                          <Label htmlFor={perm} className="cursor-pointer">{permissionLabels[perm]}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-4 border rounded-md bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{role.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {role.permissions.length} permissão(ões)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(role)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(role.id)}>
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
