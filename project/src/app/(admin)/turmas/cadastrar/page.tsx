"use client";
import { useState, useEffect, useRef } from "react";
import Form from "@/components/form/Form";
import InputField from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import DatePicker from "@/components/form/date-picker";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { ChangeEvent } from "react";
import FileInput from '@/components/form/input/FileInput';
import ComponentCard from "@/components/common/ComponentCard";

const diasSemana = [
  { value: "monday", label: "Segunda" },
  { value: "tuesday", label: "Terça" },
  { value: "wednesday", label: "Quarta" },
  { value: "thursday", label: "Quinta" },
  { value: "friday", label: "Sexta" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

type TurmaFields = {
  name: string;
  description: string;
  imageUrl: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  capacity: string;
  location: string;
  semester: string;
  modalityId: string;
  targetAudienceIds: string[];
};

type ErrorFields = Partial<Record<keyof TurmaFields, string>>;

export default function CadastrarTurmaPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [modalidades, setModalidades] = useState<any[]>([]);
  const [publicosAlvo, setPublicosAlvo] = useState<any[]>([]);
  const [fields, setFields] = useState<TurmaFields>({
    name: "",
    description: "",
    imageUrl: "",
    daysOfWeek: [],
    startTime: "",
    endTime: "",
    capacity: "",
    location: "",
    semester: "",
    modalityId: "",
    targetAudienceIds: [],
  });
  const [errors, setErrors] = useState<ErrorFields>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/modalities")
      .then((res) => res.json())
      .then((data) => setModalidades(data || []));
    fetch("/api/target-audiences")
      .then((res) => res.json())
      .then((data) => setPublicosAlvo(data || []));
  }, []);

  function handleFieldChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  }

  function handleMultiSelectChange(name: keyof TurmaFields, values: string[]) {
    setFields((f) => ({ ...f, [name]: values }));
    setErrors((err) => ({ ...err, [name]: "" }));
  }

  function handleTimeChange(name: keyof TurmaFields, value: string) {
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedImageFile(file);
    if (!file) {
      setFields((f) => ({ ...f, imageUrl: "" }));
    }
  }

  async function handleSubmit() {
    const newErrors: ErrorFields = {};
    if (!fields.name) newErrors.name = "Nome é obrigatório.";
    if (!fields.daysOfWeek.length) newErrors.daysOfWeek = "Selecione ao menos um dia.";
    if (!fields.startTime) newErrors.startTime = "Horário de início obrigatório.";
    if (!fields.endTime) newErrors.endTime = "Horário de término obrigatório.";
    if (!fields.capacity) newErrors.capacity = "Capacidade obrigatória.";
    if (!fields.location) newErrors.location = "Local obrigatório.";
    if (!fields.semester) newErrors.semester = "Semestre obrigatório.";
    if (!fields.modalityId) newErrors.modalityId = "Modalidade obrigatória.";
    if (!fields.targetAudienceIds.length) newErrors.targetAudienceIds = "Selecione ao menos um público-alvo.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    for (const dia of fields.daysOfWeek) {
      const params = new URLSearchParams({
        location: fields.location,
        day: dia,
        startTime: fields.startTime,
        endTime: fields.endTime,
      });
      const res = await fetch(`/api/classes/check-conflict?${params.toString()}`);
      const data = await res.json();
      if (data.conflict) {
        const diasPt: Record<string, string> = {
          sunday: "domingo",
          monday: "segunda-feira",
          tuesday: "terça-feira",
          wednesday: "quarta-feira",
          thursday: "quinta-feira",
          friday: "sexta-feira",
          saturday: "sábado",
        };
        showToast({
          type: "error",
          title: "Conflito de horário",
          message: `Já existe uma turma na ${fields.location} na ${diasPt[dia] || dia} nesse horário.`
        });
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    let imageUrl = fields.imageUrl;
    if (selectedImageFile) {
      const formData = new FormData();
      formData.append("file", selectedImageFile);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        imageUrl = data.url;
      } else {
        showToast({ type: "error", title: "Erro", message: "Falha ao fazer upload da imagem." });
        setLoading(false);
        return;
      }
    }
    const startTime = `2024-01-01T${fields.startTime}:00.000Z`;
    const endTime = `2024-01-01T${fields.endTime}:00.000Z`;
    const capacity = Number(fields.capacity);

    const body = {
      ...fields,
      startTime,
      endTime,
      capacity,
      targetAudienceIds: Array.isArray(fields.targetAudienceIds)
        ? fields.targetAudienceIds
        : [fields.targetAudienceIds],
    };

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      showToast({ type: "success", title: "Sucesso", message: "Turma cadastrada com sucesso!" });
      setFields({
        name: "",
        description: "",
        imageUrl: "",
        daysOfWeek: [],
        startTime: "",
        endTime: "",
        capacity: "",
        location: "",
        semester: "",
        modalityId: "",
        targetAudienceIds: [],
      });
      setSelectedImageFile(null);
    } else {
      const { error } = await res.json();
      showToast({ type: "error", title: "Erro", message: error || "Erro ao cadastrar turma." });
    }
    setLoading(false);
  }

  function getDiasSemanaOptions() {
    return diasSemana.map((d) => ({ value: d.value, text: d.label, selected: fields.daysOfWeek.includes(d.value) }));
  }
  function getPublicosAlvoOptions() {
    return publicosAlvo.map((p) => ({ value: p.id, text: p.name, selected: fields.targetAudienceIds.includes(p.id) }));
  }

  return (
    <ComponentCard title="Cadastrar Turma">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Nome</Label>
            <InputField
              id="name"
              name="name"
              value={fields.name}
              onChange={handleFieldChange}
              placeholder="Nome da turma"
              error={!!errors.name}
              hint={errors.name}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Descrição</Label>
            <InputField
              id="description"
              name="description"
              value={fields.description}
              onChange={handleFieldChange}
              placeholder="Descrição da turma"
              error={!!errors.description}
              hint={errors.description}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="imageUpload">Imagem</Label>
            <FileInput
              className=""
              onChange={handleImageChange}
            />
            {errors.imageUrl && (
              <p className="mt-1.5 text-xs text-error-500">{errors.imageUrl}</p>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="daysOfWeek">Dias da Semana</Label>
            <MultiSelect
              label="Selecione os dias"
              options={getDiasSemanaOptions()}
              defaultSelected={fields.daysOfWeek}
              onChange={(values) => handleMultiSelectChange("daysOfWeek", values)}
            />
            {errors.daysOfWeek && (
              <p className="mt-1.5 text-xs text-error-500">{String(errors.daysOfWeek)}</p>
            )}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Horário de Início</Label>
              <InputField
                id="startTime"
                name="startTime"
                type="time"
                value={fields.startTime}
                onChange={handleFieldChange}
                error={!!errors.startTime}
                hint={errors.startTime}
              />
            </div>
            <div>
              <Label htmlFor="endTime">Horário de Término</Label>
              <InputField
                id="endTime"
                name="endTime"
                type="time"
                value={fields.endTime}
                onChange={handleFieldChange}
                error={!!errors.endTime}
                hint={errors.endTime}
              />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacidade</Label>
              <InputField
                id="capacity"
                name="capacity"
                type="number"
                value={fields.capacity}
                onChange={handleFieldChange}
                error={!!errors.capacity}
                hint={errors.capacity}
              />
            </div>
            <div>
              <Label htmlFor="location">Local</Label>
              <InputField
                id="location"
                name="location"
                value={fields.location}
                onChange={handleFieldChange}
                error={!!errors.location}
                hint={errors.location}
              />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="semester">Semestre</Label>
              <InputField
                id="semester"
                name="semester"
                value={fields.semester}
                onChange={handleFieldChange}
                placeholder="2024.1"
                error={!!errors.semester}
                hint={errors.semester}
              />
            </div>
            <div>
              <Label htmlFor="modalityId">Modalidade</Label>
              <Select
                options={modalidades.map((m) => ({ value: m.id, label: m.name }))}
                placeholder="Selecione a modalidade"
                onChange={(value) => setFields((f) => ({ ...f, modalityId: value }))}
                className="dark:bg-dark-900"
                defaultValue={fields.modalityId}
              />
              {errors.modalityId && (
                <p className="mt-1.5 text-xs text-error-500">{errors.modalityId}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="targetAudienceIds">Públicos-alvo</Label>
            <MultiSelect
              label="Selecione os públicos-alvo"
              options={getPublicosAlvoOptions()}
              defaultSelected={fields.targetAudienceIds}
              onChange={(values) => handleMultiSelectChange("targetAudienceIds", values)}
            />
            {errors.targetAudienceIds && (
              <p className="mt-1.5 text-xs text-error-500">{String(errors.targetAudienceIds)}</p>
            )}
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