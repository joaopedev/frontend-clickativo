import api from "./api";

export const loginUsuario = async ({ email, password }: { email: string; password: string }) => {
  const res = await api.post("login", { email, password });
  return res.data.token;
};