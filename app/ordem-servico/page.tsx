"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";

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

interface EvidenceItem {
  id: string;
  file: File;
  previewUrl: string;
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
  const emptyFormData = (): FormData => ({
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

  const loadStoredFormData = (): FormData => {
    if (typeof window === "undefined") {
      return emptyFormData();
    }

    try {
      const savedForm = localStorage.getItem("soumotos_form");
      if (savedForm) {
        return JSON.parse(savedForm) as FormData;
      }
    } catch {
      localStorage.removeItem("soumotos_form");
    }

    return emptyFormData();
  };

  const loadStoredChecklist = (): ChecklistState => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const savedCheck = localStorage.getItem("soumotos_check");
      if (savedCheck) {
        return JSON.parse(savedCheck) as ChecklistState;
      }
    } catch {
      localStorage.removeItem("soumotos_check");
    }

    return {};
  };

  const [formData, setFormData] = useState<FormData>(() => loadStoredFormData());
  const [checklist, setChecklist] = useState<ChecklistState>(() => loadStoredChecklist());
  const [copiado, setCopiado] = useState(false);
  const [evidencias, setEvidencias] = useState<EvidenceItem[]>([]);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem("soumotos_form", JSON.stringify(formData));
      localStorage.setItem("soumotos_check", JSON.stringify(checklist));
    } catch {
      // Persistência opcional; não bloqueia o uso do formulário.
    }
  }, [formData, checklist]);

  useEffect(() => {
    return () => {
      evidencias.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [evidencias]);

  useEffect(() => {
    return () => {
      if (previewPdfUrl) {
        URL.revokeObjectURL(previewPdfUrl);
      }
    };
  }, [previewPdfUrl]);

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
      evidencias.forEach((item) => URL.revokeObjectURL(item.previewUrl));
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
      setEvidencias([]);
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

  const gerarTermo = (comMarkdown: boolean = false) => {
    const b = comMarkdown ? "*" : "";
    const ul = comMarkdown ? "\n" : "";

    let termo = `\n${ul}${b}═══════════════════════════════════════${b}${ul}`;
    termo += `${ul}${b}TERMO DE CONSENTIMENTO, GUARDA E CONDIÇÕES DE SERVIÇO${b}${ul}`;
    termo += `${ul}${b}═══════════════════════════════════════${b}${ul}\n`;
    termo += `Para garantirmos total transparência e segurança na prestação dos nossos serviços, pedimos que leia atentamente as nossas condições de trabalho abaixo:\n`;

    termo += `${ul}${b}1️⃣ VALIDADE DO ORÇAMENTO${b}${ul}`;
    termo += `Todo orçamento emitido tem validade de 10 dias corridos (Art. 40, § 1º do CDC). Após esse prazo, os valores de peças e mão de obra podem sofrer alterações. O serviço só é iniciado após a sua aprovação.\n`;

    termo += `${ul}${b}2️⃣ CONDIÇÕES DE PAGAMENTO${b}${ul}`;
    termo += `O pagamento dos serviços aprovados segue o formato de ${b}50% de entrada${b} (sinal) para a aquisição imediata de peças, e os ${b}50% restantes${b} no ato da entrega da moto pronta. A liberação do veículo é vinculada à quitação do valor total.\n`;

    termo += `${ul}${b}3️⃣ RETIRADA E TAXA DE PÁTIO${b}${ul}`;
    termo += `Após avisarmos sobre a conclusão do serviço (ou emissão do orçamento sem aprovação), você tem ${b}5 dias úteis${b} para retirar a moto ${b}sem custos${b}. Passado esse prazo de tolerância, será cobrada uma taxa diária de pátio no valor de ${b}R$ 20,00/dia${b} de permanência, referente à guarda e ocupação de espaço físico.\n`;

    termo += `${ul}${b}4️⃣ ABANDONO DE VEÍCULO${b}${ul}`;
    termo += `Caso a moto permaneça na oficina por mais de ${b}90 dias (3 meses)${b} sem a sua manifestação, pagamento ou retirada, ela será configurada como ${b}BEM ABANDONADO${b} (Art. 1.275 do Código Civil e Lei nº 13.160/15).\n`;
    termo += `Neste caso, a ${b}SouMotos${b} fica autorizada a vender ou leiloar o veículo para cobrir exclusivamente os custos de peças, mão de obra e taxas de pátio acumuladas.\n`;

    termo += `${ul}${b}═══════════════════════════════════════${b}${ul}`;
    termo += `${ul}${b}Ao prosseguir, você concorda com todos os termos acima.${b}${ul}`;
    termo += `${b}Obrigado pela confiança na SouMotos! 🏍️${b}\n`;

    return termo;
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
    texto += gerarTermo(comMarkdown);

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

  const copiarTextoBasico = async () => {
    const texto = montarTextoFinal(true);
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Mantemos o fluxo mesmo se a cópia falhar em algum navegador.
    }
  };

  const abrirPickerCamera = () => {
    cameraInputRef.current?.click();
  };

  const abrirPickerPasta = () => {
    folderInputRef.current?.click();
  };

  const setFolderInputNode = (node: HTMLInputElement | null) => {
    folderInputRef.current = node;
    if (node) {
      node.setAttribute("webkitdirectory", "");
    }
  };

  const adicionarEvidencias = (files: FileList | File[] | null) => {
    if (!files) return;

    const imagens = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imagens.length === 0) {
      alert("Selecione apenas imagens para gerar o PDF de evidências.");
      return;
    }

    const novas = imagens.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setEvidencias((prev) => [...prev, ...novas]);
  };

  const removerEvidencia = (id: string) => {
    setEvidencias((prev) => {
      const alvo = prev.find((item) => item.id === id);
      if (alvo) {
        URL.revokeObjectURL(alvo.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const fileToDataUrl = async (file: File) => {
    try {
      const bitmap = await createImageBitmap(file);
      const maxSide = 1800;
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas indisponível");
      }
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      return canvas.toDataURL("image/jpeg", 0.84);
    } catch {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Falha ao ler imagem"));
          }
        };
        reader.onerror = () => reject(new Error("Falha ao ler imagem"));
        reader.readAsDataURL(file);
      });
    }
  };

  const getImageDimensions = (dataUrl: string) =>
    new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      };
      image.onerror = () => reject(new Error("Falha ao carregar imagem"));
      image.src = dataUrl;
    });

  const escapePdfText = (value: string) =>
    value
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);

  const sanitizarNomeArquivo = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

  const gerarPdfEvidencias = React.useCallback(async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const maxWidth = pageWidth - margin * 2;
    const maxImageHeight = pageHeight - 58;
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const horaAtual = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("SOUMOTOS", pageWidth / 2, 18, { align: "center" });
    doc.setFontSize(12);
    doc.text("PDF DE EVIDÊNCIAS - ORDEM DE SERVIÇO", pageWidth / 2, 25, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    let y = 34;
    const drawLine = (label: string, value: string) => {
      const wrapped = doc.splitTextToSize(`${label}: ${value || "-"}`, maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 4.2;
    };

    drawLine("Cliente", formData.cliente);
    drawLine("Modelo", formData.modelo);
    drawLine("Placa", formData.placa.toUpperCase());
    drawLine("Mecânico", formData.mecanico);
    drawLine("Data", `${dataAtual} às ${horaAtual}`);
    y += 2;

    doc.setFont("helvetica", "bold");
    doc.text("Checklist com avarias marcadas", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    checklistItems.forEach((item) => {
      const itemData = checklist[item];
      if (itemData?.marked) {
        const texto = `- ${item}${itemData.obs ? `: ${itemData.obs}` : ""}`;
        const lines = doc.splitTextToSize(texto, maxWidth);
        doc.text(lines, margin, y);
        y += lines.length * 4.2;
      }
    });

    if (y > pageHeight - 30) {
      doc.addPage();
      y = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Fotos anexadas", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    if (evidencias.length === 0) {
      doc.text("Nenhuma foto anexada.", margin, y);
    }

    for (let i = 0; i < evidencias.length; i += 1) {
      const item = evidencias[i];
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${escapePdfText(item.file.name)}`, margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");

      const imageDataUrl = await fileToDataUrl(item.file);
      const imgProps = await getImageDimensions(imageDataUrl);
      const ratio = imgProps.width / imgProps.height;
      let imageWidth = maxWidth;
      let imageHeight = imageWidth / ratio;

      if (imageHeight > maxImageHeight) {
        imageHeight = maxImageHeight;
        imageWidth = imageHeight * ratio;
      }

      const x = (pageWidth - imageWidth) / 2;
      const imageY = y;
      const imageFormat = imageDataUrl.startsWith("data:image/png")
        ? "PNG"
        : "JPEG";
      doc.addImage(
        imageDataUrl,
        imageFormat,
        x,
        imageY,
        imageWidth,
        imageHeight,
      );
      y = imageY + imageHeight + 4;
      if (y > pageHeight - 10) {
        doc.addPage();
        y = 18;
      }
      doc.setFontSize(8);
      doc.text(`Arquivo ${i + 1} de ${evidencias.length}`, margin, y);
      y += 4;
    }

    return doc.output("blob");
  }, [formData, checklist, evidencias]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const clearCurrentPreview = () => {
      setPreviewPdfUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return "";
      });
    };

    if (evidencias.length === 0) {
      clearCurrentPreview();
      timeoutId = setTimeout(() => {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }, 0);
      return () => {
        cancelled = true;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }

    timeoutId = setTimeout(() => {
      if (!cancelled) {
        setPreviewLoading(true);
      }
    }, 0);
    const generationDelay = setTimeout(async () => {
      try {
        const blob = await gerarPdfEvidencias();
        if (cancelled) return;

        const nextUrl = URL.createObjectURL(blob);
        setPreviewPdfUrl((currentUrl) => {
          if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
          }
          return nextUrl;
        });
      } catch {
        if (!cancelled) {
          clearCurrentPreview();
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    }, 700);

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      clearTimeout(generationDelay);
    };
  }, [gerarPdfEvidencias, evidencias.length]);

  const gerarNomeArquivo = async () => {
    const partesNome = [formData.cliente, formData.modelo, formData.cor]
      .map(sanitizarNomeArquivo)
      .filter(Boolean);
    const sufixoNome = partesNome.length > 0 ? partesNome.join("-") : "sem-dados";
    return `evidencias-${sufixoNome}.pdf`;
  };

  const baixarPdfEvidencias = async () => {
    if (evidencias.length === 0) {
      alert("Adicione fotos da câmera ou da pasta para gerar o PDF de evidências.");
      return;
    }

    try {
      const blob = await gerarPdfEvidencias();
      const fileName = await gerarNomeArquivo();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch {
      alert("Não foi possível gerar o PDF de evidências.");
    }
  };

  const enviarWhatsApp = async () => {
    if (evidencias.length === 0) {
      alert("Adicione fotos da câmera ou da pasta para gerar o PDF de evidências.");
      return;
    }

    try {
      await copiarTextoBasico();
      const blob = await gerarPdfEvidencias();
      const fileName = await gerarNomeArquivo();
      const arquivo = new File([blob], fileName, { type: "application/pdf" });
      const mensagem = montarTextoFinal(true);

      if (navigator.canShare?.({ files: [arquivo] }) && navigator.share) {
        await navigator.share({
          title: "Evidências da ordem de serviço",
          text: mensagem,
          files: [arquivo],
        });
        return;
      }

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${mensagem}\n\nO PDF de evidências foi baixado para anexar manualmente.`,
        )}`,
        "_blank",
      );
    } catch {
      alert("Não foi possível gerar o PDF de evidências.");
    }
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

            {/* Evidências */}
            <section className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-black text-sm mb-1 border-l-4 border-slate-800 pl-2 text-slate-700 uppercase italic">
                    📎 Evidências em PDF
                  </h2>
                  <p className="text-xs text-slate-500 pl-3">
                    Use a câmera do celular ou selecione uma pasta com fotos para montar o PDF.
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-200 text-slate-700 whitespace-nowrap">
                  {evidencias.length} foto(s)
                </span>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  adicionarEvidencias(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  adicionarEvidencias(e.target.files);
                  e.currentTarget.value = "";
                }}
                ref={setFolderInputNode}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={abrirPickerCamera}
                  className="py-3 rounded-xl font-bold text-sm bg-slate-800 text-white hover:bg-slate-900 transition-colors"
                >
                  Tirar foto na câmera
                </button>
                <button
                  type="button"
                  onClick={abrirPickerPasta}
                  className="py-3 rounded-xl font-bold text-sm bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  Selecionar pasta de fotos
                </button>
              </div>

              {evidencias.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {evidencias.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
                    >
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="w-full h-28 object-cover"
                      />
                      <div className="p-2 space-y-2">
                        <p className="text-[10px] font-semibold text-slate-600 truncate">
                          {item.file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removerEvidencia(item.id)}
                          className="w-full py-2 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-black text-sm border-l-4 border-green-600 pl-2 text-gray-700 uppercase italic">
                  👁 Preview do PDF
                </h2>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {previewLoading ? "Atualizando..." : "Prévia ativa"}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                A prévia reflete as fotos anexadas e os dados atuais do formulário.
              </p>
              {previewPdfUrl ? (
                <iframe
                  key={previewPdfUrl}
                  src={previewPdfUrl}
                  title="Preview do PDF de evidências"
                  className="w-full h-[520px] rounded-xl border border-gray-200 bg-gray-50"
                />
              ) : (
                <div className="w-full h-[240px] rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-500 text-center px-6">
                  Adicione fotos para gerar a prévia do PDF de evidências.
                </div>
              )}
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
              onClick={() => void baixarPdfEvidencias()}
              className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              BAIXAR PDF DE EVIDÊNCIAS
            </button>
            <button
              onClick={() => void enviarWhatsApp()}
              className="w-full py-5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              ENVIAR COM PDF NO WHATSAPP
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
