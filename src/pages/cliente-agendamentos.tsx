import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/protectedRoute";
import { Status } from "../models";
import api from "@/services/api";

export default function ClienteAgendamentos() {
  const { user, agendamentos, loadAgendamentos } = useAuth();

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const handleCancelar = async (id: string) => {
    const agendamento = agendamentos.find((a) => a.id === id);
    if (!agendamento) return;

    const dataHora = new Date(agendamento.data_hora);
    const diff = (dataHora.getTime() - new Date().getTime()) / (1000 * 60 * 60);

    if (diff < 2)
      return alert("Cancelamento deve ser feito com 2h de antecedência.");

    await api.patch(`/cancelScheduling?id=${id}&cliente_id=${user?.id}`);
    loadAgendamentos();
  };

  return (
    <ProtectedRoute>
      <h1>Meus Agendamentos</h1>
      <ul>
        {agendamentos.map((a) => (
          <li key={a.id}>
            {new Date(a.data_hora).toLocaleString()} - Status:{" "}
            {Status[a.status]}
            {a.status === "pendente" && (
              <button onClick={() => handleCancelar(a.id!)}>Cancelar</button>
            )}
          </li>
        ))}
      </ul>
    </ProtectedRoute>
  );
}
