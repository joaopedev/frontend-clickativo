import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { TipoUsuario } from "@/models";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <h1>Dashboard</h1>
      <ul>
        {user?.tipo_usuario === TipoUsuario.superadmin && (
          <>
            <li><Link href="/agendar">Agendar horário</Link></li>
            <li><Link href="/cliente-agendamentos">Meus agendamentos</Link></li>
            <li><Link href="/admin-agendamentos">Painel Admin</Link></li>
            <li><Link href="/especialidades">Gerenciar Especialidades</Link></li>
          </>
        )}

        {user?.tipo_usuario === TipoUsuario.cliente && (
          <>
            <li><Link href="/agendar">Agendar horário</Link></li>
            <li><Link href="/cliente-agendamentos">Meus agendamentos</Link></li>
          </>
        )}

        {user?.tipo_usuario === TipoUsuario.barbeiro && (
          <li><Link href="/admin-agendamentos">Painel Admin</Link></li>
        )}
      </ul>
    </ProtectedRoute>
  );
}
