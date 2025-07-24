import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/protectedRoute";

export default function AdminAgendamentos() {
  const { agendamentos, loadTodosAgendamentos } = useAuth();

  useEffect(() => {
    loadTodosAgendamentos();
  }, []);


  const hoje = new Date().toISOString().split("T")[0];

return (
  <ProtectedRoute>
    <h1>Agendamentos</h1>

    <h2>Hoje</h2>
    <ul>
      {agendamentos
        .filter((a) => new Date(a.data_hora).toISOString().split("T")[0] === hoje)
        .map((a) => (
          <li key={a.id}>
            {new Date(a.data_hora).toLocaleString()} - Cliente: {a.cliente_id}
          </li>
        ))}
    </ul>

    <h2>Futuros</h2>
    <ul>
      {agendamentos
        .filter((a) => new Date(a.data_hora).toISOString().split("T")[0] > hoje)
        .map((a) => (
          <li key={a.id}>
            {new Date(a.data_hora).toLocaleString()} - Cliente: {a.cliente_id}
          </li>
        ))}
    </ul>
  </ProtectedRoute>
);
}
