import { useEffect, useState } from "react";
import {
  EspecialidadeModel,
  SchedulingModel,
  Status,
  UserModel,
} from "../models";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/protectedRoute";

export default function Agendar() {
  const {
    user,
    especialidades,
    loadEspecialidades,
    barbeiros,
    loadBarbeirosPorEspecialidade,
    adicionarAgendamento,
  } = useAuth();

  const [form, setForm] = useState<Partial<SchedulingModel>>({
    especialidade_id: "",
    barbeiro_id: "",
    status: Status.pendente,
    data_hora: undefined,
  });

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [barbeirosFiltrados, setBarbeirosFiltrados] = useState<UserModel[]>([]);

  useEffect(() => {
    loadEspecialidades();
  }, []);

  useEffect(() => {
    if (form.especialidade_id) {
      loadBarbeirosPorEspecialidade(form.especialidade_id).then(() => {
        setBarbeirosFiltrados([...barbeiros]);
      });
    } else {
      setBarbeirosFiltrados([]);
    }
  }, [form.especialidade_id]);

  const gerarHorarios = (dataSelecionada: string) => {
    if (!dataSelecionada) return;

    const [year, month, day] = dataSelecionada.split("-").map(Number);

    const horariosBase = [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ];

    const horarios: string[] = horariosBase.map((hora) => {
      const [h, m] = hora.split(":").map(Number);
      const localDate = new Date(year, month - 1, day, h, m);
      return localDate.toISOString();
    });

    console.log(
      "Horários gerados:",
      horarios.map((h) => new Date(h).toLocaleString())
    );
    setHorariosDisponiveis(horarios);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "data") {
      console.log("Data selecionada:", value);
      setSelectedDate(value);
      gerarHorarios(value);
    } else if (name === "data_hora") {
      setForm((prev) => ({
        ...prev,
        data_hora: value,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { especialidade_id, barbeiro_id, data_hora } = form;

    if (!user?.id || !especialidade_id || !barbeiro_id || !data_hora) {
      console.error("Campos obrigatórios não preenchidos:", form);
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const dataConvertida = new Date(data_hora as string);

    if (isNaN(dataConvertida.getTime())) {
      alert("Data/hora inválida!");
      return;
    }

    const novoAgendamento: SchedulingModel = {
      cliente_id: user.id,
      barbeiro_id,
      especialidade_id,
      data_hora: dataConvertida,
      status: Status.pendente,
    };

    try {
      await adicionarAgendamento(novoAgendamento);
      alert("Agendamento criado com sucesso!");
      setForm({
        especialidade_id: "",
        barbeiro_id: "",
        status: Status.pendente,
        data_hora: undefined,
      });
      setSelectedDate("");
      setHorariosDisponiveis([]);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert("Erro ao criar agendamento. Verifique os dados.");
    }
  };

  return (
    <ProtectedRoute>
      <h1>Agendamento</h1>
      <form onSubmit={handleSubmit}>
        <select
          name="especialidade_id"
          value={form.especialidade_id}
          onChange={handleChange}
          required
        >
          <option value="">Escolha especialidade</option>
          {especialidades.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>

        <select
          name="barbeiro_id"
          value={form.barbeiro_id}
          onChange={handleChange}
          required
          disabled={!form.especialidade_id}
        >
          <option value="">
            {form.especialidade_id
              ? barbeirosFiltrados.length > 0
                ? "Escolha barbeiro"
                : "Nenhum barbeiro disponível"
              : "Escolha uma especialidade primeiro"}
          </option>
          {barbeirosFiltrados.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="data"
          value={selectedDate}
          onChange={handleChange}
          required
        />

        <select
          name="data_hora"
          value={typeof form.data_hora === "string" ? form.data_hora : ""}
          onChange={handleChange}
          required
        >
          <option value="">Escolha horário</option>
          {horariosDisponiveis.map((h) => (
            <option key={h} value={h}>
              {new Date(h).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </option>
          ))}
        </select>

        <button type="submit">Agendar</button>
      </form>
    </ProtectedRoute>
  );
}
