import api from "./api";
import { UserModel } from "../models";

export const registrarUsuario = async (usuario: Partial<UserModel>) => {
  const res = await api.post("private/register", usuario);
  return res.data;
};

export const obterTodosOsFuncionarios = async (): Promise<UserModel[]> => {
  const res = await api.get("private/accountEmployers"); 
    return res.data.contas;
}

export const obterTodosUsuarios = async (): Promise<UserModel[]> => {
  const res = await api.get("private/users");
  return res.data.users;
};

export const obterUsuarioPorId = async (id: string): Promise<UserModel> => {
  const res = await api.get(`private/users/${id}`);
  return res.data.user;
};

export const atualizarUsuario = async (id: string, usuario: Partial<UserModel>) => {
  const res = await api.put(`private/users/${id}`, usuario);
  return res.data.user;
};

export const excluirUsuario = async (id: string) => {
  await api.delete(`private/users/${id}`);
};

