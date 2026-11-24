import type { Fee, FormData } from './template';

/**
 * Lê o .txt gerado pela Calculadora de Revisão (AJDILIGENCIAS) — e também os
 * cálculos antigos feitos à mão — e devolve os campos da apresentação.
 */
export type CalculoImportado = {
  dados: Partial<FormData>;
  avisos: string[];
};

const semAcento = (texto: string) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** "R$ 1.731,95" | "1.731,95" | "53,00" -> número */
export const valorBR = (texto: string): number => {
  const limpo = texto.replace(/R\$/gi, '').replace(/\s/g, '');
  const achado = limpo.match(/-?[\d.]*\d(?:,\d+)?/);
  if (!achado) return 0;
  const numero = Number(achado[0].replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(numero) ? numero : 0;
};

const inteiro = (texto: string) => {
  const achado = texto.match(/\d+/);
  return achado ? Number(achado[0]) : 0;
};

const centavos = (valor: number) => Math.round(valor * 100) / 100;

// "R$ 999,00 x2 = R$ 1.998,00" | "53,00 X 360 = 19.080,00" | "R$ 4.161,96"
const VALOR_TAXA =
  /^(?:R\$\s*)?([\d.]+,\d{2})(?:\s*[xX]\s*(\d+)\s*=\s*(?:R\$\s*)?([\d.]+,\d{2}))?\s*$/;

const CHAVES_NAO_TAXA = [
  'NOME', 'CPF', 'FINANCEIRA', 'MODELO', 'TIPO', 'IMOVEL', 'VALOR', 'N DE MESES',
  'NO DE MESES', 'QNT', 'PARCELAS', 'REDUCAO', 'ESTORNO', 'ABATIMENTO', 'TOTAL',
  'RESSARCIMENTO', 'COTACAO', 'PAGAMENTO',
];

const descricaoMultiplicador = (unitario: number, mult: number) => {
  const base = `${unitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} × ${mult}`;
  if (mult === 2) return `${base} (devolução em dobro)`;
  if (mult === 3) return `${base} (triplo)`;
  return `${base} meses`;
};

export function lerCalculoTxt(conteudo: string, gerarId: () => string): CalculoImportado {
  const dados: Partial<FormData> = {};
  const fees: Fee[] = [];
  const avisos: string[] = [];
  let parcelasLidas = 0;
  let reducaoPorParcela = 0;
  let valorFinanciadoLido = false;

  const linhas = conteudo.replace(/^﻿/, '').split(/\r?\n/);

  for (const bruta of linhas) {
    // tira marcadores do começo: "o  ", "•  ", "- ", tabs
    const linha = bruta.replace(/^\s*(?:[o•\-*]\s+)?/, '').trim();
    if (!linha) continue;

    const chaveNorm = semAcento(linha).toUpperCase();

    // "IMOVEL" sozinho (ou "IMOVEL: descrição")
    if (/^IMOVEL\b/.test(chaveNorm)) {
      dados.type = 'imovel';
      const resto = linha.split(':').slice(1).join(':').trim();
      dados.vehicle = resto || dados.vehicle || 'Imóvel';
      continue;
    }

    const doisPontos = linha.indexOf(':');
    if (doisPontos < 0) continue;

    const chaveOriginal = linha.slice(0, doisPontos).trim();
    const valor = linha.slice(doisPontos + 1).trim();
    const chave = semAcento(chaveOriginal).toUpperCase().replace(/[º°.]/g, '').replace(/\s+/g, ' ').trim();

    if (chave === 'NOME') dados.clientName = valor;
    else if (chave === 'CPF') dados.cpf = valor;
    else if (/^N.? ?CONTRATO$|^NUMERO DO CONTRATO$|^N CONTRATO$/.test(chave)) dados.contractNumber = valor;
    else if (chave === 'FINANCEIRA') dados.institution = valor;
    else if (chave === 'MODELO DO VEICULO') { dados.vehicle = valor; dados.type = dados.type ?? 'veiculo'; }
    else if (chave === 'TIPO DO EMPRESTIMO') { dados.vehicle = valor; dados.type = 'emprestimo'; }
    else if (chave === 'TIPO DO FINANCIAMENTO') {
      dados.vehicle = valor;
      if (/EMPRESTIMO|CONSIGNADO|CDC/.test(semAcento(valor).toUpperCase())) dados.type = 'emprestimo';
    }
    else if ((chave === 'VALOR FINANCIADO' || chave === 'VALOR DO EMPRESTIMO') && !valorFinanciadoLido) {
      dados.financedValue = valorBR(valor);
      valorFinanciadoLido = true;
      if (chave === 'VALOR DO EMPRESTIMO') dados.type = 'emprestimo';
    }
    else if (/^N.? ?DE MESES$/.test(chave)) dados.totalInstallments = inteiro(valor);
    else if (chave === 'VALOR DA PARCELA') {
      // 1ª ocorrência = parcela atual; 2ª = parcela reduzida
      if (parcelasLidas === 0) dados.currentInstallmentValue = valorBR(valor);
      else if (parcelasLidas === 1) dados.correctedInstallmentValue = valorBR(valor);
      parcelasLidas += 1;
    }
    else if (chave === 'QNT DE PAGAS' || chave === 'PARCELAS PAGAS') dados.paidInstallments = inteiro(valor);
    else if (chave === 'PARCELAS EM ATRASO') dados.delayedInstallments = inteiro(valor);
    else if (chave === 'REDUCAO POR PARCELA') reducaoPorParcela = valorBR(valor);
    else if (chave === 'ESTORNO') { dados.paidDifferenceRefund = valorBR(valor); dados.refundMode = 'estorno'; }
    else if (chave.startsWith('ABATIMENTO')) { dados.paidDifferenceRefund = valorBR(valor); dados.refundMode = 'abatimento'; }
    else {
      const ehChaveConhecida = CHAVES_NAO_TAXA.some((c) => chave.startsWith(c));
      const taxa = valor.match(VALOR_TAXA);
      if (!ehChaveConhecida && taxa) {
        const unitario = valorBR(taxa[1]);
        const mult = taxa[2] ? Number(taxa[2]) : 1;
        const total = taxa[3] ? valorBR(taxa[3]) : unitario;
        fees.push({
          id: gerarId(),
          name: chaveOriginal,
          value: centavos(total),
          description: mult > 1 ? descricaoMultiplicador(unitario, mult) : 'Cobrança indevida',
        });
      }
    }
  }

  if (!dados.correctedInstallmentValue && dados.currentInstallmentValue && reducaoPorParcela) {
    dados.correctedInstallmentValue = centavos(dados.currentInstallmentValue - reducaoPorParcela);
  }
  if (fees.length) dados.fees = fees;
  dados.type = dados.type ?? 'veiculo';
  dados.refundMode = dados.refundMode ?? 'estorno';

  if (!dados.clientName) avisos.push('Não encontrei o NOME do cliente no arquivo.');
  if (!dados.currentInstallmentValue) avisos.push('Não encontrei o VALOR DA PARCELA.');
  if (!fees.length) avisos.push('Nenhuma taxa encontrada no arquivo.');

  return { dados, avisos };
}
