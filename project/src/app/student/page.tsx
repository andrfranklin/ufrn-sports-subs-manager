// app/turmas/page.tsx (Next 13+ App Router)
"use client";
import { useEffect } from "react";

import React, { useState } from "react";
import { Class } from "./types";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Form from "@/components/form/Form";
import MultiSelect from "@/components/form/MultiSelect";

type CardTurmaProps = {
  nome: string;
};

const CardTurma: React.FC<CardTurmaProps> = ({ nome }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-2">{nome}</h2>
      {/* Aqui você insere os outros dados da turma depois */}
      <p className="text-sm text-gray-500">Informações da turma...</p>
    </div>
  );
};

const TurmasPage = () => {
  const [turmas, setTurmas] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFields, setformFields] = useState({
    name: "",
    daysOfWeek: [],
    startTime: "",
    endTime: "",
    semester: "",
  })

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/classes");
      const data = await response.json();
      setTurmas(data);
    })();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      (async () => {
        const params = new URLSearchParams({
          name: formFields.name,
        });
        const response = await fetch(`/api/classes?${params.toString()}`);
        const data = await response.json();
        setTurmas(data);
      })();
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [formFields.name]);

  const turmasFiltradas = turmas.filter((turma) =>
    turma.name.toLowerCase().includes(formFields.name.toLowerCase())
  );

  // function getDiasSemanaOptions() {
  //     return diasSemana.map((d) => ({ value: d.value, text: d.label, selected: formFields.daysOfWeek.includes(d.value) }));
  //   }

  return (
    <>
      {/* <Modal
        className="max-w-[400px] flex min-h-dvh ml-auto rounded-none"
        isOpen={isModalOpen}
        onClose={handleToggleModal}
        showCloseButton
      >
        <Form
          className="ml-7 mr-7 mt-20 mb-20 w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <MultiSelect
              label="Dias da semana"
              options={getDiasSemanaOptions()}
              defaultSelected={fields.daysOfWeek}
              onChange={(values) => handleMultiSelectChange("daysOfWeek", values)}
            />
        </Form>
      </Modal> */}
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Turmas Abertas</h1>

        <div className="flex items-center mb-4">
          <div className="w-10/12">
            <Input
              onChange={(e) => setformFields((state) => ({ ...state, name: e.target.value }))}
              placeholder="Buscar turma"
            />
          </div>
          <button
            onClick={handleToggleModal}
            className="ml-2 p-2.5 border border-gray-150 bg-transparent text-blue-500 rounded-xl shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Filtro avançado
          </button>
        </div>
      </main>
      <section className="max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmasFiltradas.map((turma) => (
            <CardTurma key={turma.id} nome={turma.name} />
          ))}
        </div>
      </section>
    </>
  );
};

export default TurmasPage;
