export enum HTTP_ERRORS {
  SUCESSO = 200,
  BAD_REQUEST = 400,
  ACESSO_NAO_AUTORIZADO = 401,
  ROTA_NAO_ENCONTRADA = 404,
  CONFLICT = 409,
  ERRO_INTERNO = 500,
  ERRO_API_EXTERNA = 403,
  DUPLICACAO_DE_DADOS = 409,
  LIMITE_DE_USO_EXCEDIDO = 429,
  VALIDACAO_DE_DADOS = 422,
  REGISTRO_NAO_ENCONTRADO = 404,
  OUTRO_ERRO = 550,
}

export enum ErrosBDModel {
  UNIQUE_VIOLATION = 23505,
}

export enum Status {
  cancelado = "cancelado",
  realizado = "realizado",
  pendente = "pendente",
  ausente = "ausente",
}

export enum TipoUsuario {
  superadmin = 1,
  cliente,
  barbeiro,
}

export interface SchedulingModel {
  id?: string;
  cliente_id: string;
  barbeiro_id: string;
  especialidade_id: string;
  data_hora:  string | Date;
  status: Status;
  especialidade?: string;
}

export interface EspecialidadeModel {
  id?: string;
  nome: string;
}

export interface UserModel {
  id?: string;
  name: string;
  email?: string;
  data_nascimento: string;
  password: string;
  tipo_usuario: TipoUsuario;
  ativo: boolean;
  data_contratacao?: Date;
  idade?: number;
}
