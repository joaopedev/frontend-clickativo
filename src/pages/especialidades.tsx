import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/protectedRoute";
import { useAuth } from "@/context/AuthContext";
import { EspecialidadeModel, TipoUsuario } from "@/models";

export default function Especialidades() {
  const {
    especialidades,
    adicionarEspecialidade,
    removerEspecialidade,
    vincularEspecialidadeAoBarbeiro,
    removerEspecialidadeDoBarbeiro,
    getEspecialidadesDoBarbeiro,
    barbeiros,
    user,
    loadEspecialidades,
    loadBarbeirosPorEspecialidade,
  } = useAuth();

  const [nova, setNova] = useState("");
  const [barbeiroId, setBarbeiroId] = useState("");
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState("");
  const [especialidadesDoBarbeiro, setEspecialidadesDoBarbeiro] = useState<
    EspecialidadeModel[]
  >([]);

  useEffect(() => {
    if (user?.tipo_usuario === TipoUsuario.barbeiro) {
      obterTodosBarbeiros();
      loadEspecialidades();
    }
  }, [user]);

  const obterTodosBarbeiros = async () => {
    await loadBarbeirosPorEspecialidade("");
  };

  useEffect(() => {
    if (barbeiroId) {
      fetchEspecialidadesDoBarbeiro();
    } else {
      setEspecialidadesDoBarbeiro([]);
    }
  }, [barbeiroId]);

  const fetchEspecialidadesDoBarbeiro = async () => {
    const response = await getEspecialidadesDoBarbeiro(barbeiroId);
    setEspecialidadesDoBarbeiro(response);
  };

  const handleAdd = async () => {
    if (!nova.trim()) return;
    await adicionarEspecialidade(nova);
    setNova("");
  };

  const handleDelete = async (id: string) => {
    await removerEspecialidade(id);
  };

  const handleVincular = async () => {
    if (!barbeiroId || !especialidadeSelecionada) return;
    await vincularEspecialidadeAoBarbeiro(barbeiroId, especialidadeSelecionada);
    await fetchEspecialidadesDoBarbeiro();
    setEspecialidadeSelecionada("");
  };

  const handleDesvincular = async (id: string) => {
    await removerEspecialidadeDoBarbeiro(barbeiroId, id);
    await fetchEspecialidadesDoBarbeiro();
  };

  return (
    <ProtectedRoute>
      <h1>Gerenciar Especialidades</h1>

      {/* Adicionar nova especialidade */}
      <input
        value={nova}
        onChange={(e) => setNova(e.target.value)}
        placeholder="Nova especialidade"
      />
      <button onClick={handleAdd}>Adicionar</button>

      <ul>
        {especialidades.map((e) => (
          <li key={e.id}>
            {e.nome}{" "}
            <button onClick={() => handleDelete(e.id!)}>Remover</button>
          </li>
        ))}
      </ul>

      <hr />

      {/* Gerenciar vínculos */}
      <h2>Vincular Especialidades a Barbeiros</h2>

      <label>Selecione um barbeiro:</label>
      <select
        value={barbeiroId}
        onChange={(e) => setBarbeiroId(e.target.value)}
      >
        <option value="">-- Escolha um barbeiro --</option>
        {barbeiros.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {barbeiroId && (
        <>
          <label>Especialidade:</label>
          <select
            value={especialidadeSelecionada}
            onChange={(e) => setEspecialidadeSelecionada(e.target.value)}
          >
            <option value="">-- Escolha uma especialidade --</option>
            {especialidades.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>

          <button onClick={handleVincular}>Vincular ao barbeiro</button>

          <h3>Especialidades vinculadas:</h3>
          <ul>
            {especialidadesDoBarbeiro.map((esp) => (
              <li key={esp.id}>
                {esp.nome}{" "}
                <button onClick={() => handleDesvincular(esp.id!)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </ProtectedRoute>
  );
}
