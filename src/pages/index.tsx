import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { loginUsuario } from "@/services/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await loginUsuario({ email, password });
    if (token) login(token);
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Entrar</button>
      <p><a href="/cadastro">Não tem conta? Cadastre-se</a></p>
    </form>
  );
}
