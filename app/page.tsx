"use client";

import React, { useState, useEffect } from 'react';

interface ChecklistItem {
  marked: boolean;
  obs: string;
}

interface ChecklistState {
  [key: string]: ChecklistItem | null;
}

interface FormData {
  modelo: string;
  placa: string;
  cor: string;
  km: string;
  mecanico: string;
  servicosSolicitados: string;
  obsGerais: string;
  servicosExecutados: string;
  parecer: string;
  pecas: string;
}

const checklistItems = [
  "Pintura arranhada", "Amassado em carenagem", "Pneu dianteiro gasto / cortado",
  "Pneu traseiro gasto / cortado", "Roda empenada", "Retrovisores danificados",
  "Guidão desalinhado", "Vazamento de óleo", "Escapamento danificado",
  "Banco rasgado", "Farol quebrado / queimado", "Lanterna traseira com defeito",
  "Bateria fraca", "Chave reserva entregue", "Documentação entregue"
];

export default function SOUMotosForm() {
  const [formData, setFormData] = useState<FormData>({
    modelo: '', placa: '', cor: '', km: '', mecanico: '',
    servicosSolicitados: '', obsGerais: '', servicosExecutados: '',
    parecer: '', pecas: ''
  });

  const [checklist, setChecklist] = useState<ChecklistState>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const savedForm = localStorage.getItem('soumotos_form');
    const savedCheck = localStorage.getItem('soumotos_check');
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedCheck) setChecklist(JSON.parse(savedCheck));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('soumotos_form', JSON.stringify(formData));
      localStorage.setItem('soumotos_check', JSON.stringify(checklist));
    }
  }, [formData, checklist, isLoaded]);

  const handleCheckChange = (item: string) => {
    setChecklist((prev) => ({
      ...prev,
      [item]: prev[item]?.marked ? null : { marked: true, obs: '' }
    }));
  };

  const handleCheckObs = (item: string, val: string) => {
    setChecklist((prev) => ({
      ...prev,
      [item]: { marked: true, obs: val }
    }));
  };

  const limparFormulario = () => {
    if (confirm("Deseja limpar todos os campos da oficina?")) {
      setFormData({
        modelo: '', placa: '', cor: '', km: '', mecanico: '',
        servicosSolicitados: '', obsGerais: '', servicosExecutados: '',
        parecer: '', pecas: ''
      });
      setChecklist({});
      localStorage.removeItem('soumotos_form');
      localStorage.removeItem('soumotos_check');
    }
  };

  const montarTextoFinal = (comMarkdown: boolean = false) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const b = comMarkdown ? "*" : "";

    let texto = `${b}ORDEM DE SERVIÇO${b}\n\n`;
    texto += `✅ ${b}CHECKLIST DE ENTRADA DE MOTOCICLETA – SOUMOTOS${b}\n\n`;
    texto += `${b}DADOS DA MOTOCICLETA:${b}\n`;
    texto += `Modelo/Montadora: ${formData.modelo}\n`;
    texto += `Placa: ${formData.placa.toUpperCase()}\n`;
    texto += `Cor: ${formData.cor}\n`;
    texto += `Quilometragem: ${formData.km} km\n`;
    texto += `Data de entrada: ${dataAtual}\n`;
    texto += `Horário: ${horaAtual}\n\n`;
    texto += `Mecânico Responsável: ${formData.mecanico}\n\n`;
    
    texto += `🔍 ${b}INSPEÇÃO VISUAL EXTERNA${b}\n\n`;
    texto += `(Marcar com “X” os itens com avarias)\n`;
    checklistItems.forEach(item => {
      const itemData = checklist[item];
      const x = itemData?.marked ? "X" : " ";
      const obs = itemData?.obs ? ` - ${itemData.obs}` : "";
      texto += `[ ${x} ] ${item}${obs}\n`;
    });
    
    texto += `\n${b}SERVIÇOS SOLICITADOS PELO CLIENTE${b}\n${formData.servicosSolicitados || '-'}\n`;
    texto += `\n${b}OBSERVAÇÕES GERAIS DA OFICINA${b}\n${formData.obsGerais || '-'}\n`;
    texto += `\n${b}SERVIÇOS${b}\n${formData.servicosExecutados || '-'}\n`;
    texto += `\n${b}PARECER:${b}\n${formData.parecer || '-'}\n`;
    texto += `\n${b}PEÇAS E LUBRIFICANTES:${b}\n${formData.pecas || '-'}\n`;
    return texto;
  };

  const copiarTexto = async () => {
    const texto = montarTextoFinal(false);
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) { alert("Erro ao copiar."); }
  };

  const compartilharWhatsApp = () => {
    const texto = montarTextoFinal(true);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold">Carregando SOUMOTOS...</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-2 md:p-6 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
        <header className="bg-zinc-900 p-6 text-white flex justify-between items-center">
          <h1 className="text-2xl font-black text-yellow-400 italic leading-none">SOUMOTOS</h1>
          <button onClick={limparFormulario} className="text-[10px] bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-2 rounded-lg font-bold uppercase transition-colors">Limpar</button>
        </header>

        <main className="p-4 md:p-8 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Modelo / Montadora", key: "modelo" },
              { label: "Placa", key: "placa", extra: "uppercase font-mono" },
              { label: "Cor", key: "cor" },
              { label: "Quilometragem (KM)", key: "km", type: "number" },
              { label: "Mecânico Responsável", key: "mecanico", extra: "bg-yellow-50 font-bold col-span-1 md:col-span-2" }
            ].map((field) => (
              <div key={field.key} className={`flex flex-col gap-1 ${field.key === 'mecanico' ? 'md:col-span-2' : ''}`}>
                <label className="text-[10px] font-black text-slate-500 ml-1 uppercase">{field.label}</label>
                <input 
                  type={field.type || "text"}
                  value={(formData as any)[field.key]} 
                  className={`p-3 border border-slate-200 rounded-xl outline-none focus:border-yellow-400 transition-all ${field.extra || "bg-slate-50"}`}
                  onChange={e => setFormData({...formData, [field.key]: e.target.value})} 
                />
              </div>
            ))}
          </section>

          <section className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h2 className="font-black text-sm mb-4 border-l-4 border-yellow-400 pl-2 text-zinc-700 uppercase italic">🔍 Inspeção Visual Externa</h2>
            <div className="grid grid-cols-1 gap-2">
              {checklistItems.map(item => (
                <div key={item} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-yellow-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={checklist[item]?.marked || false} className="w-6 h-6 rounded-md border-slate-300 text-yellow-500" onChange={() => handleCheckChange(item)} />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </label>
                  {checklist[item]?.marked && (
                    <div className="mt-2 flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-yellow-600 ml-1 uppercase">Detalhes da avaria em {item}</label>
                      <input value={checklist[item]?.obs || ''} placeholder="Ex: Risco profundo..." className="w-full text-xs p-2 bg-yellow-50 border border-yellow-100 rounded-md outline-none italic" onChange={e => handleCheckObs(item, e.target.value)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
             {[
               { label: "Serviços Solicitados pelo Cliente", key: "servicosSolicitados", color: "text-blue-600" },
               { label: "Observações Gerais da Oficina", key: "obsGerais", color: "text-slate-500" },
               { label: "Serviços (Executados)", key: "servicosExecutados", color: "text-green-600", bg: "bg-green-50/30" },
               { label: "Parecer Técnico", key: "parecer", color: "text-zinc-700" },
               { label: "Peças e Lubrificantes", key: "pecas", color: "text-zinc-700" }
             ].map((area) => (
               <div key={area.key} className="flex flex-col gap-1">
                  <label className={`text-[10px] font-black ml-1 uppercase ${area.color}`}>{area.label}</label>
                  <textarea 
                    value={(formData as any)[area.key]} 
                    className={`w-full p-4 border border-slate-200 rounded-2xl min-h-[100px] outline-none focus:border-slate-400 transition-all ${area.bg || "bg-slate-50"}`}
                    onChange={e => setFormData({...formData, [area.key]: e.target.value})} 
                  />
               </div>
             ))}
          </section>
        </main>

        <footer className="p-4 md:p-6 sticky bottom-0 bg-white/90 backdrop-blur-md border-t flex flex-col gap-3">
          <button onClick={copiarTexto} className={`w-full py-4 rounded-xl font-bold text-xs transition-all ${copiado ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {copiado ? '✓ COPIADO PARA O SISTEMA' : 'COPIAR PARA CONTROLE INTERNO'}
          </button>
          <button onClick={compartilharWhatsApp} className="w-full py-5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
             ENVIAR PARA O GRUPO DA OFICINA
          </button>
        </footer>
      </div>
    </div>
  );
}