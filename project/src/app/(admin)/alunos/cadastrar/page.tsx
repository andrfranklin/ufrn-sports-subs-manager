"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import Form from "@/components/form/Form";
import InputField from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateCPF(cpf: string) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}
function validateTelefone(tel: string) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(tel);
}

export default function CadastrarAlunoPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [fields, setFields] = useState({
    name: "",
    email: "",
    cpf: "",
    telephone: "",
    birthdate: "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  }

  function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCPF(e.target.value);
    setFields((f) => ({ ...f, cpf: formatted }));
    setErrors((err) => ({ ...err, cpf: "" }));
  }

  function handleTelefoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatTelefone(e.target.value);
    setFields((f) => ({ ...f, telephone: formatted }));
    setErrors((err) => ({ ...err, telephone: "" }));
  }

  function handleDateChange(selectedDates: Date[]) {
    setFields((f) => ({ ...f, birthdate: selectedDates[0]?.toISOString().slice(0, 10) || "" }));
    setErrors((err) => ({ ...err, birthdate: "" }));
  }

  function formatCPF(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  function formatTelefone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  async function handleSubmit() {
    const newErrors: { [k: string]: string } = {};
    if (!fields.name) newErrors.name = "Nome é obrigatório.";
    if (!fields.email) newErrors.email = "Email é obrigatório.";
    else if (!validateEmail(fields.email)) newErrors.email = "Email inválido.";
    if (!fields.cpf) newErrors.cpf = "CPF é obrigatório.";
    else if (!validateCPF(fields.cpf)) newErrors.cpf = "CPF deve estar no formato 000.000.000-00.";
    if (!fields.telephone) newErrors.telephone = "Telefone é obrigatório.";
    else if (!validateTelefone(fields.telephone)) newErrors.telephone = "Telefone deve estar no formato (99) 99999-9999.";
    if (!fields.birthdate) newErrors.birthdate = "Data de nascimento é obrigatória.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (res.ok) {
      showToast({ type: "success", title: "Sucesso", message: "Aluno cadastrado com sucesso!" });
      setFields({ name: "", email: "", cpf: "", telephone: "", birthdate: "" });
      document.querySelectorAll('input').forEach(input => input.value = "");
    } else {
      const { error } = await res.json();
      showToast({ type: "error", title: "Erro", message: error || "Erro ao cadastrar aluno." });
    }
    setLoading(false);
  }

  return (
    <ComponentCard title="Cadastrar Aluno">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Nome</Label>
            <InputField
              id="name"
              name="name"
              defaultValue={fields.name}
              onChange={handleFieldChange}
              placeholder="Nome completo"
              error={!!errors.name}
              hint={errors.name}
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <InputField
                id="email"
                name="email"
                type="email"
                defaultValue={fields.email}
                onChange={handleFieldChange}
                placeholder="email@exemplo.com"
                error={!!errors.email}
                hint={errors.email}
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <InputField
                id="cpf"
                name="cpf"
                value={fields.cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                error={!!errors.cpf}
                hint={errors.cpf}
              />
            </div>
            <div>
              <Label htmlFor="telephone">Telefone</Label>
              <InputField
                id="telephone"
                name="telephone"
                value={fields.telephone}
                onChange={handleTelefoneChange}
                placeholder="(99) 99999-9999"
                error={!!errors.telephone}
                hint={errors.telephone}
              />
            </div>
            <div>
              <DatePicker
                id="birthdate"
                label="Data de Nascimento"
                mode="single"
                onChange={dates => handleDateChange(dates as Date[])}
                placeholder="Selecione a data"
                defaultDate={fields.birthdate || undefined}
              />
              {errors.birthdate && (
                <p className="mt-1.5 text-xs text-error-500">{errors.birthdate}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </Form>
      </div>
    </ComponentCard>
  );
}