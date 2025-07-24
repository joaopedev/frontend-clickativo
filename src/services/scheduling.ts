import api from "./api";
import { SchedulingModel } from "@/models";

export const getAgendamentosByCliente = async (clienteId: string): Promise<SchedulingModel[]> => {
  const res = await api.get(`private/scheduling`);
  return res.data.agendamentos.filter((a: SchedulingModel) => a.cliente_id === clienteId);
};

export const createAgendamento = async (
  agendamento: Partial<SchedulingModel>
): Promise<SchedulingModel> => {
  const res = await api.post("private/registerScheduling", {
    ...agendamento,
    data_hora: new Date(agendamento.data_hora!), 
  });

  return res.data.result;
};

export const getTodosAgendamentos = async () => {
  const response = await api.get("private/scheduling");
  return response.data.agendamentos;
};

export const cancelarAgendamento = async (id: string, clienteId: string): Promise<void> => {
  await api.patch(`private/cancelScheduling?id=${id}&cliente_id=${clienteId}`);
};