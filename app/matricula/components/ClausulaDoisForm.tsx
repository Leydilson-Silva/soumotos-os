import React from 'react';
import Input from "./Input";
import { FinanceiroData } from "../lib/types";

interface ClausulaDoisProps {
  data: FinanceiroData;
  onChange: (field: keyof FinanceiroData, value: string | number) => void;
}

export default function ClausulaDoisForm({ data, onChange }: ClausulaDoisProps) {
  return (
    <section className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
      <h3 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">
        Cláusula 2º - DOS PREÇOS
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Input label="Matrícula (R$)" value={String(data.matricula)} onChange={(v) => onChange('matricula', Number(v) || 0)} />
        <Input label="Valor por Módulo (R$)" value={String(data.valorModulo)} onChange={(v) => onChange('valorModulo', Number(v) || 0)} />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black text-zinc-400 uppercase">Forma de Pagamento</label>
        <div className="flex flex-wrap gap-3">
          {['a_vista', 'cartao', 'boleto'].map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => onChange('formaPagamento', tipo)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                data.formaPagamento === tipo ? 'bg-blue-600 text-white' : 'bg-white border text-zinc-500'
              }`}
            >
              {tipo === 'a_vista' ? 'A Vista' : tipo === 'cartao' ? 'Cartão de Crédito' : 'Boleto'}
            </button>
          ))}
        </div>
      </div>

      <Input label="Observação" value={data.observacao} onChange={(v) => onChange('observacao', v)} colSpan="w-full" />
    </section>
  );
}