import { useState } from "react";

import { TipoUsuario } from "../models";
import { registrarUsuario } from "@/services/users";

export default function CadastroPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    data_nascimento: "",
    tipo_usuario: TipoUsuario.cliente,
    data_contratacao: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuarioParaRegistrar = {
      ...form,
      data_contratacao: form.data_contratacao ? new Date(form.data_contratacao) : undefined,
    };
    await registrarUsuario(usuarioParaRegistrar);
    alert("Usuário cadastrado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Cadastro</h1>
      <input name="name" placeholder="Nome" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Senha" onChange={handleChange} required />
      <input name="data_nascimento" type="date" onChange={handleChange} required />

      <select name="tipo_usuario" onChange={handleChange}>
        <option value={TipoUsuario.cliente}>Cliente</option>
        <option value={TipoUsuario.barbeiro}>Barbeiro</option>
      </select>

      {form.tipo_usuario == TipoUsuario.barbeiro && (
        <input
          name="data_contratacao"
          type="date"
          placeholder="Data de contratação"
          onChange={handleChange}
          required
        />
      )}

      <button type="submit">Cadastrar</button>
    </form>
  );
}
