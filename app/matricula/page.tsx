"use client";

import React, { useState } from "react";
import Link from "next/link";
import ContratanteForm from "./components/ContratanteForm";
import AlunoForm from "./components/AlunoForm";
import ClausulaUmForm from "./components/ClausulaUmForm";
import ClausulaDoisForm from "./components/ClausulaDoisForm";
import Input from "./components/Input";
import { generateContractPDF } from "./lib/pdf-builder";
import type { FormData } from "./lib/types";

export default function MatriculaPage() {
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    matriculaNum: "",
    contratante: {
      nome: "",
      pai: "",
      mae: "",
      rg: "",
      cpf: "",
      fone: "",
      celular: "",
      endereco: "",
      n: "",
      bairro: "",
      cidade: "Ceará Mirim",
      uf: "RN",
    },
    aluno: {
      nome: "",
      dataNasc: "",
      telefone: "",
      whatsapp: "",
      email: "",
      facebook: "",
    },
    modulos: {
      m1: { sel: false, das: "", as: "", dias: "" },
      m2: { sel: false, das: "", as: "", dias: "" },
      m3: { sel: false, das: "", as: "", dias: "" },
      m4: { sel: false, das: "", as: "", dias: "" },
    },
    periodoCurso: "",
    previsaoInicio: "",
    financeiro: {
      matricula: 50,
      valorModulo: 250,
      formaPagamento: "a_vista",
      observacao: "",
    },
  });

  const handleUpdate = (
    section: "contratante" | "aluno",
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleModuloUpdate = (mod: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      modulos: {
        ...prev.modulos,
        [mod]: {
          ...prev.modulos[mod as keyof typeof prev.modulos],
          [field]: value,
        },
      },
    }));
  };


  return (
    <div className="flex h-screen bg-zinc-100 overflow-hidden">
      <aside className="w-full md:w-1/2 p-6 overflow-y-auto bg-white shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-blue-900 uppercase italic">
            Matrícula SOUMOTOS
          </h1>
          <Link href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>
        </div>

        <div className="space-y-6">
          <ContratanteForm
            data={formData.contratante}
            matriculaNum={formData.matriculaNum}
            handleUpdate={handleUpdate}
            setMatriculaNum={(v) =>
              setFormData((prev) => ({ ...prev, matriculaNum: v }))
            }
          />
          <AlunoForm data={formData.aluno} handleUpdate={handleUpdate} />

          <ClausulaUmForm
            modulos={formData.modulos}
            periodoCurso={formData.periodoCurso}
            handleModuloUpdate={handleModuloUpdate}
            setPeriodo={(v) =>
              setFormData((prev) => ({ ...prev, periodoCurso: v }))
            }
          />

          <ClausulaDoisForm
            data={formData.financeiro}
            onChange={(field, value) =>
              setFormData((prev) => ({
                ...prev,
                financeiro: { ...prev.financeiro, [field]: value },
              }))
            }
          />

          <Input
            label="Previsão de Início do Curso"
            type="date" // Ativa o seletor de data
            value={formData.previsaoInicio}
            onChange={(v) => setFormData(prev => ({ ...prev, previsaoInicio: v }))}
          />

          <div className="flex gap-4 sticky bottom-0 bg-white py-4 border-t">
            <button
              onClick={() => setPdfPreview(generateContractPDF(formData).output("bloburl"))}
              className="flex-1 bg-zinc-800 text-white py-4 rounded-xl font-bold uppercase text-xs hover:bg-black transition-all"
            >
              Preview
            </button>
            <button
              onClick={() =>
                generateContractPDF(formData).save(
                  `Contrato_${formData.aluno.nome || "Aluno"}.pdf`,
                )
              }
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold uppercase text-xs hover:bg-blue-700 transition-all"
            >
              Baixar PDF
            </button>
          </div>
        </div>
      </aside>

      {/* PREVIEW */}
      <section className="hidden md:flex flex-1 bg-zinc-200 p-6 items-center justify-center">
        {pdfPreview ? (
          <iframe
            src={pdfPreview}
            className="w-full h-full rounded-lg shadow-2xl border-8 border-white bg-white"
            title="Preview"
          />
        ) : (
          <div className="text-zinc-400 font-bold uppercase text-xs animate-pulse">
            Aguardando dados...
          </div>
        )}
      </section>
    </div>
  );
}
