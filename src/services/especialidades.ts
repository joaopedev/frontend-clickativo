import api from "./api";
import { EspecialidadeModel, UserModel } from "@/models";

export const getTodasEspecialidades = async (): Promise<EspecialidadeModel[]> => {
  const res = await api.get("/private/especialidades");
  return res.data.especialidades;
};

export const createEspecialidade = async (nome: string): Promise<EspecialidadeModel> => {
  const res = await api.post("/private/especialidades", { nome });
  return res.data.especialidade;
};

export const deleteEspecialidade = async (id: string): Promise<void> => {
  await api.delete(`/private/especialidades/${id}`);
};

export const getBarbeirosPorEspecialidade = async (
  especialidadeId: string
): Promise<UserModel[]> => {
  const res = await api.get(`/private/barbeiro-especialidade/barbeiros/${especialidadeId}`);
  return res.data.barbeiros;
};

export const getEspecialidadesDoBarbeiro = async (
  barbeiroId: string
): Promise<EspecialidadeModel[]> => {
  const res = await api.get(`/private/barbeiro-especialidade/especialidades/${barbeiroId}`);
  return res.data.especialidades;
};

export const vincularBarbeiroEspecialidade = async (
  barbeiro_id: string,
  especialidade_id: string
): Promise<void> => {
  await api.post("/private/barbeiro-especialidade", {
    barbeiro_id,
    especialidade_id,
  });
};

export const removerVinculoBarbeiroEspecialidade = async (
  barbeiro_id: string,
  especialidade_id: string
): Promise<void> => {
  await api.delete(`/private/barbeiro-especialidade`, {
    params: {
      barbeiro_id,
      especialidade_id,
    },
  });
};
