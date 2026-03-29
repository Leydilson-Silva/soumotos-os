import React from 'react';
import Input from './Input';
import { maskCPF, maskPhone } from '../lib/masks';
import type { ContratanteData } from '../lib/types';

interface ContratanteFormProps {
  data: ContratanteData;
  matriculaNum: string;
  handleUpdate: (section: 'contratante', field: string, value: string) => void;
  setMatriculaNum: (value: string) => void;
}

export default function ContratanteForm({ data, matriculaNum, handleUpdate, setMatriculaNum }: ContratanteFormProps) {
  return (
    <section className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contratante</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Matrícula Nº" value={matriculaNum} onChange={setMatriculaNum} />
        <Input label="Nome Completo" colSpan="col-span-2" value={data.nome} onChange={v => handleUpdate('contratante', 'nome', v)} />
        <Input label="CPF" value={data.cpf} onChange={v => handleUpdate('contratante', 'cpf', maskCPF(v))} />
        <Input label="RG" value={data.rg} onChange={v => handleUpdate('contratante', 'rg', v)} />
        <Input label="Pai" value={data.pai} onChange={v => handleUpdate('contratante', 'pai', v)} />
        <Input label="Mãe" value={data.mae} onChange={v => handleUpdate('contratante', 'mae', v)} />
        <Input label="Telefone Contratante" value={data.fone} onChange={v => handleUpdate('contratante', 'fone', maskPhone(v))} />
        <Input label="WhatsApp Contratante" value={data.celular} onChange={v => handleUpdate('contratante', 'celular', maskPhone(v))} />
        <Input label="Endereço" colSpan="col-span-2" value={data.endereco} onChange={v => handleUpdate('contratante', 'endereco', v)} />
        <Input label="Nº" value={data.n} onChange={v => handleUpdate('contratante', 'n', v)} />
        <Input label="Bairro" value={data.bairro} onChange={v => handleUpdate('contratante', 'bairro', v)} />
        <Input label="Cidade" value={data.cidade} onChange={v => handleUpdate('contratante', 'cidade', v)} />
        <Input label="UF" value={data.uf} onChange={v => handleUpdate('contratante', 'uf', v)} />
      </div>
    </section>
  );
}
