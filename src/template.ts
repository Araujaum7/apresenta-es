export interface Fee {
  id: string;
  name: string;
  value: number;
  description: string;
}

export interface FormData {
  company: 'ativa' | 'alpha' | 'atitude' | 'wolf';
  type: 'veiculo' | 'imovel' | 'emprestimo';
  imageUrl: string;
  
  clientName: string;
  cpf: string;
  contractNumber: string;
  institution: string;
  vehicle: string; // Used for "Veículo" or "Bem"
  financedValue: number;
  
  fees: Fee[];
  
  currentInstallmentValue: number;
  totalInstallments: number;
  
  correctedInstallmentValue: number;
  
  paidDifferenceRefund: number;
  /** estorno = devolvido ao cliente (soma no ressarcimento); abatimento = descontado nas parcelas (não soma) */
  refundMode: 'estorno' | 'abatimento';
  
  paidInstallments: number;
  delayedInstallments: number;
  
  protocolNumber: string;
  returnDate: string;
  citeCode: string;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const generateHTML = (data: FormData): string => {
  const isImovel = data.type === 'imovel';
  const isEmprestimo = data.type === 'emprestimo';
  
  const totalFees = data.fees.reduce((acc, fee) => acc + fee.value, 0);
  const currentTotal = data.currentInstallmentValue * data.totalInstallments;
  const correctedTotal = data.correctedInstallmentValue * data.totalInstallments;
  const installmentReduction = data.currentInstallmentValue - data.correctedInstallmentValue;
  const contractReduction = currentTotal - correctedTotal;
  const isAbatimento = data.refundMode === 'abatimento';
  const totalRefund = totalFees + (isAbatimento ? 0 : data.paidDifferenceRefund);
  const reductionPct = data.currentInstallmentValue > 0
    ? Math.round((installmentReduction / data.currentInstallmentValue) * 100)
    : 0;
  const paidDiffLabel = isAbatimento ? 'Abatimento nas Parcelas' : 'Estorno das Parcelas Pagas';
  const paidDiffTag = isAbatimento ? 'DESCONTADO NAS PRÓXIMAS PARCELAS' : 'DEVOLVIDO AO CLIENTE';
  const paidDiffDesc = isAbatimento
    ? `A diferença das ${data.paidInstallments} parcelas já pagas será abatida diretamente nas próximas parcelas.`
    : `Diferença cobrada a mais nas ${data.paidInstallments} parcelas já pagas, devolvida ao cliente.`;
  const refundCompositionText = isAbatimento
    ? 'Taxas indevidas a devolver (a diferença das parcelas pagas é abatida nas próximas parcelas)'
    : 'Taxas indevidas + estorno da diferença das parcelas pagas';
  
  const progressPercentage = data.totalInstallments > 0 
    ? ((data.paidInstallments / data.totalInstallments) * 100).toFixed(1) 
    : "0.0";
    
  // Format cite
  const citeStr = data.citeCode ? `[cite: ${data.citeCode}]` : "";

  // Fees HTML
  const feesHtml = data.fees.map(fee => {
    const calcWidth = Math.max(33, 100 / Math.ceil(data.fees.length));
    return `
                <div class="card card-red flex-center" style="flex-direction: column; text-align: center; padding: 30px 20px; width: calc(${calcWidth}% - 20px); min-width: 300px;">
                    <div class="data-label">${fee.name}</div>
                    <div class="data-value red" style="font-size: 32px;">${formatCurrency(fee.value)}</div>
                    <p style="color: var(--text-dim);">${fee.description}</p>
                </div>
    `;
  }).join('');

  // Company Specifics
  let companyLogo = '';
  let accentColorHex = '';
  let shadowColorRgba = '';
  let boxshadowColorRgba = '';
  let evolutionCardBgMain = '';
  let evolutionCardBgImovel = '';
  
  if (data.company === 'ativa') {
    companyLogo = 'ATIVA<span>SOLUÇÕES</span>';
    accentColorHex = isImovel ? '#a855f7' : '#7c3aed';
    shadowColorRgba = isImovel ? 'rgba(168, 85, 247, 0.4)' : 'rgba(124, 58, 237, 0.4)';
    boxshadowColorRgba = isImovel ? 'rgba(168, 85, 247, 0.15)' : 'rgba(124, 58, 237, 0.15)';
    evolutionCardBgMain = 'rgba(124, 58, 237, 0.1)';
    evolutionCardBgImovel = 'rgba(168, 85, 247, 0.1)';
  } else if (data.company === 'alpha') {
    companyLogo = 'ALPHA<span>EQUILÍBRIO</span>';
    accentColorHex = isImovel ? '#3b82f6' : '#2563eb'; // Blue shades
    shadowColorRgba = isImovel ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.4)';
    boxshadowColorRgba = isImovel ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.15)';
    evolutionCardBgMain = 'rgba(37, 99, 235, 0.1)';
    evolutionCardBgImovel = 'rgba(59, 130, 246, 0.1)';
  } else if (data.company === 'atitude') {
    companyLogo = 'ATITUDE<span>SOLUÇÕES</span>';
    accentColorHex = isImovel ? '#9ca3af' : '#6b7280'; // Gray/Silver shades
    shadowColorRgba = isImovel ? 'rgba(156, 163, 175, 0.4)' : 'rgba(107, 114, 128, 0.4)';
    boxshadowColorRgba = isImovel ? 'rgba(156, 163, 175, 0.15)' : 'rgba(107, 114, 128, 0.15)';
    evolutionCardBgMain = 'rgba(107, 114, 128, 0.1)';
    evolutionCardBgImovel = 'rgba(156, 163, 175, 0.1)';
  } else if (data.company === 'wolf') {
    companyLogo = '<span>WOLF</span>';
    accentColorHex = isImovel ? '#22d3ee' : '#06b6d4'; // Light Blue / Cyan shades
    shadowColorRgba = isImovel ? 'rgba(34, 211, 238, 0.4)' : 'rgba(6, 182, 212, 0.4)';
    boxshadowColorRgba = isImovel ? 'rgba(34, 211, 238, 0.15)' : 'rgba(6, 182, 212, 0.15)';
    evolutionCardBgMain = 'rgba(6, 182, 212, 0.1)';
    evolutionCardBgImovel = 'rgba(34, 211, 238, 0.1)';
  }

  // Evolution HTML logic
  const isDelayed = data.delayedInstallments > 0;
  const isZeroPaid = data.paidInstallments === 0;
  
  const evolutionCardClass = isDelayed ? 'card-red' : 'card-main';
  const evolutionCardBg = isDelayed ? 'rgba(255, 51, 102, 0.1)' : (isImovel ? evolutionCardBgImovel : evolutionCardBgMain);
  const evolutionTitleColor = isDelayed ? 'var(--accent-red)' : 'var(--accent-main)';
  const evolutionTitleText = isDelayed ? 'ATENÇÃO: PERFIL DE PAGAMENTO' : (isZeroPaid ? 'AÇÃO ESTRATÉGICA PREVENTIVA' : 'PERFIL DE PAGAMENTO');
  const evolutionStrongStyle = isDelayed ? 'color: var(--accent-red);' : '';
  
  let defaultSuccessText = 'O histórico de pagamentos fortalece nossa posição jurídica e administrativa para exigir a restituição dos valores abusivos cobrados durante o andamento do contrato.';
  if (isImovel) {
    defaultSuccessText = 'O histórico impecável de pagamentos fortalece nossa posição jurídica e administrativa para exigir a restituição dos valores abusivos de forma integral.';
  }

  const evolutionDescText = isDelayed 
    ? 'Identificamos parcelas em atraso. Nossa atuação revisional também servirá para barrar cobranças excessivas de mora e renegociar os débitos em aberto com as taxas corrigidas.' 
    : (isZeroPaid 
        ? 'Ao realizar a auditoria no início do contrato (antes do pagamento das parcelas), fortalecemos a posição jurídica para exigir o reajuste antes que o cliente sofra a onerosidade completa das taxas e juros abusivos.' 
        : defaultSuccessText);

  // Styling and labels based on Type
  const vehicleLabel = isImovel ? 'Bem Financiado' : isEmprestimo ? 'Detalhes do Empréstimo' : 'Veículo Financiado';
  const valueLabel = isImovel ? 'Valor Base Financiado' : isEmprestimo ? 'Valor do Empréstimo' : 'Valor Financiado';
  
  const slide5Title = isImovel ? 'Projeção e Desconto Global' : 'Projeção e Desconto por Parcela';
  const slide5DiscountLabel = isImovel ? 'Redução Total no Contrato' : 'Redução por Parcela';
  const slide5DiscountValue = isImovel ? `- ${formatCurrency(contractReduction)}` : `~ ${formatCurrency(installmentReduction)}`;
  const slide5Pill = isImovel ? `${reductionPct}% DE DESCONTO GLOBAL` : `${reductionPct}% DE DESCONTO`;
  
  const slide7Title = isImovel ? 'Evolução do Contrato (Longo Prazo)' : 'Evolução do Contrato';

  let bgImageUrl = '';
  if (data.imageUrl) {
    bgImageUrl = data.imageUrl;
  } else {
    bgImageUrl = isImovel 
      ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' 
      : isEmprestimo
        ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        : 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop';
  }

  const isWolf = data.company === 'wolf';
  const bgDarkHex = isWolf ? '#000000' : '#0a0b10';
  const cardBgHex = isWolf ? '#0a0d12' : '#161824';
  const cardSurfaceRgba = isWolf ? 'rgba(10, 13, 18, 0.8)' : 'rgba(22, 24, 36, 0.7)';
  const slideOverlayGradient = isWolf
    ? 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 1) 100%)'
    : 'radial-gradient(circle at 50% 50%, rgba(10,11,16,0.8) 0%, rgba(10,11,16,1) 100%)';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apresentação Financeira - ${data.clientName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: ${bgDarkHex};
            --card-bg: ${cardBgHex};
            --accent-main: ${accentColorHex}; 
            --accent-red: #ff3366;
            --text-light: #f0f0f5;
            --text-dim: #8a8d9e;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-light);
            overflow-x: hidden;
        }
        .slide {
            width: 1920px;
            height: 1080px;
            box-sizing: border-box;
            padding: 80px 120px;
            position: relative;
            background-size: cover;
            background-position: center;
            border-bottom: 2px solid #222;
            display: flex;
            flex-direction: column;
            page-break-after: always;
        }
        .slide::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: ${slideOverlayGradient};
            z-index: 1;
        }
        .content-wrapper {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        h1, h2, h3 {
            font-family: 'Montserrat', sans-serif;
            margin: 0;
        }
        .title-main {
            font-size: 80px;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 20px;
            background: linear-gradient(90deg, #fff, var(--text-dim));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            font-size: 32px;
            color: var(--accent-main);
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .slide-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 60px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 30px;
        }
        .slide-title {
            font-size: 48px;
            color: #fff;
        }
        .logo-placeholder {
            font-family: 'Montserrat', sans-serif;
            font-size: 28px;
            font-weight: 900;
            color: var(--text-dim);
            letter-spacing: 4px;
        }
        .logo-placeholder span { color: var(--accent-main); }
        
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            flex: 1;
        }
        .card {
            background: ${cardSurfaceRgba};
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            padding: 50px;
            backdrop-filter: blur(10px);
        }
        .card-main { border-top: 4px solid var(--accent-main); }
        .card-red { border-top: 4px solid var(--accent-red); }

        .data-label {
            font-size: 18px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .data-value {
            font-size: 36px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 30px;
        }
        .data-value.main { color: var(--accent-main); font-size: 48px;}
        .data-value.red { color: var(--accent-red); font-size: 48px;}
        
        .huge-number {
            font-family: 'Montserrat', sans-serif;
            font-size: 140px;
            font-weight: 900;
            color: var(--accent-main);
            text-shadow: 0 0 40px ${shadowColorRgba};
            line-height: 1;
            margin: 20px 0;
        }
        
        .progress-circle {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: conic-gradient(var(--accent-main) ${progressPercentage}%, #222 ${progressPercentage}%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }
        .progress-inner {
            width: 260px;
            height: 260px;
            background: var(--card-bg);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .progress-inner span { font-size: 64px; font-weight: 900; color: #fff; }
        .progress-inner p { color: var(--text-dim); font-size: 20px; margin: 0; }
        
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .mt-auto { margin-top: auto; }
        
        .car-image {
            width: 100%;
            height: 350px;
            background: url('${bgImageUrl}') center/cover no-repeat;
            border-radius: 16px;
            margin-bottom: 30px;
            background-color: #fff;
            box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
        }
        /* SLIDE 6 — destaque dos valores */
        .result-hero {
            position: relative;
            text-align: center;
            padding: 56px 60px 60px;
            border-radius: 32px;
            background:
                radial-gradient(900px 320px at 50% 0%, ${boxshadowColorRgba.replace('0.15', '0.35')}, transparent 70%),
                rgba(10, 11, 16, 0.88);
            border: 2px solid var(--accent-main);
            box-shadow: 0 0 120px ${boxshadowColorRgba}, inset 0 1px 0 rgba(255,255,255,0.08);
            overflow: hidden;
        }
        .result-kicker {
            display: inline-block;
            padding: 10px 28px;
            border-radius: 50px;
            background: var(--accent-main);
            color: #fff;
            font-weight: 800;
            font-size: 24px;
            letter-spacing: 3px;
        }
        .result-hero .huge-number {
            font-size: 170px;
            letter-spacing: -4px;
            margin: 26px 0 14px;
            color: #fff;
            text-shadow: 0 0 60px ${shadowColorRgba}, 0 0 4px rgba(255,255,255,0.4);
        }
        .result-hero p { color: var(--text-dim); font-size: 26px; margin: 8px 0 0; }
        .result-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 40px;
            flex: 1;
        }
        .result-card {
            position: relative;
            padding: 44px 48px;
            border-radius: 28px;
            background: rgba(10, 11, 16, 0.85);
            border: 1px solid rgba(255,255,255,0.08);
            border-left: 10px solid var(--accent-main);
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .result-card.is-abatimento { border-left-color: #f59e0b; }
        .result-card.is-abatimento .result-value { color: #fbbf24; text-shadow: 0 0 40px rgba(245, 158, 11, 0.35); }
        .result-card.is-abatimento .result-tag { color: #fbbf24; border-color: rgba(251, 191, 36, 0.5); background: rgba(245, 158, 11, 0.12); }
        .result-label {
            font-family: 'Montserrat', sans-serif;
            font-size: 30px;
            font-weight: 900;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .result-tag {
            display: inline-block;
            align-self: flex-start;
            margin-top: 14px;
            padding: 7px 18px;
            border-radius: 50px;
            border: 1px solid ${shadowColorRgba};
            background: ${boxshadowColorRgba};
            color: var(--accent-main);
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 1.5px;
        }
        .result-value {
            font-family: 'Montserrat', sans-serif;
            font-size: 96px;
            font-weight: 900;
            line-height: 1;
            letter-spacing: -2px;
            margin: 26px 0 18px;
            color: var(--accent-main);
            text-shadow: 0 0 40px ${shadowColorRgba};
            white-space: nowrap;
        }
        .result-desc { font-size: 23px; color: var(--text-dim); margin: 0; line-height: 1.45; }
        .result-desc strong { color: #fff; }
        .finance-bg {
            background: url('https://images.unsplash.com/photo-1640340434855-6084b1f4901c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover;
        }
    </style>
</head>
<body>

    <!-- SLIDE 1: CAPA -->
    <div class="slide">
        <div class="content-wrapper flex-center" style="text-align: center;">
            <div class="logo-placeholder" style="font-size: 60px; margin-bottom: 40px;">${companyLogo}</div>
            <h2 class="subtitle">Auditoria de Contrato de Financiamento</h2>
            <h1 class="title-main" style="margin-top: 40px;">${data.clientName}${citeStr}</h1>
            <p style="font-size: 30px; color: var(--text-dim); margin-top: 30px;">Relatório Executivo de Oportunidade Financeira</p>
        </div>
    </div>

    <!-- SLIDE 2: DADOS DO CLIENTE -->
    <div class="slide">
        <div class="content-wrapper">
            <div class="slide-header">
                <h2 class="slide-title">Perfil do Contrato</h2>
                <div class="logo-placeholder">${companyLogo}</div>
            </div>
            <div class="grid-2">
                <div class="card">
                    <div class="data-label">Cliente</div>
                    <div class="data-value">${data.clientName}${citeStr}</div>
                    
                    <div class="data-label">CPF</div>
                    <div class="data-value">${data.cpf}${citeStr}</div>
                    
                    <div class="data-label">Nº do Contrato</div>
                    <div class="data-value">${data.contractNumber || 'Sob Consulta'}</div>
                    
                    <div class="data-label">Instituição Financeira</div>
                    <div class="data-value">${data.institution}${citeStr}</div>
                </div>
                <div class="card card-main">
                    <div class="car-image"></div>
                    <div class="data-label">${vehicleLabel}</div>
                    <div class="data-value">${data.vehicle}</div>
                    
                    <div class="data-label">${valueLabel}</div>
                    <div class="data-value">${formatCurrency(data.financedValue)}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- SLIDE 3: FUNDAMENTAÇÃO -->
    <div class="slide">
        <div class="content-wrapper flex-center" style="text-align: center;">
            <div class="logo-placeholder" style="position: absolute; top: 0; right: 0;">${companyLogo}</div>
            <h2 class="subtitle" style="margin-bottom: 40px;">Parecer Analítico</h2>
            <h1 class="title-main" style="font-size: 70px; line-height: 1.3; max-width: 1400px;">
                Nossa auditoria identifica que a instituição aplicou taxa que supera a média aceitável, caracterizando abusividade que onera o valor total pago.${citeStr}
            </h1>
        </div>
    </div>

    <!-- SLIDE 4: TARIFAS DE CONTRATO -->
    <div class="slide">
        <div class="content-wrapper">
            <div class="slide-header">
                <h2 class="slide-title">Cobranças Indevidas</h2>
                <div class="logo-placeholder">${companyLogo}</div>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 30px; margin-bottom: 20px;">
                ${feesHtml}
            </div>
            
            <div class="card flex-center mt-auto" style="background: rgba(255, 51, 102, 0.1); border-color: var(--accent-red); padding: 30px;">
                <h2 style="font-size: 40px; color: #fff;">TOTAL DE TAXAS INDEVIDAS: <span style="color: var(--accent-red);">${formatCurrency(totalFees)}</span></h2>
            </div>
        </div>
    </div>

    <!-- SLIDE 5: COMPARATIVO -->
    <div class="slide">
        <div class="content-wrapper">
            <div class="slide-header">
                <h2 class="slide-title">${slide5Title}</h2>
                <div class="logo-placeholder">${companyLogo}</div>
            </div>
            <div class="grid-2">
                <div class="card card-red ${isImovel ? 'flex-center' : ''}" style="${isImovel ? 'flex-direction: column; text-align: center;' : ''}">
                    <div class="subtitle" style="color: var(--accent-red); margin-bottom: ${isImovel ? '40px' : '20px'};">Cenário Atual</div>
                    <div class="data-label">Valor Atual da Parcela</div>
                    <div class="data-value" style="font-size: 60px;">${formatCurrency(data.currentInstallmentValue)}</div>
                    <div class="data-label">Projeção Final do Contrato (${data.totalInstallments}x)</div>
                    <div class="data-value" ${isImovel ? 'style="font-size: 70px;"' : ''}>${formatCurrency(currentTotal)}</div>
                    ${isImovel ? '<p style="color: var(--text-dim); max-width: 80%;">Valor total a ser pago ao final do período, com a incidência das taxas e juros atuais.</p>' : ''}
                </div>
                <div class="card card-main ${isImovel ? 'flex-center' : ''}" style="${isImovel ? 'flex-direction: column; text-align: center;' : ''}">
                    <div class="subtitle" style="color: var(--accent-main); margin-bottom: ${isImovel ? '40px' : '20px'};">Cenário Corrigido (Justo)</div>
                    <div class="data-label">Novo Valor da Parcela</div>
                    <div class="data-value main" style="font-size: 60px;">${formatCurrency(data.correctedInstallmentValue)}</div>
                    <div class="data-label">${isImovel ? 'Projeção Final Corrigida' : `Projeção Final Corrigida (${data.totalInstallments}x)`}</div>
                    <div class="data-value ${isImovel ? 'main' : ''}" ${isImovel ? 'style="font-size: 70px;"' : ''}>${formatCurrency(correctedTotal)}</div>
                    ${isImovel ? '<p style="color: var(--text-dim); max-width: 80%;">Valor total após a reestruturação e exclusão das abusividades.</p>' : ''}
                </div>
            </div>
            <div class="card card-main flex-center" style="margin-top: 40px; text-align: center; background: ${isImovel ? evolutionCardBgImovel : evolutionCardBgMain};">
                <div>
                    <h3 style="font-size: 30px; color: var(--text-dim); font-weight: 400;">${slide5DiscountLabel}</h3>
                    <h2 style="font-size: 60px; color: var(--accent-main); margin: 10px 0;">${slide5DiscountValue}</h2>
                    <div style="display: inline-block; padding: 10px 30px; background: var(--accent-main); color: #fff; border-radius: 50px; font-weight: 800; font-size: 24px;">${slide5Pill}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- SLIDE 6: DESTAQUE FINANCEIRO (HERO) -->
    <div class="slide finance-bg">
        <div class="content-wrapper">
            <div class="slide-header" style="margin-bottom: 40px;">
                <h2 class="slide-title">Resultado da Revisão</h2>
                <div class="logo-placeholder">${companyLogo}</div>
            </div>

            <div class="result-hero">
                <div class="result-kicker">RESSARCIMENTO GERAL</div>
                <div class="huge-number">${formatCurrency(totalRefund)}${citeStr}</div>
                <p>${refundCompositionText}</p>
            </div>

            <div class="result-grid">
                <div class="result-card${isAbatimento ? ' is-abatimento' : ''}">
                    <div class="result-label">${paidDiffLabel}</div>
                    <div class="result-tag">${paidDiffTag}</div>
                    <div class="result-value">${formatCurrency(data.paidDifferenceRefund)}</div>
                    <p class="result-desc">${paidDiffDesc}</p>
                </div>
                <div class="result-card">
                    <div class="result-label">Redução Total do Contrato</div>
                    <div class="result-tag">ECONOMIA ATÉ O FIM DO CONTRATO</div>
                    <div class="result-value">${formatCurrency(contractReduction)}${citeStr}</div>
                    <p class="result-desc"><strong>${formatCurrency(installmentReduction)}</strong> a menos por parcela × <strong>${data.totalInstallments}</strong> parcelas (${reductionPct}% de redução).</p>
                </div>
            </div>
        </div>
    </div>

    <!-- SLIDE 7: EVOLUÇÃO -->
    <div class="slide">
        <div class="content-wrapper">
            <div class="slide-header">
                <h2 class="slide-title">${slide7Title}</h2>
                <div class="logo-placeholder">${companyLogo}</div>
            </div>
            <div class="grid-2" style="align-items: center;">
                <div class="card" style="text-align: center; padding: 80px 40px;">
                    <div class="progress-circle">
                        <div class="progress-inner">
                            <span>${isImovel ? data.paidInstallments : String(data.paidInstallments).padStart(2, '0')}</span>
                            <p>de ${data.totalInstallments} Pagas</p>
                        </div>
                    </div>
                    <h3 style="font-size: 24px; color: #fff; margin-top: 40px;">Progresso Atual: ${progressPercentage.replace('.', ',')}%</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 40px;">
                    <div class="card ${evolutionCardClass}" style="background: ${evolutionCardBg};">
                        <h3 style="font-size: 32px; color: ${evolutionTitleColor}; margin-bottom: 15px;">${evolutionTitleText}</h3>
                        <p style="font-size: 24px; color: #fff; margin: 0;">Parcelas em Atraso: <strong style="${evolutionStrongStyle}">${data.delayedInstallments > 0 ? data.delayedInstallments : '0 (Zero)'}</strong></p>
                        <p style="font-size: 18px; color: var(--text-dim); margin-top: 15px;">${evolutionDescText}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- SLIDE 8: STATUS -->
    <div class="slide">
        <div class="content-wrapper flex-center">
            <div class="logo-placeholder" style="position: absolute; top: 0; right: 0;">${companyLogo}</div>
            <div class="card card-main" style="width: 100%; max-width: 1200px; padding: 80px; text-align: center;">
                <h2 class="subtitle">Acompanhamento da Solicitação</h2>
                <h1 class="title-main" style="font-size: 60px; margin: 30px 0;">Status da Análise</h1>
                
                <div style="background: rgba(255,255,255,0.05); border-radius: 16px; padding: 40px; margin: 40px 0; text-align: left;">
                    <div class="data-label">Protocolo Registrado</div>
                    <div class="data-value" style="font-size: 40px; color: var(--accent-main); font-family: monospace;">${data.protocolNumber}${citeStr}</div>
                    
                    <div class="data-label" style="margin-top: 30px;">Data de Retorno</div>
                    <div class="data-value" style="font-size: 40px; color: #fff;">${data.returnDate}${citeStr}</div>
                </div>
                
                <p style="font-size: 22px; color: var(--text-dim); line-height: 1.6;">
                    Nossa assessoria atua nas tratativas buscando a revisão e o estorno dos valores excedentes apontados.
                </p>
            </div>
        </div>
    </div>

</body>
</html>`;
}
