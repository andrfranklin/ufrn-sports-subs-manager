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
import { 
  Volleyball, 
  WavesLadder, 
  Badge, 
  Users,
  Clock,
  Calendar,
  BookOpen,
  Search,
  Filter,
  Loader2
} from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

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

  // Função para obter ícone baseado no nome do esporte
  const getSportIcon = (sportName: string) => {
    const name = sportName.toLowerCase();
    if (name.includes('futebol') || name.includes('soccer')) return <Volleyball className="w-5 h-5" />;
    if (name.includes('vôlei') || name.includes('volleyball')) return <Volleyball className="w-5 h-5" />;
    if (name.includes('natação') || name.includes('swimming')) return <WavesLadder className="w-5 h-5" />;
    if (name.includes('hidroginástica') || name.includes('aquagym')) return <WavesLadder className="w-5 h-5" />;
    return <Badge className="w-5 h-5" />; // Ícone padrão
  };

  // Simular dados de capacidade (isso viria da API)
  const totalCapacity = 30;
  const enrolledStudents = 18; // Isso viria da API
  const availableSpots = totalCapacity - enrolledStudents;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {imageUrl && (
        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700">
          <img 
            src={imageUrl} 
            className="w-full h-full object-cover" 
            alt={name}
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-blue-600 dark:text-blue-400">
            {getSportIcon(name)}
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex-1">{name}</h2>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            availableSpots > 0 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            <Users className="w-3 h-3" />
            <span>{availableSpots} vagas</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{description}</p>
        
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Dias:</span>
            <div className="flex gap-1 flex-wrap">
              {daysOfWeek.map((day) => (
                <span key={day} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300">
                  {diasSemana.filter((d) => d.value === day)[0].label}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Horário:</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Semestre:</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{semester}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button 
            className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
              availableSpots > 0
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            disabled={availableSpots === 0}
          >
            {availableSpots > 0 ? 'Inscrever-se' : 'Turma lotada'}
          </button>
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
  const [loading, setLoading] = useState(false);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      (async () => {
        await handleSearch()
      })();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      <ComponentCard title="Turmas Abertas">

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              onChange={(e) =>
                setformFields((state) => ({ ...state, name: e.target.value }))
              }
              placeholder="Buscar turma por nome..."
              className="pl-10"
            />
          </div>
          <button
            onClick={handleToggleModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros Avançados
          </button>
        </div>
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <span className="text-gray-700 dark:text-gray-200 text-lg font-medium">Carregando turmas...</span>
          </div>
        ) : turmas.length ? turmas.map((turma) => (
          <CardTurma key={turma.id} {...turma} />
        )) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma turma encontrada</h3>
            <p className="text-gray-600 dark:text-gray-400">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
      </ComponentCard>
    </>
  );
};

export default TurmasPage;
