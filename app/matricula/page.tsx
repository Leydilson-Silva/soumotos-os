"use client";

import React, { useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import ContratanteForm from "./components/ContratanteForm";
import AlunoForm from "./components/AlunoForm";
import ClausulaUmForm from "./components/ClausulaUmForm";
import ClausulaDoisForm from "./components/ClausulaDoisForm";
import Input from "./components/Input";
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
      matricula: "50,00",
      valorModulo: "250,00",
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

  const generateDoc = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 15;

    const setBold = () => doc.setFont("helvetica", "bold");
    const setNormal = () => doc.setFont("helvetica", "normal");

    // Cabeçalho
    try {
      doc.addImage("/imgcontrato1.png", "PNG", margin, y - 5, 38, 18);
      doc.addImage(
        "/imgcontrato2.png",
        "PNG",
        pageWidth - margin - 35,
        y - 8,
        35,
        22,
      );
    } catch (e) {
      console.warn("Imagens não encontradas");
    }

    setBold();
    doc.setFontSize(11);
    doc.text("SOUMOTOS ESPECIALIZADA", 105, y, { align: "center" });
    y += 4;
    doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", 105, y, { align: "center" });
    y += 4;
    doc.text(`MATRICULA Nº ${formData.matriculaNum || "________"}`, 105, y, {
      align: "center",
    });
    y += 10;

    // Introdução
    setNormal();
    doc.setFontSize(8.5);
    const intro =
      "Pelo presente contrato de prestação de serviços, que entre si, de um lado SOUMOTOS, pessoa jurídica de direito privado, inscrito no CNPJ 22.432.295/0001-08, com sede na cidade de Ceará Mirim/ RN, situado na Av Boaventura de Sá – N° 528– Planalto, telefone (84) 99430-3792 doravante denominada simplesmente CONTRATO e de outro lado.";
    const introLines = doc.splitTextToSize(intro, 180);
    doc.text(introLines, margin, y);
    y += introLines.length * 4 + 3;

    // Seção Dados Pessoais
    doc.setFontSize(9);
    const drawLine = (x1: number, x2: number, yL: number) =>
      doc.line(x1, yL + 0.5, x2, yL + 0.5);

    // Contratante
    doc.text("CONTRATANTE: (MAIOR DE 18 ANOS):", margin, y);
    drawLine(margin + 59, 195, y);
    setBold();
    doc.text(formData.contratante.nome, margin + 60, y);
    setNormal();
    y += 4;

    // Filiação
    doc.text("FILIAÇÃO PAI:", margin, y);
    drawLine(margin + 22, 105, y);
    doc.text("MÃE:", 110, y);
    drawLine(118, 195, y);
    setBold();
    doc.text(formData.contratante.pai, margin + 23, y);
    doc.text(formData.contratante.mae, 119, y);
    setNormal();
    y += 4;

    // RG e CPF
    doc.text("RG:", margin, y);
    drawLine(margin + 6, 75, y);
    doc.text("CPF:", 80, y);
    drawLine(88, 195, y);
    setBold();
    doc.text(formData.contratante.rg, margin + 7, y);
    doc.text(formData.contratante.cpf, 89, y);
    setNormal();
    y += 4;

    // Fones Contratante
    doc.text("FONE: (    )", margin, y);
    drawLine(margin + 10, 75, y);
    doc.text("CELULAR: (    )", 80, y);
    drawLine(96, 195, y);
    setBold();
    doc.text(formData.contratante.fone, margin + 11.5, y);
    doc.text(formData.contratante.celular, 97.5, y);
    setNormal();
    y += 4;

    // Endereço
    doc.text("ENDEREÇO:", margin, y);
    drawLine(margin + 19, 145, y);
    doc.text("Nº:", 150, y);
    drawLine(155, 195, y);
    setBold();
    doc.text(formData.contratante.endereco, margin + 20, y);
    doc.text(formData.contratante.n, 156, y);
    setNormal();
    y += 4;

    // Localidade
    doc.text("BAIRRO:", margin, y);
    drawLine(margin + 13, 80, y);
    doc.text("CIDADE:", 85, y);
    drawLine(98, 160, y);
    doc.text("UF:", 165, y);
    drawLine(170, 195, y);
    setBold();
    doc.text(formData.contratante.bairro, margin + 14, y);
    doc.text(formData.contratante.cidade, 99, y);
    doc.text(formData.contratante.uf, 171, y);
    setNormal();
    y += 6;

    // Aluno
    doc.text("ALUNO:", margin, y);
    drawLine(margin + 12, 195, y);
    setBold();
    doc.text(formData.aluno.nome, margin + 13, y);
    setNormal();
    y += 4;

    // Contatos Aluno
    doc.text("DATA DE NASC.:", margin, y);
    drawLine(margin + 25, 75, y);
    setBold();
    doc.text(formData.aluno.dataNasc, margin + 26, y);
    setNormal();

    doc.text("TELEFONE: (    )", 80, y);
    drawLine(98, 140, y);
    setBold();
    doc.text(formData.aluno.telefone, 99.5, y);
    setNormal();

    doc.text("WHATSAPP: (    )", 145, y);
    drawLine(164, 195, y);
    setBold();
    doc.text(formData.aluno.whatsapp, 165.5, y);
    setNormal();
    y += 4;

    doc.text("E-MAIL:", margin, y);
    drawLine(margin + 12, 115, y);
    doc.text("FACEBOOK:", 120, y);
    drawLine(139, 195, y);
    setBold();
    doc.text(formData.aluno.email, margin + 13, y);
    doc.text(formData.aluno.facebook, 140, y);
    setNormal();

    // --- CLÁUSULA 1º - DOS CURSOS ---
    y += 7;
    setNormal();
    doc.setFontSize(8.5);
    const posIntro =
      "O aluno ou seu responsável legal, doravante denominado CONTRATANTE, tem as partes por justa e contratado o quanto segue:";
    doc.text(posIntro, margin, y);
    y += 4;

    // Título da Cláusula em Negrito
    setBold();
    doc.text("Cláusula 1º - DOS CURSOS:", margin, y);
    setNormal();
    const c1Text =
      "A CONTRATADA se compromete de ministrar o curso profissionalizante livre a baixo, cuja carga";
    doc.text(c1Text, 55, y);
    y += 4;
    const c2Text =
      "horaria duração das aulas e horário estão previamente determinados.";
    // O texto começa logo após o título "DOS CURSOS:"
    doc.text(c2Text, margin, y);
    y += 7;

    // Itens 1, 2 e 3 em Negrito
    setBold();
    const item1 =
      "1- Curso Profissionalizante livre de Mecânica, Elétrica e Injeção Eletrônica. (Em conforme a Lei nº 9493/96; Decreto nº 5.154/4. Deliberação CEE14/7).";
    const item1Lines = doc.splitTextToSize(item1, 180);
    doc.text(item1Lines, margin, y);
    y += item1Lines.length * 3.5;

    const item2 =
      "2- O curso livre acima citado terá duração conforme a contratação que aluno fará, ou seja, pelo modulo escolhido ou todos os módulos.";
    const item2Lines = doc.splitTextToSize(item2, 180);
    doc.text(item2Lines, margin, y);
    y += item2Lines.length * 3.5;

    const item3 =
      "3- As aulas terão duração de acordo com o dia e hora escolhido pelo aluno ou contratante discriminado abaixo.";
    doc.text(item3, margin, y);
    y += 4;

    // Listagem dos Módulos com preenchimento
    setNormal();
    const modulosList = [
      {
        id: "m1",
        label:
          "1º Módulo Manutenção de motos – curso livre com duração de 36 horas/aulas",
      },
      {
        id: "m2",
        label:
          "2º Módulo de motores de motos – curso livre com duração de 36horas/aulas",
      },
      {
        id: "m3",
        label:
          "3º Modulo de elétrica de motos – curso livre com duração de 36 horas/aulas",
      },
      {
        id: "m4",
        label:
          "4º Módulo de injeção eletrônica – curso livre com duração de 36 horas/ aulas",
      },
    ];

    modulosList.forEach((m) => {
      const modState = formData.modulos[m.id as keyof typeof formData.modulos];

      doc.text(m.label + ", das", 17, y);

      // Linha do "das"
      drawLine(margin + 114, margin + 124, y);
      setBold();
      doc.text(modState.das || "___:___", margin + 115, y);
      setNormal();

      doc.text("ás", margin + 125, y);

      // Linha do "ás"
      drawLine(margin + 129, margin + 139, y);
      setBold();
      doc.text(modState.as || "___:___", margin + 130, y);
      setNormal();

      doc.text("/", margin + 140, y);

      // Linha da observação/dias
      drawLine(margin + 142, 195, y);
      setBold();
      doc.text(modState.dias || "", margin + 143, y);
      setNormal();

      y += 4;
    });

    doc.text("PERIODO DO CURSO SERÁ DE", margin, y);
    drawLine(margin + 45, 95, y);
    setBold();
    doc.text(formData.periodoCurso || "____________________", margin + 46, y);
    setNormal();

    // --- CLÁUSULA 2º - DOS PREÇOS ---
    y += 7;
    setBold();
    doc.text("Cláusula 2º - DOS PREÇOS:", margin, y);
    setNormal();
    doc.text(
      "O CONTRATANTE/ ALUNO se obriga a efetuar o pagamento do curso nas seguintes condições:",
      margin + 40,
      y,
    );
    y += 4;

    doc.text(
      `Matricula : R$ ${formData.financeiro.matricula || "50,00"}.`,
      margin,
      y,
    );

    // Forma de Pagamento - Alinhamento à direita conforme imagem
    doc.text("Forma de pagamento:", 76, y);
    doc.text("A vista", 114, y);
    doc.rect(106, y - 2.9, 7, 4); // Checkbox A vista
    if (formData.financeiro.formaPagamento === "a_vista")
      doc.text("X", 108.51, y + 0.3);

    doc.text("ou", 129, y);

    doc.text("Cartão de Credito", 148, y);
    doc.rect(140, y - 2.9, 7, 4); // Checkbox Cartão
    if (formData.financeiro.formaPagamento === "cartao")
      doc.text("X", 142.5, y + 0.3);

    y += 4;
    doc.text(
      `Valordo curso por cada módulo: R$ ${formData.financeiro.valorModulo || "250,00"}`,
      margin,
      y,
    );

    doc.text("Boleto: Entrada de R$ 400 + 4 Parcelasde R$200", 114, y);
    doc.rect(106, y - 2.9, 7, 4);
    if (formData.financeiro.formaPagamento === "boleto")
      doc.text("X", 108.5, y + 0.3);

    y += 4;
    doc.text("observação:", margin, y);
    drawLine(margin + 18, 195, y);
    setBold();
    doc.text(formData.financeiro.observacao, margin + 20, y);
    setNormal();
    y += 7;

    // --- CLÁUSULA 3° - DO MATERIAL ---
    setBold();
    doc.text("Cláusula 3° - DO MATERIAL:", margin, y);
    setNormal();
    const c3Text1 =
      "O CONTRATANTE/ALUNO receberá suporte didático em sala de aula necessário para aprendizagem,terá";
    doc.text(c3Text1, 56, y);
    y += 4;
    const c3Text2 =
      "direito a aulas praticas e/ou teóricas conforme o desenvolvimento docurso.";
    doc.text(c3Text2, margin, y);
    y += 7;

    // --- CLÁUSULA 4° - DAS AULAS ---
    setBold();
    doc.text("Cláusula 4°-DAS AULAS:", margin, y);
    setNormal();
    const c4Text1 =
      "O CONTRATANTE/ALUNO se obriga a frequentar o curso escolhido nos dias e horários estabelecidos na ";
    doc.text(c4Text1, 51, y);
    y += 4;
    const c4Text2 =
      "cláusula 1°, estando ciente de que a falta de frequência ao curso não obriga ao pagamento total do acordo.";
    doc.text(c4Text2, margin, y);
    y += 4;
    const c4item1 =
      "1- Em caso de falta de aulas pelo CONTRATANTE/ ALUNO, o aluno não terá direito a reposição de aulas.";
    doc.text(c4item1, 20, y);
    y += 7;

    // --- CLÁUSULA 5° - DO CERTIFICADO: O CONTRATANTE/ ALUNO ---
    setBold();
    doc.text("Cláusula 5° - DO CERTIFICADO: O CONTRATANTE/ ALUNO", margin, y);
    setNormal();
    const c5Text1 =
      "receberá certificado de conclusão ao termino do curso, somente se o ";
    doc.text(c5Text1, 101, y);
    y += 4;
    const c5Text2 =
      "mesmo tiver cumprido 80%(oitenta por cento) da carga horaria total do curso escolhido, efetuado pagamento de todo o curso e obtido a";
    doc.text(c5Text2, margin, y);
    y += 4;
    const c5Text3 = "media mínima de 7,0(sete pontos).";
    doc.text(c5Text3, margin, y);
    y += 4;
    const c5item1 =
      "1- O certificado estará á disposição do CONTRATANTE/ALUNO após 30 (trinta) dias ao termino do curso escolhido e será retirado";
    doc.text(c5item1, 20, y);
    y += 4;
    const c5item2 =
      "na secretaria da escola ou será enviado para o e-mail do CONTRATANTE/ ALUNO. ";
    doc.text(c5item2, 20, y);
    y += 7;

    // --- CLÁUSULA 6°- DA DESISTÊNCIA DO CURSO: ---
    setBold();
    doc.text("Cláusula 6° - DA DESISTÊNCIA DO CURSO:", margin, y);
    setNormal();
    const c6Text1 =
      "Caso não tenha iniciado as aulas o CONTRATANTE/ALUNO poderá desistir do curso,";
    doc.text(c6Text1, 78, y);
    y += 4;
    const c6Text2 =
      "desde que comunique á CONTRATADA, por escrito e com devolução da via do contrato, com antecedência de 24 (vinte quatro) horas ao";
    doc.text(c6Text2, margin, y);
    y += 4;
    const c6Text3 =
      " inicio do curso escolhido. Neste caso, encerra-se o vinculo contratual entre as partes, resolvendo-se o presente contrato.";
    doc.text(c6Text3, margin, y);
    y += 4;
    setBold();
    const c6item1 =
      "1- Caso o prazo de 24 (vinte quatro) horas, citado anteriormente , no for obedecido o CONTRATANTE/ALUNO se obriga a";
    doc.text(c6item1, 20, y);
    y += 4;
    const c6item2 =
      " efetuar o cancelamento do curso escolhido, o qual implicará na quitação de todas as parcelas,(independente de frequência";
    doc.text(c6item2, 20, y);
    y += 4;
    const c6item3 =
      "ás aulas) além de estar obrigado ao pagamento das parcelas porventura em atraso. Devendo comunicar a CONTRATADA por.";
    doc.text(c6item3, 20, y);
    y += 4;
    const c6item4 = "escrito sua desistência.";
    doc.text(c6item4, 20, y);
    y += 7;

    setNormal();
    doc.setFontSize(8.5);

    const declaracaoText =
      "Em obediência ao disposto no artigo 46 do código de defesa do consumido, o contratante declara expressamente que lhe foi concedido a oportunidade para ler, examinar e, portanto entender o que ficou pactuado neste contrato, declaro ainda, espontaneamente que lhe foram prestados todas as informações e esclarecimentos necessários para o cumprimento integral dos termos e condições dos direitos e obrigações ora assumidos.";
    const declaracaoLines = doc.splitTextToSize(declaracaoText, 180);
    doc.text(declaracaoLines, margin, y);
    y += declaracaoLines.length * 3.5;

    // Previsão de Início
    doc.text("Previsão do inicio curso escolhido", margin, y);
    drawLine(margin + 48, margin + 75, y);
    setBold();
    doc.text(formData.previsaoInicio || "____/____/________", margin + 50, y);
    setNormal();
    y += 7;

    const encerramento =
      "Por estarem assim juntos e contratados, firmamos o presente contrato em 2(duas) vias de igual teor para que assim produzam um Só efeito.";
    doc.text(encerramento, margin, y);
    y += 20;

    // --- ASSINATURAS ---
    const assinaturaWidth = 70;

    // Linha Contratante
    doc.line(margin, y, margin + assinaturaWidth, y);
    doc.text("CONTRATANTE/ALUNO", margin + assinaturaWidth / 2, y + 4, {
      align: "center",
    });

    // Linha SouMotos
    const xSouMotos = pageWidth - margin - assinaturaWidth;
    doc.line(xSouMotos, y, pageWidth - margin, y);
    doc.text("SOUMOTOS ESPECIALIZADA", xSouMotos + assinaturaWidth / 2, y + 4, {
      align: "center",
    });
    return doc;
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
              onClick={() => setPdfPreview(generateDoc().output("bloburl"))}
              className="flex-1 bg-zinc-800 text-white py-4 rounded-xl font-bold uppercase text-xs hover:bg-black transition-all"
            >
              Preview
            </button>
            <button
              onClick={() =>
                generateDoc().save(
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
