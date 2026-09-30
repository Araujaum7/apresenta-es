export interface Fee {
  id: string;
  name: string;
  value: number;
  description: string;
}

export interface FormData {
  company: 'ativa' | 'alpha' | 'atitude';
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
  const totalRefund = totalFees + data.paidDifferenceRefund;
  
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
  const slide5DiscountLabel = isImovel ? 'Abatimento Total no Contrato' : 'Redução por Parcela';
  const slide5DiscountValue = isImovel ? `- ${formatCurrency(contractReduction)}` : `~ ${formatCurrency(installmentReduction)}`;
  const slide5Pill = isImovel ? '30% DE DESCONTO GLOBAL' : '30% DE DESCONTO';
  
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

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apresentação Financeira - ${data.clientName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0a0b10;
            --card-bg: #161824;
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
            background: radial-gradient(circle at 50% 50%, rgba(10,11,16,0.8) 0%, rgba(10,11,16,1) 100%);
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
            background: rgba(22, 24, 36, 0.7);
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
        <div class="content-wrapper flex-center" style="text-align: center;">
            <div class="logo-placeholder" style="position: absolute; top: 0; right: 0;">${companyLogo}</div>
            <div class="card" style="background: rgba(10, 11, 16, 0.85); width: 100%; max-width: 1400px; padding: 80px; border: 1px solid var(--accent-main); box-shadow: 0 0 80px ${boxshadowColorRgba};">
                <h2 class="subtitle">Valores a Receber e Economizar</h2>
                
                <h3 style="font-size: 40px; color: #fff; margin-top: 40px;">RESSARCIMENTO GERAL</h3>
                <p style="color: var(--text-dim); font-size: 20px;">(Taxas indevidas + Diferença das parcelas pagas)</p>
                <div class="huge-number">${formatCurrency(totalRefund)}${citeStr}</div>
                
                <div class="grid-2" style="margin-top: 60px; gap: 40px;">
                    <div style="border-right: 1px solid rgba(255,255,255,0.1); padding-right: 40px;">
                        <div class="data-label">Estorno da Diferença Paga</div>
                        <div class="data-value main" style="font-size: 50px;">${formatCurrency(data.paidDifferenceRefund)}</div>
                    </div>
                    <div style="padding-left: 40px;">
                        <div class="data-label">Redução Total do Contrato</div>
                        <div class="data-value main" style="font-size: 50px;">${formatCurrency(contractReduction)}${citeStr}</div>
                    </div>
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
