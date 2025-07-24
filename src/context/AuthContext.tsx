import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  EspecialidadeModel,
  SchedulingModel,
  TipoUsuario,
  UserModel,
} from "@/models";
import {
  getTodasEspecialidades,
  createEspecialidade,
  deleteEspecialidade,
  getEspecialidadesDoBarbeiro,
  vincularBarbeiroEspecialidade,
  removerVinculoBarbeiroEspecialidade,
} from "@/services/especialidades";
import {
  createAgendamento,
  getAgendamentosByCliente,
  getTodosAgendamentos,
} from "@/services/scheduling";
import { obterTodosOsFuncionarios } from "@/services/users";

interface AuthContextType {
  user: UserModel | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  tipo_usuario: TipoUsuario | null;

  agendamentos: SchedulingModel[];
  loadAgendamentos: () => Promise<void>;
  loadTodosAgendamentos: () => Promise<void>;
  adicionarAgendamento: (agendamento: SchedulingModel) => Promise<void>;
  removerAgendamento: (id: string) => void;
  cancelarAgendamento: (id: string, clienteId: string) => Promise<void>;

  especialidades: EspecialidadeModel[];
  loadEspecialidades: () => Promise<void>;
  adicionarEspecialidade: (nome: string) => Promise<void>;
  removerEspecialidade: (id: string) => Promise<void>;
  vincularEspecialidadeAoBarbeiro: (
    barbeiroId: string,
    especialidadeId: string
  ) => Promise<void>;
  removerEspecialidadeDoBarbeiro: (
    barbeiroId: string,
    especialidadeId: string
  ) => Promise<void>;

  barbeiros: UserModel[];
  loadBarbeirosPorEspecialidade: (especialidadeId: string) => Promise<void>;
  getEspecialidadesDoBarbeiro: (
    barbeiroId: string
  ) => Promise<EspecialidadeModel[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserModel | null>(null);
  const [agendamentos, setAgendamentos] = useState<SchedulingModel[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadeModel[]>(
    []
  );
  const [barbeiros, setBarbeiros] = useState<UserModel[]>([]);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<UserModel>(storedToken);
        setToken(storedToken);
        setUser(decoded);
      } catch (err) {
        console.error("Token inválido:", err);
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadAgendamentosByClients();
      loadEspecialidades();
    }
  }, [user]);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<UserModel>(newToken);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(decoded);
      router.push("/dashboard");
    } catch (err) {
      console.error("Falha ao decodificar token:", err);
    }
  };

  const cancelarAgendamento = async (id: string, clienteId: string) => {
    try {
      await cancelarAgendamento(id, clienteId);
      setAgendamentos((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "CANCELADO" as typeof a.status } : a
        )
      );
    } catch (err) {
      console.error("Erro ao cancelar agendamento:", err);
      alert("Erro ao cancelar agendamento. Tente novamente.");
    }
  };

  const vincularEspecialidadeAoBarbeiro = async (
    barbeiroId: string,
    especialidadeId: string
  ) => {
    try {
      await vincularBarbeiroEspecialidade(barbeiroId, especialidadeId);
    } catch (err) {
      console.error("Erro ao vincular especialidade ao barbeiro:", err);
    }
  };

  const removerEspecialidadeDoBarbeiro = async (
    barbeiroId: string,
    especialidadeId: string
  ) => {
    try {
      await removerVinculoBarbeiroEspecialidade(barbeiroId, especialidadeId);
    } catch (err) {
      console.error("Erro ao remover especialidade do barbeiro:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAgendamentos([]);
    router.push("/");
  };

  const loadAgendamentosByClients = async () => {
    if (!user?.id) return;
    try {
      const dados = await getAgendamentosByCliente(user.id);
      setAgendamentos(dados);
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err);
    }
  };

  const loadTodosAgendamentos = async () => {
    try {
      const dados = await getTodosAgendamentos();
      setAgendamentos(dados);
    } catch (err) {
      console.error("Erro ao carregar todos os agendamentos:", err);
    }
  };

  const adicionarAgendamento = async (novo: SchedulingModel) => {
    try {
      const agendamentoSalvo = await createAgendamento(novo);
      setAgendamentos((prev) => [...prev, agendamentoSalvo]);
    } catch (err) {
      console.error("Erro ao criar agendamento:", err);
    }
  };

  const removerAgendamento = (id: string) => {
    setAgendamentos((prev) => prev.filter((a) => a.id !== id));
  };

  const loadEspecialidades = async () => {
    try {
      const dados = await getTodasEspecialidades();
      setEspecialidades(dados);
    } catch (err) {
      console.error("Erro ao carregar especialidades:", err);
    }
  };

  const adicionarEspecialidade = async (nome: string) => {
    try {
      const result = await createEspecialidade(nome);
      setEspecialidades((prev) => [...prev, result]);
    } catch (err) {
      console.error("Erro ao adicionar especialidade:", err);
    }
  };

  const removerEspecialidade = async (id: string) => {
    try {
      await deleteEspecialidade(id);
      setEspecialidades((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Erro ao remover especialidade:", err);
    }
  };

  const loadBarbeirosPorEspecialidade = async (especialidadeId: string) => {
    try {
      const todosBarbeiros = await obterTodosOsFuncionarios();

      if (!Array.isArray(todosBarbeiros)) {
        console.error("Resposta inesperada: esperava array de barbeiros");
        setBarbeiros([]);
        return;
      }

      const barbeirosComEspecialidade = await Promise.all(
        todosBarbeiros.map(async (barbeiro) => {
          try {
            if (!barbeiro.id) return null;

            const especialidades = await getEspecialidadesDoBarbeiro(
              barbeiro.id
            );
            const temEspecialidade = especialidades.some(
              (e) => e.id === especialidadeId
            );

            return temEspecialidade ? barbeiro : null;
          } catch (err) {
            console.warn(
              `Erro ao verificar especialidades do barbeiro ${barbeiro.name}:`,
              err
            );
            return null;
          }
        })
      );

      setBarbeiros(barbeirosComEspecialidade.filter(Boolean) as UserModel[]);
    } catch (err) {
      console.error("Erro ao buscar barbeiros por especialidade:", err);
      setBarbeiros([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        tipo_usuario: user?.tipo_usuario ?? null,
        agendamentos,
        loadAgendamentos: loadAgendamentosByClients,
        loadTodosAgendamentos,
        adicionarAgendamento,
        removerAgendamento,
        cancelarAgendamento,
        especialidades,
        loadEspecialidades,
        adicionarEspecialidade,
        removerEspecialidade,
        barbeiros,
        loadBarbeirosPorEspecialidade,
        vincularEspecialidadeAoBarbeiro,
        removerEspecialidadeDoBarbeiro,
        getEspecialidadesDoBarbeiro,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
export default AuthProvider;
