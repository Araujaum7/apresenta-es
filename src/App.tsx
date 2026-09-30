import {
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  Activity,
  Banknote,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Download,
  House,
  Image as ImageIcon,
  Plus,
  Trash2,
} from 'lucide-react';
import { type FormData, type Fee, generateHTML } from './template';
import './App.css';

const generateId = () => Math.random().toString(36).slice(2, 11);

const parseCurrency = (value: string) => {
  const normalizedValue = value.replace(/\D/g, '');
  return normalizedValue ? Number(normalizedValue) / 100 : 0;
};

const formatCurrencyInput = (value: number) => {
  if (value === 0) return '';

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const COMPANY_OPTIONS = [
  { value: 'ativa', label: 'Ativa Soluções', accent: '#8b5cf6' },
  { value: 'alpha', label: 'Alpha Equilíbrio', accent: '#3b82f6' },
  { value: 'atitude', label: 'Atitude Soluções', accent: '#64748b' },
] as const;

const CONTRACT_OPTIONS = [
  { value: 'veiculo', label: 'Veículo', icon: Car },
  { value: 'imovel', label: 'Imóvel', icon: House },
  { value: 'emprestimo', label: 'Empréstimo', icon: Banknote },
] as const;

const INITIAL_FEE: Fee = {
  id: generateId(),
  name: '',
  value: 0,
  description: '',
};

type FieldProps = {
  label: string;
  optional?: string;
  wide?: boolean;
  children: ReactNode;
};

function Field({ label, optional, wide, children }: FieldProps) {
  return (
    <div className={wide ? 'field field--wide' : 'field'}>
      <label className="field-label">
        {label}
        {optional && <span>{optional}</span>}
      </label>
      {children}
    </div>
  );
}

type StepHeaderProps = {
  step: number;
  title: string;
  description: string;
};

function StepHeader({ step, title, description }: StepHeaderProps) {
  return (
    <div className="step-header">
      <span className="step-number" aria-hidden="true">
        {step}
      </span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    company: 'ativa',
    type: 'veiculo',
    imageUrl: '',
    clientName: '',
    cpf: '',
    contractNumber: '',
    institution: '',
    vehicle: '',
    financedValue: 0,
    fees: [{ ...INITIAL_FEE }],
    currentInstallmentValue: 0,
    totalInstallments: 48,
    correctedInstallmentValue: 0,
    paidDifferenceRefund: 0,
    paidInstallments: 0,
    delayedInstallments: 0,
    protocolNumber: '',
    returnDate: '',
    citeCode: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    const currencyFields = [
      'financedValue',
      'currentInstallmentValue',
      'correctedInstallmentValue',
      'paidDifferenceRefund',
    ];

    let parsedValue: string | number = value;

    if (currencyFields.includes(name)) {
      parsedValue = parseCurrency(value);
    } else if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: parsedValue,
    }));
  };

  const handleFeeChange = (
    id: string,
    field: keyof Fee,
    value: string | number,
  ) => {
    setFormData((previousData) => ({
      ...previousData,
      fees: previousData.fees.map((fee) =>
        fee.id === id ? { ...fee, [field]: value } : fee,
      ),
    }));
  };

  const addFee = () => {
    setFormData((previousData) => ({
      ...previousData,
      fees: [
        ...previousData.fees,
        { id: generateId(), name: '', value: 0, description: '' },
      ],
    }));
  };

  const removeFee = (id: string) => {
    setFormData((previousData) => ({
      ...previousData,
      fees: previousData.fees.filter((fee) => fee.id !== id),
    }));
  };

  const handleDownload = () => {
    const html = generateHTML(formData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `Apresentacao_${formData.clientName.replace(/\s+/g, '_') || 'Financeira'}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const selectedCompany =
    COMPANY_OPTIONS.find((company) => company.value === formData.company) ??
    COMPANY_OPTIONS[0];
  const selectedContract =
    CONTRACT_OPTIONS.find((contract) => contract.value === formData.type) ??
    CONTRACT_OPTIONS[0];

  const totalFees = formData.fees.reduce(
    (accumulator, fee) => accumulator + fee.value,
    0,
  );
  const installmentReduction =
    formData.currentInstallmentValue - formData.correctedInstallmentValue;
  const contractReduction = installmentReduction * formData.totalInstallments;
  const totalRefund = totalFees + formData.paidDifferenceRefund;

  const assetTitle =
    formData.type === 'imovel'
      ? 'Imóvel financiado'
      : formData.type === 'emprestimo'
        ? 'Descrição do empréstimo'
        : 'Veículo financiado';
  const assetPlaceholder =
    formData.type === 'imovel'
      ? 'Ex: Apartamento residencial'
      : formData.type === 'emprestimo'
        ? 'Ex: Empréstimo pessoal consignado'
        : 'Ex: Hyundai HB20 2018';
  const financedValueLabel =
    formData.type === 'emprestimo'
      ? 'Valor do empréstimo'
      : 'Valor financiado';

  const shellStyle = {
    '--company-accent': selectedCompany.accent,
  } as CSSProperties;

  return (
    <div className="app-shell" style={shellStyle}>
      <header className="app-header">
        <div className="brand">
          <Activity size={30} aria-hidden="true" />
          <strong>
            AJ<span>SLIDES</span>
          </strong>
        </div>
        <div className="header-status">
          <span className="status-dot" aria-hidden="true" />
          Nova apresentação
        </div>
      </header>

      <main className="page-content">
        <div className="workspace-grid">
          <div className="workflow-column">
            <section className="context-grid" aria-label="Contexto da apresentação">
              <div className="surface-card context-card">
                <div className="card-heading">
                  <h2>Operação</h2>
                  <p>Selecione a empresa atuante</p>
                </div>

                <div className="company-options">
                  {COMPANY_OPTIONS.map((company) => {
                    const isSelected = formData.company === company.value;
                    const optionStyle = {
                      '--option-accent': company.accent,
                    } as CSSProperties;

                    return (
                      <button
                        key={company.value}
                        type="button"
                        className={`company-option${isSelected ? ' is-selected' : ''}`}
                        style={optionStyle}
                        aria-pressed={isSelected}
                        onClick={() =>
                          setFormData((previousData) => ({
                            ...previousData,
                            company: company.value,
                          }))
                        }
                      >
                        <span className="option-icon" aria-hidden="true">
                          <Building2 size={16} />
                        </span>
                        <span>{company.label}</span>
                        {isSelected && (
                          <CheckCircle2
                            className="option-check"
                            size={19}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="surface-card context-card">
                <div className="card-heading">
                  <h2>Tipo de contrato</h2>
                  <p>Define as opções do formulário</p>
                </div>

                <div className="contract-options">
                  {CONTRACT_OPTIONS.map((contract) => {
                    const isSelected = formData.type === contract.value;
                    const Icon = contract.icon;

                    return (
                      <button
                        key={contract.value}
                        type="button"
                        className={`contract-option${isSelected ? ' is-selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() =>
                          setFormData((previousData) => ({
                            ...previousData,
                            type: contract.value,
                          }))
                        }
                      >
                        <Icon size={23} aria-hidden="true" />
                        <span>{contract.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="surface-card step-card">
              <StepHeader
                step={1}
                title="Cliente e contrato"
                description="Identificação básica para o cabeçalho da apresentação."
              />

              <div className="form-grid">
                <Field label="Nome do cliente">
                  <input
                    className="field-input"
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Ex: Maria das Graças"
                  />
                </Field>
                <Field label="CPF">
                  <input
                    className="field-input"
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                  />
                </Field>
                <Field label="Nº do contrato" optional="(Opcional)">
                  <input
                    className="field-input"
                    type="text"
                    name="contractNumber"
                    value={formData.contractNumber}
                    onChange={handleChange}
                    placeholder="Em branco para ‘Sob consulta’"
                  />
                </Field>
                <Field label="Instituição financeira">
                  <input
                    className="field-input"
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="Ex: Banco Pan S.A."
                  />
                </Field>
                <Field label="Código de citação" optional="(Opcional)" wide>
                  <input
                    className="field-input"
                    type="text"
                    name="citeCode"
                    value={formData.citeCode}
                    onChange={handleChange}
                    placeholder="Ex: 19 (gera [cite: 19])"
                  />
                </Field>
              </div>
            </section>

            <section className="surface-card step-card">
              <StepHeader
                step={2}
                title="Bem e valores"
                description="Dados do financiamento e cálculo das parcelas."
              />

              <div className="form-grid">
                <Field
                  label="URL da imagem customizada"
                  optional="(Opcional)"
                  wide
                >
                  <div className="field-control field-control--icon">
                    <ImageIcon size={17} aria-hidden="true" />
                    <input
                      className="field-input"
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </Field>

                <Field label={assetTitle} wide>
                  <input
                    className="field-input"
                    type="text"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    placeholder={assetPlaceholder}
                  />
                </Field>

                <Field label={financedValueLabel}>
                  <div className="field-control field-control--prefix">
                    <span>R$</span>
                    <input
                      className="field-input"
                      type="text"
                      name="financedValue"
                      value={formatCurrencyInput(formData.financedValue)}
                      onChange={handleChange}
                      inputMode="decimal"
                      placeholder="0,00"
                    />
                  </div>
                </Field>
                <Field label="Total de parcelas (meses)">
                  <input
                    className="field-input"
                    type="number"
                    min="0"
                    name="totalInstallments"
                    value={formData.totalInstallments || ''}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Valor atual da parcela">
                  <div className="field-control field-control--prefix">
                    <span>R$</span>
                    <input
                      className="field-input"
                      type="text"
                      name="currentInstallmentValue"
                      value={formatCurrencyInput(
                        formData.currentInstallmentValue,
                      )}
                      onChange={handleChange}
                      inputMode="decimal"
                      placeholder="0,00"
                    />
                  </div>
                </Field>
                <Field label="Novo valor justo">
                  <div className="field-control field-control--prefix">
                    <span>R$</span>
                    <input
                      className="field-input"
                      type="text"
                      name="correctedInstallmentValue"
                      value={formatCurrencyInput(
                        formData.correctedInstallmentValue,
                      )}
                      onChange={handleChange}
                      inputMode="decimal"
                      placeholder="0,00"
                    />
                  </div>
                </Field>
                <Field label="Parcelas pagas">
                  <input
                    className="field-input"
                    type="number"
                    min="0"
                    name="paidInstallments"
                    value={formData.paidInstallments}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Parcelas em atraso">
                  <input
                    className="field-input"
                    type="number"
                    min="0"
                    name="delayedInstallments"
                    value={formData.delayedInstallments}
                    onChange={handleChange}
                  />
                </Field>
              </div>
            </section>

            <section className="surface-card step-card">
              <StepHeader
                step={3}
                title="Cobranças indevidas"
                description="Adicione taxas embutidas no contrato original."
              />

              <div className="fee-list">
                {formData.fees.map((fee, index) => (
                  <div className="fee-row" key={fee.id}>
                    <div className="fee-cell fee-cell--name">
                      <span className="fee-cell-label">Tarifa {index + 1}</span>
                      <input
                        type="text"
                        value={fee.name}
                        aria-label={`Nome da tarifa ${index + 1}`}
                        onChange={(event) =>
                          handleFeeChange(fee.id, 'name', event.target.value)
                        }
                        placeholder="Ex: Registro de contrato"
                      />
                    </div>
                    <div className="fee-cell fee-cell--value">
                      <span className="currency-prefix">R$</span>
                      <input
                        type="text"
                        value={formatCurrencyInput(fee.value)}
                        aria-label={`Valor da tarifa ${index + 1}`}
                        inputMode="decimal"
                        onChange={(event) =>
                          handleFeeChange(
                            fee.id,
                            'value',
                            parseCurrency(event.target.value),
                          )
                        }
                        placeholder="0,00"
                      />
                    </div>
                    <div className="fee-cell fee-cell--description">
                      <input
                        type="text"
                        value={fee.description}
                        aria-label={`Descrição da tarifa ${index + 1}`}
                        onChange={(event) =>
                          handleFeeChange(
                            fee.id,
                            'description',
                            event.target.value,
                          )
                        }
                        placeholder="Ex: Custas repassadas"
                      />
                    </div>
                    <div className="fee-action">
                      <button
                        type="button"
                        onClick={() => removeFee(fee.id)}
                        aria-label={`Remover tarifa ${index + 1}`}
                        title="Remover tarifa"
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="add-fee-button" type="button" onClick={addFee}>
                <Plus size={18} aria-hidden="true" />
                Adicionar nova tarifa
              </button>
            </section>

            <section className="surface-card step-card">
              <StepHeader
                step={4}
                title="Estorno e acompanhamento"
                description="Dados complementares para finalização e pós-venda."
              />

              <div className="form-grid">
                <Field
                  label="Estorno da diferença paga"
                  optional="(Se houver)"
                  wide
                >
                  <div className="field-control field-control--prefix">
                    <span>R$</span>
                    <input
                      className="field-input"
                      type="text"
                      name="paidDifferenceRefund"
                      value={formatCurrencyInput(
                        formData.paidDifferenceRefund,
                      )}
                      onChange={handleChange}
                      inputMode="decimal"
                      placeholder="0,00"
                    />
                  </div>
                </Field>
                <Field label="Protocolo registrado">
                  <input
                    className="field-input"
                    type="text"
                    name="protocolNumber"
                    value={formData.protocolNumber}
                    onChange={handleChange}
                    placeholder="Ex: 2026.09/00016379392"
                  />
                </Field>
                <Field label="Data de retorno">
                  <div className="field-control field-control--icon">
                    <CalendarDays size={17} aria-hidden="true" />
                    <input
                      className="field-input"
                      type="text"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      placeholder="Ex: 16 de setembro"
                    />
                  </div>
                </Field>
              </div>
            </section>
          </div>

          <aside className="summary-column" aria-label="Resumo financeiro">
            <div className="summary-card">
              <div className="context-chips">
                <span className="context-chip context-chip--company">
                  {selectedCompany.label}
                </span>
                <span className="context-chip">{selectedContract.label}</span>
              </div>

              <div className="summary-heading">
                <h2>Impacto estimado</h2>
                <p>Resumo financeiro a ser apresentado.</p>
              </div>

              <dl className="summary-list">
                <div>
                  <dt>Taxas indevidas</dt>
                  <dd>{formatBRL(totalFees)}</dd>
                </div>
                <div>
                  <dt>Estorno de diferença</dt>
                  <dd>{formatBRL(formData.paidDifferenceRefund)}</dd>
                </div>
                <div>
                  <dt>Redução por parcela</dt>
                  <dd className="positive-value">
                    {formatBRL(installmentReduction)}
                  </dd>
                </div>
                <div>
                  <dt>Redução total</dt>
                  <dd className="positive-value">
                    {formatBRL(contractReduction)}
                  </dd>
                </div>
              </dl>

              <div className="hero-metric">
                <span>Ressarcimento geral</span>
                <strong>{formatBRL(totalRefund)}</strong>
              </div>

              <div className="export-area">
                <p>Revise os valores acima antes de gerar o HTML.</p>
                <button type="button" onClick={handleDownload}>
                  <Download size={20} aria-hidden="true" />
                  Exportar apresentação
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
