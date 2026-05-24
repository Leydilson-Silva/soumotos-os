"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ChecklistItem {
  marked: boolean;
  obs: string;
}

interface ChecklistState {
  [key: string]: ChecklistItem | null;
}

interface FormData {
  cliente: string;
  modelo: string;
  placa: string;
  cor: string;
  km: string;
  ano: string;
  chassi: string;
  cilindrada: string;
  combustivel: string;
  mecanico: string;
  servicosSolicitados: string;
  obsGerais: string;
  servicosExecutados: string;
  parecer: string;
  pecas: string;
}

const checklistItems = [
  "Pintura arranhada",
  "Amassado em carenagem",
  "Pneu dianteiro gasto / cortado",
  "Pneu traseiro gasto / cortado",
  "Roda empenada",
  "Retrovisores danificados",
  "Guidão desalinhado",
  "Vazamento de óleo",
  "Escapamento danificado",
  "Banco rasgado",
  "Farol quebrado / queimado",
  "Lanterna traseira com defeito",
  "Bateria fraca",
  "Chave reserva entregue",
  "Documentação entregue",
];

export default function SOUMotosForm() {
  const [formData, setFormData] = useState<FormData>({
    cliente: "",
    modelo: "",
    placa: "",
    cor: "",
    km: "",
    ano: "",
    chassi: "",
    cilindrada: "",
    combustivel: "",
    mecanico: "",
    servicosSolicitados: "",
    obsGerais: "",
    servicosExecutados: "",
    parecer: "",
    pecas: "",
  });

  const [checklist, setChecklist] = useState<ChecklistState>({});
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const savedForm = localStorage.getItem("soumotos_form");
    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }
    const savedCheck = localStorage.getItem("soumotos_check");
    if (savedCheck) {
      setChecklist(JSON.parse(savedCheck));
    }
  }, []);

  const isInitialMount = React.useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      localStorage.setItem("soumotos_form", JSON.stringify(formData));
      localStorage.setItem("soumotos_check", JSON.stringify(checklist));
    }
  }, [formData, checklist]);

  const handleCheckChange = (item: string) => {
    setChecklist((prev) => ({
      ...prev,
      [item]: prev[item]?.marked ? null : { marked: true, obs: "" },
    }));
  };

  const handleCheckObs = (item: string, val: string) => {
    setChecklist((prev) => ({
      ...prev,
      [item]: { marked: true, obs: val },
    }));
  };

  const limparFormulario = () => {
    if (confirm("Deseja limpar todos os campos da oficina?")) {
      setFormData({
        cliente: "",
        modelo: "",
        placa: "",
        cor: "",
        km: "",
        ano: "",
        chassi: "",
        cilindrada: "",
        combustivel: "",
        mecanico: "",
        servicosSolicitados: "",
        obsGerais: "",
        servicosExecutados: "",
        parecer: "",
        pecas: "",
      });
      setChecklist({});
      localStorage.removeItem("soumotos_form");
      localStorage.removeItem("soumotos_check");
    }
  };

  const formatarComBullets = (texto: string) => {
    if (texto.trim() === "") {
      return "• \n• \n• \n• ";
    }
    return texto
      .split("\n")
      .map((line) => (line.trim() ? `• ${line}` : "• "))
      .join("\n");
  };

  const montarTextoFinal = (comMarkdown: boolean = false) => {
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const horaAtual = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const b = comMarkdown ? "*" : "";

    let texto = `${b}ORDEM DE SERVIÇO${b}\n\n`;
    texto += `✅ ${b}CHECKLIST DE ENTRADA DE MOTOCICLETA – SOUMOTOS${b}\n\n`;
    texto += `Cliente: ${formData.cliente || "-"}\n\n`;
    texto += `${b}DADOS DA MOTOCICLETA:${b}\n`;
    texto += `Modelo/Montadora: ${formData.modelo}\n`;
    texto += `Cilindrada: ${formData.cilindrada ? `${formData.cilindrada} cc` : "-"}\n`;
    texto += `Placa: ${formData.placa.toUpperCase()}\n`;
    texto += `Cor: ${formData.cor}\n`;
    texto += `Ano: ${formData.ano || "-"}\n`;
    texto += `Chassi: ${formData.chassi.toUpperCase() || "-"}\n`;
    texto += `Quilometragem: ${formData.km} km\n`;
    texto += `Nível de Combustível: ${formData.combustivel || "-"}\n`;
    texto += `Data de entrada: ${dataAtual}\n`;
    texto += `Horário: ${horaAtual}\n\n`;
    texto += `Mecânico Responsável: ${formData.mecanico}\n\n`;

    texto += `🔍 ${b}INSPEÇÃO VISUAL EXTERNA${b}\n\n`;
    texto += `(Marcar com “X” os itens com avarias)\n`;
    checklistItems.forEach((item) => {
      const itemData = checklist[item];
      const x = itemData?.marked ? "X" : " ";
      const obs = itemData?.obs ? ` - ${itemData.obs}` : "";
      texto += `[ ${x} ] ${item}${obs}\n`;
    });

    texto += `\n${b}SERVIÇOS SOLICITADOS PELO CLIENTE${b}\n${formatarComBullets(formData.servicosSolicitados)}\n`;
    texto += `\n${b}OBSERVAÇÕES GERAIS DA OFICINA${b}\n${formatarComBullets(formData.obsGerais)}\n`;
    texto += `\n${b}SERVIÇOS EXECUTADOS${b}\n${formatarComBullets(formData.servicosExecutados)}\n`;
    texto += `\n${b}PARECER TÉCNICO:${b}\n${formatarComBullets(formData.parecer)}\n`;
    texto += `\n${b}PEÇAS E LUBRIFICANTES:${b}\n${formatarComBullets(formData.pecas)}\n`;
    
    return texto;
  };

  const copiarTexto = async () => {
    const texto = montarTextoFinal(false);
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      alert("Erro ao copiar.");
    }
  };

  const compartilharWhatsApp = () => {
    const texto = montarTextoFinal(true);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-6 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
          <header className="bg-gray-800 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black text-white italic leading-none">
                SOUMOTOS - O.S.
              </h1>
              <button
                onClick={limparFormulario}
                className="text-[10px] bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-2 rounded-lg font-bold uppercase transition-colors"
              >
                Limpar
              </button>
            </div>

            <Link
              href="/"
              className="text-sm font-semibold text-white hover:text-gray-300 flex items-center gap-1 justify-end"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar
            </Link>
          </header>

          <main className="p-4 md:p-8 space-y-8">
            {/* Seção de Dados Gerais */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={formData.cliente}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50"
                  onChange={(e) =>
                    setFormData({ ...formData, cliente: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Modelo / Montadora
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50"
                  onChange={(e) =>
                    setFormData({ ...formData, modelo: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Cilindrada (cc)
                </label>
                <input
                  type="number"
                  value={formData.cilindrada}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50"
                  onChange={(e) =>
                    setFormData({ ...formData, cilindrada: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Placa
                </label>
                <input
                  type="text"
                  value={formData.placa}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50 uppercase font-mono"
                  onChange={(e) =>
                    setFormData({ ...formData, placa: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Cor
                </label>
                <input
                  type="text"
                  value={formData.cor}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50"
                  onChange={(e) =>
                    setFormData({ ...formData, cor: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Ano (Fab / Mod)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2022/2023"
                  value={formData.ano}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50"
                  onChange={(e) =>
                    setFormData({ ...formData, ano: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Nível de Combustível
                </label>
                <select
                  value={formData.combustivel}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50 text-sm h-[50px]"
                  onChange={(e) =>
                    setFormData({ ...formData, combustivel: e.target.value })
                  }
                >
                  <option value="">Selecione...</option>
                  <option value="Reserva">Reserva</option>
                  <option value="1/4">1/4</option>
                  <option value="1/2">1/2 (Meio Tanque)</option>
                  <option value="3/4">3/4</option>
                  <option value="Cheio">Cheio</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Quilometragem (KM)
                </label>
                <input
                  type="number"
                  value={formData.km}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50"
                  onChange={(e) =>
                    setFormData({ ...formData, km: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-500 ml-1 uppercase">
                  Número do Chassi
                </label>
                <input
                  type="text"
                  value={formData.chassi}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-gray-50 uppercase font-mono"
                  onChange={(e) =>
                    setFormData({ ...formData, chassi: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[10px] font-black text-blue-700 ml-1 uppercase">
                  Mecânico Responsável
                </label>
                <input
                  type="text"
                  value={formData.mecanico}
                  className="p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all bg-blue-50 font-bold"
                  onChange={(e) =>
                    setFormData({ ...formData, mecanico: e.target.value })
                  }
                />
              </div>
            </section>

            {/* Checklist Visual */}
            <section className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <h2 className="font-black text-sm mb-4 border-l-4 border-blue-500 pl-2 text-gray-700 uppercase italic">
                🔍 Inspeção Visual Externa
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {checklistItems.map((item) => (
                  <div
                    key={item}
                    className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-blue-200"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist[item]?.marked || false}
                        className="w-6 h-6 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={() => handleCheckChange(item)}
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {item}
                      </span>
                    </label>
                    {checklist[item]?.marked && (
                      <div className="mt-2 flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-blue-700 ml-1 uppercase">
                          Detalhes da avaria em {item}
                        </label>
                        <input
                          value={checklist[item]?.obs || ""}
                          placeholder="Ex: Risco profundo..."
                          className="w-full text-xs p-2 bg-blue-50 border border-blue-100 rounded-md outline-none italic"
                          onChange={(e) => handleCheckObs(item, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Caixas de Texto */}
            <section className="space-y-6">
              {[
                {
                  label: "Serviços Solicitados pelo Cliente",
                  key: "servicosSolicitados" as const,
                  color: "text-blue-600",
                },
                {
                  label: "Observações Gerais da Oficina",
                  key: "obsGerais" as const,
                  color: "text-gray-500",
                },
                {
                  label: "Serviços (Executados)",
                  key: "servicosExecutados" as const,
                  color: "text-green-600",
                  bg: "bg-green-50/30",
                },
                {
                  label: "Parecer Técnico",
                  key: "parecer" as const,
                  color: "text-gray-700",
                },
                {
                  label: "Peças e Lubrificantes",
                  key: "pecas" as const,
                  color: "text-gray-700",
                },
              ].map((area) => (
                <div key={area.key} className="flex flex-col gap-1">
                  <label
                    className={`text-[10px] font-black ml-1 uppercase ${area.color}`}
                  >
                    {area.label}
                  </label>
                  <textarea
                    value={formData[area.key]}
                    // Mudamos min-h-25 para min-h-[120px] e adicionamos resize-y
                    className={`w-full p-4 border border-gray-200 rounded-2xl min-h-[120px] resize-y outline-none focus:border-gray-400 transition-all ${area.bg || "bg-gray-50"}`}
                    onChange={(e) =>
                      setFormData({ ...formData, [area.key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </section>
          </main>

          <footer className="p-4 md:p-6 sticky bottom-0 bg-white/90 backdrop-blur-md border-t flex flex-col gap-3">
            <button
              onClick={copiarTexto}
              className={`w-full py-4 rounded-xl font-bold text-xs transition-all ${copiado ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              {copiado
                ? "✓ COPIADO PARA O SISTEMA"
                : "COPIAR PARA CONTROLE INTERNO"}
            </button>
            <button
              onClick={compartilharWhatsApp}
              className="w-full py-5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              ENVIAR PARA O GRUPO DA OFICINA
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}