// app/matricula/lib/types.ts
export interface ContratanteData {
  nome: string; pai: string; mae: string; rg: string; cpf: string;
  fone: string; celular: string; endereco: string; n: string;
  bairro: string; cidade: string; uf: string;
}

export interface AlunoData {
  nome: string; dataNasc: string; telefone: string;
  whatsapp: string; email: string; facebook: string;
}

export interface ModuloInfo {
  sel: boolean;
  das: string;
  as: string;
  dias: string;
}

export interface FinanceiroData {
  matricula: string;
  valorModulo: string;
  formaPagamento: 'a_vista' | 'cartao' | 'boleto' | '';
  observacao: string;
}

export interface FormData {
  matriculaNum: string;
  contratante: ContratanteData;
  aluno: AlunoData;
  modulos: {
    m1: ModuloInfo;
    m2: ModuloInfo;
    m3: ModuloInfo;
    m4: ModuloInfo;
  };
  periodoCurso: string;
  previsaoInicio: string;
  financeiro: FinanceiroData;
}