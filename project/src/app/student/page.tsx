// app/turmas/page.tsx (Next 13+ App Router)
"use client";
import { useEffect } from "react";

import React, { useState } from "react";
import { Class } from "./types";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Form from "@/components/form/Form";
import MultiSelect from "@/components/form/MultiSelect";
import { diasSemana } from "../(admin)/turmas/cadastrar/constants";
import Image from "next/image";

type CardTurmaProps = {
  name: string;
  description: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  semester: string;
  imageUrl: string;
};

const CardTurma: React.FC<CardTurmaProps> = ({
  name,
  description,
  daysOfWeek,
  startTime,
  endTime,
  semester,
  imageUrl
}) => {

  const formatTime = (time: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
            hour: "numeric", minute: 'numeric'}).format(new Date(`${time}`));
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition">
      {imageUrl ? <img src={imageUrl} className="rounded-xl" width={50} height={50} alt=""/> : ""}
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-sm text-gray-500">{description}</p>
      <hr />
      <div className="flex justify-between pr-1">
        <div>
          <div>
            <span>Dias</span>
            <div className="flex gap-1">
              {daysOfWeek.map((day) => (
                <p key={day}>{diasSemana.filter((d) => d.value === day)[0].label}</p>
              ))}
            </div>
          </div>
          <div>
            <span>Horário</span>
            <div className="flex gap-1">
              <p>{formatTime(startTime)}</p> às <p>{formatTime(endTime)}</p>
            </div>
          </div>
        </div>
        <div>
        <span>Semestre</span>
        <div className="flex gap-1">
          <p>{semester}</p>
        </div>
      </div>
      </div>
    </div>
  );
};

type filterProps = {
  name: string,
  daysOfWeek: string[],
  startTime: string,
  endTime: string,
  semester: string,
}

const TurmasPage = () => {
  const [turmas, setTurmas] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFields, setformFields] = useState<filterProps>({
    name: "",
    daysOfWeek: [],
    startTime: "",
    endTime: "",
    semester: "",
  });

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearch = async () => {
    const params = new URLSearchParams({
      name: formFields.name,
      daysOfWeek: formFields.daysOfWeek.join(","),
      startTime: formFields.startTime,
      endTime: formFields.endTime,
      semester: formFields.semester,
    });
    const response = await fetch(`/api/classes?${params.toString()}`);
    const data = await response.json();
    const turmas = data.turmas || data;
    setTurmas(turmas);
  }

  const getDiasSemanaOptions = () => {
    return diasSemana.map((d) => ({
      value: d.value,
      text: d.label,
      selected: formFields.daysOfWeek.includes(d.value),
    }));
  }

  const handleSubmit = async () => {
    handleToggleModal();
    await handleSearch();
  }

  useEffect(() => {
    (async () => {
      await handleSearch()
    })();
  }, []);

  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      (async () => {
        await handleSearch()
      })();
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [formFields.name]);

  return (
    <>
      <Modal
        className="max-w-[400px] flex min-h-dvh ml-auto rounded-none"
        isOpen={isModalOpen}
        onClose={handleToggleModal}
        showCloseButton
      >
        <Form
          className="ml-7 mr-7 mt-20 mb-20 w-full"
          onSubmit={handleSubmit}
        >
          <MultiSelect
              label="Dias da semana"
              options={getDiasSemanaOptions()}
              defaultSelected={formFields.daysOfWeek}
              onChange={(values) => setformFields(state => ({...state, daysOfWeek: values}))}
            />
          <button
            type="submit"
            className="w-full p-2.5 border border-gray-150 bg-blue-500 text-white rounded-xl shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buscar
          </button>
        </Form>
      </Modal>
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Turmas Abertas</h1>

        <div className="flex items-center mb-4">
          <div className="w-10/12">
            <Input
              onChange={(e) =>
                setformFields((state) => ({ ...state, name: e.target.value }))
              }
              placeholder="Buscar turma"
            />
          </div>
          <button
            onClick={handleToggleModal}
            className="w-2/12 ml-2 p-2.5 border border-gray-150 bg-transparent text-blue-500 rounded-xl shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Filtro avançado
          </button>
        </div>
      </main>
      <section className="max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmas.length ? turmas.map((turma) => (
            <CardTurma key={turma.id} {...turma} />
          )) : <p>Nenhuma turma encontrada.</p> }
        </div>
      </section>
    </>
  );
};

export default TurmasPage;
