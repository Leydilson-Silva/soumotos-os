"use client";

import React from 'react';
import Input from "./Input";
import { FormData, ModuloInfo } from "../lib/types";

interface ClausulaUmProps {
  modulos: FormData['modulos'];
  periodoCurso: string;
  handleModuloUpdate: (mod: string, field: keyof ModuloInfo, value: string | boolean) => void;
  setPeriodo: (v: string) => void;
}

export default function ClausulaUmForm({ modulos, periodoCurso, handleModuloUpdate, setPeriodo }: ClausulaUmProps) {
  const modulosDesc = [
    { id: 'm1', label: "1º Módulo Manutenção de motos" },
    { id: 'm2', label: "2º Módulo de motores de motos" },
    { id: 'm3', label: "3º Modulo de elétrica de motos" },
    { id: 'm4', label: "4º Módulo de injeção eletrônica" }
  ];

  return (
    <section className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-6">
      <div className="border-b border-zinc-200 pb-2">
        <h3 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">
          Cláusula 1º - DOS CURSOS
        </h3>
      </div>

      <div className="space-y-4">
        {modulosDesc.map((m) => (
          <div key={m.id} className="p-3 bg-white border border-zinc-100 rounded-lg shadow-sm space-y-3">
            <div className="flex items-center gap-3">
               <input 
                type="checkbox" 
                checked={modulos?.[m.id as keyof typeof modulos]?.sel || false}
                onChange={(e) => handleModuloUpdate(m.id, 'sel', e.target.checked)}
                className="w-4 h-4 accent-blue-900 cursor-pointer"
              />
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-tighter italic">
                {m.label}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Input 
                label="Das" 
                value={modulos?.[m.id as keyof typeof modulos]?.das || ''} 
                onChange={(v) => handleModuloUpdate(m.id, 'das', v)} 
              />
              <Input 
                label="Às" 
                value={modulos?.[m.id as keyof typeof modulos]?.as || ''} 
                onChange={(v) => handleModuloUpdate(m.id, 'as', v)} 
              />
              <Input 
                label="Dia(s) / Obs" 
                value={modulos?.[m.id as keyof typeof modulos]?.dias || ''} 
                onChange={(v) => handleModuloUpdate(m.id, 'dias', v)} 
              />
            </div>
          </div>
        ))}

        <div className="pt-2">
          <Input 
            label="PERÍODO DO CURSO SERÁ DE:" 
            value={periodoCurso} 
            onChange={setPeriodo} 
            colSpan="w-full"
          />
        </div>
      </div>
    </section>
  );
}