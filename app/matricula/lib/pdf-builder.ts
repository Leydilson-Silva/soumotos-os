import jsPDF from 'jspdf';
import type { FormData, ContratanteData, AlunoData } from './types';

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

class PDFContext {
  doc: jsPDF;
  y: number;
  pageWidth: number;
  margin: number;
  fontSize: number = 8.5;

  constructor(doc: jsPDF, margin: number = 15) {
    this.doc = doc;
    this.y = 15;
    this.pageWidth = doc.internal.pageSize.getWidth();
    this.margin = margin;
  }

  bold() {
    this.doc.setFont('helvetica', 'bold');
  }

  normal() {
    this.doc.setFont('helvetica', 'normal');
  }

  setFontSize(size: number) {
    this.doc.setFontSize(size);
  }

  addText(text: string, x?: number, options?: { align?: string }) {
    this.doc.text(text, x ?? this.margin, this.y, options);
  }

  addTexts(texts: string[], x?: number, options?: { align?: string }) {
    texts.forEach((text) => {
      this.doc.text(text, x ?? this.margin, this.y, options);
      this.y += 4;
    });
  }

  drawLine(x1: number, x2: number) {
    this.doc.line(x1, this.y + 0.5, x2, this.y + 0.5);
  }

  addImage(path: string, width: number, height: number, x?: number) {
    try {
      this.doc.addImage(path, 'PNG', x ?? this.margin, this.y - 5, width, height);
    } catch (e) {
      console.warn(`Imagem não encontrada: ${path}`);
    }
  }

  newLine(height: number = 4) {
    this.y += height;
  }

  splitText(text: string, width: number = 180) {
    return this.doc.splitTextToSize(text, width);
  }

  addSplitText(text: string, width: number = 180, lineHeight: number = 3.5) {
    const lines = this.splitText(text, width);
    this.doc.text(lines, this.margin, this.y);
    this.y += lines.length * lineHeight;
  }

  addSplitTextWithX(text: string, x: number, width: number = 180, lineHeight: number = 3.5) {
    const lines = this.splitText(text, width);
    this.doc.text(lines, x, this.y);
    this.y += lines.length * lineHeight;
  }
}

function addHeader(ctx: PDFContext, formData: FormData) {
  ctx.addImage('/imgcontrato1.png', 38, 18, ctx.margin);
  ctx.addImage('/imgcontrato2.png', 35, 22, ctx.pageWidth - ctx.margin - 35);

  ctx.bold();
  ctx.setFontSize(11);
  ctx.doc.text('SOUMOTOS ESPECIALIZADA', ctx.pageWidth / 2, ctx.y, { align: 'center' });
  ctx.newLine(4);
  ctx.doc.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', ctx.pageWidth / 2, ctx.y, { align: 'center' });
  ctx.newLine(4);
  ctx.doc.text(`MATRICULA Nº ${formData.matriculaNum || '________'}`, ctx.pageWidth / 2, ctx.y, { align: 'center' });
  ctx.newLine(10);

  ctx.normal();
  ctx.setFontSize(8.5);
  const intro = 'Pelo presente contrato de prestação de serviços, que entre si, de um lado SOUMOTOS, pessoa jurídica de direito privado, inscrito no CNPJ 22.432.295/0001-08, com sede na cidade de Ceará Mirim/ RN, situado na Av Boaventura de Sá – N° 528– Planalto, telefone (84) 99430-3792 doravante denominada simplesmente CONTRATO e de outro lado.';
  ctx.addSplitText(intro, 180, 4);
  ctx.newLine(3);
}

function addContratanteData(ctx: PDFContext, contratante: ContratanteData, matriculaNum: string) {
  ctx.setFontSize(9);

  // Contratante
  ctx.doc.text('CONTRATANTE: (MAIOR DE 18 ANOS):', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 59, 195);
  ctx.bold();
  ctx.doc.text(contratante.nome, ctx.margin + 60, ctx.y);
  ctx.normal();
  ctx.newLine(4);

  // Filiação
  ctx.doc.text('FILIAÇÃO PAI:', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 22, 105);
  ctx.doc.text('MÃE:', 110, ctx.y);
  ctx.drawLine(118, 195);
  ctx.bold();
  ctx.doc.text(contratante.pai, ctx.margin + 23, ctx.y);
  ctx.doc.text(contratante.mae, 119, ctx.y);
  ctx.normal();
  ctx.newLine(4);

  // RG e CPF
  ctx.doc.text('RG:', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 6, 75);
  ctx.doc.text('CPF:', 80, ctx.y);
  ctx.drawLine(88, 195);
  ctx.bold();
  ctx.doc.text(contratante.rg, ctx.margin + 7, ctx.y);
  ctx.doc.text(contratante.cpf, 89, ctx.y);
  ctx.normal();
  ctx.newLine(4);

  // Fones
  ctx.doc.text('FONE: (    )', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 10, 75);
  ctx.doc.text('CELULAR: (    )', 80, ctx.y);
  ctx.drawLine(96, 195);
  ctx.bold();
  ctx.doc.text(contratante.fone, ctx.margin + 11.5, ctx.y);
  ctx.doc.text(contratante.celular, 97.5, ctx.y);
  ctx.normal();
  ctx.newLine(4);

  // Endereço
  ctx.doc.text('ENDEREÇO:', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 19, 145);
  ctx.doc.text('Nº:', 150, ctx.y);
  ctx.drawLine(155, 195);
  ctx.bold();
  ctx.doc.text(contratante.endereco, ctx.margin + 20, ctx.y);
  ctx.doc.text(contratante.n, 156, ctx.y);
  ctx.normal();
  ctx.newLine(4);

  // Localidade
  ctx.doc.text('BAIRRO:', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 13, 80);
  ctx.doc.text('CIDADE:', 85, ctx.y);
  ctx.drawLine(98, 160);
  ctx.doc.text('UF:', 165, ctx.y);
  ctx.drawLine(170, 195);
  ctx.bold();
  ctx.doc.text(contratante.bairro, ctx.margin + 14, ctx.y);
  ctx.doc.text(contratante.cidade, 99, ctx.y);
  ctx.doc.text(contratante.uf, 171, ctx.y);
  ctx.normal();
  ctx.newLine(6);
}

function addAlunoData(ctx: PDFContext, aluno: AlunoData) {
  // Aluno
  ctx.doc.text('ALUNO:', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 12, 195);
  ctx.bold();
  ctx.doc.text(aluno.nome, ctx.margin + 13, ctx.y);
  ctx.normal();
  ctx.newLine(4);

  // Contatos
  ctx.doc.text('DATA DE NASC.:', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 25, 75);
  ctx.bold();
  ctx.doc.text(aluno.dataNasc, ctx.margin + 26, ctx.y);
  ctx.normal();

  ctx.doc.text('TELEFONE: (    )', 80, ctx.y);
  ctx.drawLine(98, 140);
  ctx.bold();
  ctx.doc.text(aluno.telefone, 99.5, ctx.y);
  ctx.normal();

  ctx.doc.text('WHATSAPP: (    )', 145, ctx.y);
  ctx.drawLine(164, 195);
  ctx.bold();
  ctx.doc.text(aluno.whatsapp, 165.5, ctx.y);
  ctx.normal();
  ctx.newLine(4);

  ctx.doc.text('E-MAIL:', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 12, 115);
  ctx.doc.text('FACEBOOK:', 120, ctx.y);
  ctx.drawLine(139, 195);
  ctx.bold();
  ctx.doc.text(aluno.email, ctx.margin + 13, ctx.y);
  ctx.doc.text(aluno.facebook, 140, ctx.y);
  ctx.normal();
  ctx.newLine(7);
}

function addClausulaUm(ctx: PDFContext, formData: FormData) {
  ctx.normal();
  ctx.setFontSize(8.5);
  const posIntro = 'O aluno ou seu responsável legal, doravante denominado CONTRATANTE, tem as partes por justa e contratado o quanto segue:';
  ctx.doc.text(posIntro, ctx.margin, ctx.y);
  ctx.newLine(4);

  ctx.bold();
  ctx.doc.text('Cláusula 1º - DOS CURSOS:', ctx.margin, ctx.y);
  ctx.normal();
  const c1Text = 'A CONTRATADA se compromete de ministrar o curso profissionalizante livre a baixo, cuja carga';
  ctx.doc.text(c1Text, 55, ctx.y);
  ctx.newLine(4);
  const c2Text = 'horaria duração das aulas e horário estão previamente determinados.';
  ctx.doc.text(c2Text, ctx.margin, ctx.y);
  ctx.newLine(7);

  ctx.bold();
  const item1 = '1- Curso Profissionalizante livre de Mecânica, Elétrica e Injeção Eletrônica. (Em conforme a Lei nº 9493/96; Decreto nº 5.154/4. Deliberação CEE14/7).';
  const item1Lines = ctx.splitText(item1, 180);
  ctx.doc.text(item1Lines, ctx.margin, ctx.y);
  ctx.newLine(item1Lines.length * 3.5);

  const item2 = '2- O curso livre acima citado terá duração conforme a contratação que aluno fará, ou seja, pelo modulo escolhido ou todos os módulos.';
  const item2Lines = ctx.splitText(item2, 180);
  ctx.doc.text(item2Lines, ctx.margin, ctx.y);
  ctx.newLine(item2Lines.length * 3.5);

  const item3 = '3- As aulas terão duração de acordo com o dia e hora escolhido pelo aluno ou contratante discriminado abaixo.';
  ctx.doc.text(item3, ctx.margin, ctx.y);
  ctx.newLine(4);

  ctx.normal();
  const modulosList = [
    { id: 'm1', label: '1º Módulo Manutenção de motos – curso livre com duração de 36 horas/aulas' },
    { id: 'm2', label: '2º Módulo de motores de motos – curso livre com duração de 36horas/aulas' },
    { id: 'm3', label: '3º Modulo de elétrica de motos – curso livre com duração de 36 horas/aulas' },
    { id: 'm4', label: '4º Módulo de injeção eletrônica – curso livre com duração de 36 horas/ aulas' },
  ];

  modulosList.forEach((m) => {
    const modState = formData.modulos[m.id as keyof typeof formData.modulos];
    ctx.doc.text(m.label + ', das', 17, ctx.y);
    ctx.drawLine(ctx.margin + 114, ctx.margin + 124);
    ctx.bold();
    ctx.doc.text(modState.das || '___:___', ctx.margin + 115, ctx.y);
    ctx.normal();
    ctx.doc.text('ás', ctx.margin + 125, ctx.y);
    ctx.drawLine(ctx.margin + 129, ctx.margin + 139);
    ctx.bold();
    ctx.doc.text(modState.as || '___:___', ctx.margin + 130, ctx.y);
    ctx.normal();
    ctx.doc.text('/', ctx.margin + 140, ctx.y);
    ctx.drawLine(ctx.margin + 142, 195);
    ctx.bold();
    ctx.doc.text(modState.dias || '', ctx.margin + 143, ctx.y);
    ctx.normal();
    ctx.newLine(4);
  });

  ctx.doc.text('PERIODO DO CURSO SERÁ DE', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 45, 95);
  ctx.bold();
  ctx.doc.text(formData.periodoCurso || '____________________', ctx.margin + 46, ctx.y);
  ctx.normal();
  ctx.newLine(7);
}

function addClausulaDois(ctx: PDFContext, formData: FormData) {
  ctx.bold();
  ctx.doc.text('Cláusula 2º - DOS PREÇOS:', ctx.margin, ctx.y);
  ctx.normal();
  ctx.doc.text('O CONTRATANTE/ ALUNO se obriga a efetuar o pagamento do curso nas seguintes condições:', ctx.margin + 40, ctx.y);
  ctx.newLine(4);

  ctx.doc.text(`Matricula : ${formatCurrency(formData.financeiro.matricula)}.`, ctx.margin, ctx.y);

  ctx.doc.text('Forma de pagamento:', 76, ctx.y);
  ctx.doc.text('A vista', 114, ctx.y);
  ctx.doc.rect(106, ctx.y - 2.9, 7, 4);
  if (formData.financeiro.formaPagamento === 'a_vista') ctx.doc.text('X', 108.51, ctx.y + 0.3);

  ctx.doc.text('ou', 129, ctx.y);
  ctx.doc.text('Cartão de Credito', 148, ctx.y);
  ctx.doc.rect(140, ctx.y - 2.9, 7, 4);
  if (formData.financeiro.formaPagamento === 'cartao') ctx.doc.text('X', 142.5, ctx.y + 0.3);

  ctx.newLine(4);
  ctx.doc.text(`Valor do curso por cada módulo: ${formatCurrency(formData.financeiro.valorModulo)}`, ctx.margin, ctx.y);

  ctx.doc.text('Boleto: Entrada de R$ 400 + 4 Parcelasde R$200', 114, ctx.y);
  ctx.doc.rect(106, ctx.y - 2.9, 7, 4);
  if (formData.financeiro.formaPagamento === 'boleto') ctx.doc.text('X', 108.5, ctx.y + 0.3);

  ctx.newLine(4);
  ctx.doc.text('observação:', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 18, 195);
  ctx.bold();
  ctx.doc.text(formData.financeiro.observacao, ctx.margin + 20, ctx.y);
  ctx.normal();
  ctx.newLine(7);
}

function addClausulaTres(ctx: PDFContext) {
  ctx.bold();
  ctx.doc.text('Cláusula 3° - DO MATERIAL:', ctx.margin, ctx.y);
  ctx.normal();
  const c3Text1 = 'O CONTRATANTE/ALUNO receberá suporte didático em sala de aula necessário para aprendizagem,terá';
  ctx.doc.text(c3Text1, 56, ctx.y);
  ctx.newLine(4);
  const c3Text2 = 'direito a aulas praticas e/ou teóricas conforme o desenvolvimento docurso.';
  ctx.doc.text(c3Text2, ctx.margin, ctx.y);
  ctx.newLine(7);
}

function addClausulaQuatro(ctx: PDFContext) {
  ctx.bold();
  ctx.doc.text('Cláusula 4°-DAS AULAS:', ctx.margin, ctx.y);
  ctx.normal();
  const c4Text1 = 'O CONTRATANTE/ALUNO se obriga a frequentar o curso escolhido nos dias e horários estabelecidos na ';
  ctx.doc.text(c4Text1, 51, ctx.y);
  ctx.newLine(4);
  const c4Text2 = 'cláusula 1°, estando ciente de que a falta de frequência ao curso não obriga ao pagamento total do acordo.';
  ctx.doc.text(c4Text2, ctx.margin, ctx.y);
  ctx.newLine(4);
  const c4item1 = '1- Em caso de falta de aulas pelo CONTRATANTE/ ALUNO, o aluno não terá direito a reposição de aulas.';
  ctx.doc.text(c4item1, 20, ctx.y);
  ctx.newLine(7);
}

function addClausulaCinco(ctx: PDFContext) {
  ctx.bold();
  ctx.doc.text('Cláusula 5° - DO CERTIFICADO: O CONTRATANTE/ ALUNO', ctx.margin, ctx.y);
  ctx.normal();
  const c5Text1 = 'receberá certificado de conclusão ao termino do curso, somente se o ';
  ctx.doc.text(c5Text1, 101, ctx.y);
  ctx.newLine(4);
  const c5Text2 = 'mesmo tiver cumprido 80%(oitenta por cento) da carga horaria total do curso escolhido, efetuado pagamento de todo o curso e obtido a';
  ctx.doc.text(c5Text2, ctx.margin, ctx.y);
  ctx.newLine(4);
  const c5Text3 = 'media mínima de 7,0(sete pontos).';
  ctx.doc.text(c5Text3, ctx.margin, ctx.y);
  ctx.newLine(4);
  const c5item1 = '1- O certificado estará á disposição do CONTRATANTE/ALUNO após 30 (trinta) dias ao termino do curso escolhido e será retirado';
  ctx.doc.text(c5item1, 20, ctx.y);
  ctx.newLine(4);
  const c5item2 = 'na secretaria da escola ou será enviado para o e-mail do CONTRATANTE/ ALUNO. ';
  ctx.doc.text(c5item2, 20, ctx.y);
  ctx.newLine(7);
}

function addClausulaSeis(ctx: PDFContext) {
  ctx.bold();
  ctx.doc.text('Cláusula 6° - DA DESISTÊNCIA DO CURSO:', ctx.margin, ctx.y);
  ctx.normal();
  const c6Text1 = 'Caso não tenha iniciado as aulas o CONTRATANTE/ALUNO poderá desistir do curso,';
  ctx.doc.text(c6Text1, 78, ctx.y);
  ctx.newLine(4);
  const c6Text2 = 'desde que comunique á CONTRATADA, por escrito e com devolução da via do contrato, com antecedência de 24 (vinte quatro) horas ao';
  ctx.doc.text(c6Text2, ctx.margin, ctx.y);
  ctx.newLine(4);
  const c6Text3 = ' inicio do curso escolhido. Neste caso, encerra-se o vinculo contratual entre as partes, resolvendo-se o presente contrato.';
  ctx.doc.text(c6Text3, ctx.margin, ctx.y);
  ctx.newLine(4);
  ctx.bold();
  const c6item1 = '1- Caso o prazo de 24 (vinte quatro) horas, citado anteriormente , no for obedecido o CONTRATANTE/ALUNO se obriga a';
  ctx.doc.text(c6item1, 20, ctx.y);
  ctx.newLine(4);
  const c6item2 = ' efetuar o cancelamento do curso escolhido, o qual implicará na quitação de todas as parcelas,(independente de frequência';
  ctx.doc.text(c6item2, 20, ctx.y);
  ctx.newLine(4);
  const c6item3 = 'ás aulas) além de estar obrigado ao pagamento das parcelas porventura em atraso. Devendo comunicar a CONTRATADA por.';
  ctx.doc.text(c6item3, 20, ctx.y);
  ctx.newLine(4);
  const c6item4 = 'escrito sua desistência.';
  ctx.doc.text(c6item4, 20, ctx.y);
  ctx.newLine(7);

  ctx.normal();
  ctx.setFontSize(8.5);
}

function addDeclaracao(ctx: PDFContext) {
  const declaracaoText = 'Em obediência ao disposto no artigo 46 do código de defesa do consumido, o contratante declara expressamente que lhe foi concedido a oportunidade para ler, examinar e, portanto entender o que ficou pactuado neste contrato, declaro ainda, espontaneamente que lhe foram prestados todas as informações e esclarecimentos necessários para o cumprimento integral dos termos e condições dos direitos e obrigações ora assumidos.';
  const declaracaoLines = ctx.splitText(declaracaoText, 180);
  ctx.doc.text(declaracaoLines, ctx.margin, ctx.y);
  ctx.newLine(declaracaoLines.length * 3.5);
}

function addDataInicio(ctx: PDFContext, formData: FormData) {
  ctx.doc.text('Previsão do inicio curso escolhido', ctx.margin, ctx.y);
  ctx.drawLine(ctx.margin + 48, ctx.margin + 75);
  ctx.bold();
  ctx.doc.text(formData.previsaoInicio || '____/____/________', ctx.margin + 50, ctx.y);
  ctx.normal();
  ctx.newLine(7);
}

function addEncerramento(ctx: PDFContext) {
  const encerramento = 'Por estarem assim juntos e contratados, firmamos o presente contrato em 2(duas) vias de igual teor para que assim produzam um Só efeito.';
  ctx.doc.text(encerramento, ctx.margin, ctx.y);
  ctx.newLine(20);
}

function addAssinaturas(ctx: PDFContext) {
  const assinaturaWidth = 70;

  ctx.doc.line(ctx.margin, ctx.y, ctx.margin + assinaturaWidth, ctx.y);
  ctx.doc.text('CONTRATANTE/ALUNO', ctx.margin + assinaturaWidth / 2, ctx.y + 4, {
    align: 'center',
  });

  const xSouMotos = ctx.pageWidth - ctx.margin - assinaturaWidth;
  ctx.doc.line(xSouMotos, ctx.y, ctx.pageWidth - ctx.margin, ctx.y);
  ctx.doc.text('SOUMOTOS ESPECIALIZADA', xSouMotos + assinaturaWidth / 2, ctx.y + 4, {
    align: 'center',
  });
}

export function generateContractPDF(formData: FormData): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const ctx = new PDFContext(doc);

  addHeader(ctx, formData);
  addContratanteData(ctx, formData.contratante, formData.matriculaNum);
  addAlunoData(ctx, formData.aluno);
  addClausulaUm(ctx, formData);
  addClausulaDois(ctx, formData);
  addClausulaTres(ctx);
  addClausulaQuatro(ctx);
  addClausulaCinco(ctx);
  addClausulaSeis(ctx);
  addDeclaracao(ctx);
  addDataInicio(ctx, formData);
  addEncerramento(ctx);
  addAssinaturas(ctx);

  return doc;
}
