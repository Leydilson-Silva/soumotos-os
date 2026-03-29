import React from 'react';
import Input from './Input';
import { maskPhone } from '../lib/masks';
import type { AlunoData } from '../lib/types';

interface AlunoFormProps {
  data: AlunoData;
  handleUpdate: (section: 'aluno', field: string, value: string) => void;
}

export default function AlunoForm({ data, handleUpdate }: AlunoFormProps) {
  return (
    <section className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Aluno</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nome do Aluno" colSpan="col-span-2" value={data.nome} onChange={v => handleUpdate('aluno', 'nome', v)} />
        <Input label="Data Nasc." type="date" value={data.dataNasc} onChange={v => handleUpdate('aluno', 'dataNasc', v)} />
        <Input label="Telefone Fixo" value={data.telefone} onChange={v => handleUpdate('aluno', 'telefone', maskPhone(v))} />
        <Input label="WhatsApp" value={data.whatsapp} onChange={v => handleUpdate('aluno', 'whatsapp', maskPhone(v))} />
        <Input label="E-mail" value={data.email} onChange={v => handleUpdate('aluno', 'email', v)} />
        <Input label="Facebook" value={data.facebook} onChange={v => handleUpdate('aluno', 'facebook', v)} />
      </div>
    </section>
  );
}
