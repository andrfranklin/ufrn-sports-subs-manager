"use client";
import React from "react";
import { Clock, Calendar as CalendarIcon, MapPin, Users } from "lucide-react";
import ComponentCard from '@/components/common/ComponentCard';
import Calendar from '@/components/calendar/Calendar';

const SchedulePage = () => {
  // Dados simulados para uma turma
  const turma = {
    name: "Futebol - Turma A",
    sport: "Futebol",
    instructor: "Prof. João Silva",
    location: "Quadra Principal",
    capacity: 30,
    enrolled: 18,
    semester: "2025.1"
  };

  // Evento fake para o calendário (segunda, quarta e sexta, 14h-16h)
  const events = [
    {
      title: turma.name,
      daysOfWeek: [1, 3, 5], // segunda, quarta, sexta
      startTime: "14:00",
      endTime: "16:00",
      extendedProps: { calendar: "turma" },
    },
  ];

  return (
    <ComponentCard title="Meus Horários">

      {/* Informações da Turma */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {turma.name}
            </h2>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{turma.enrolled}/{turma.capacity} alunos</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{turma.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{turma.semester}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Professor</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{turma.instructor}</p>
          </div>
        </div>
      </div>

      {/* Calendário semanal */}
      <ComponentCard title="Horários da Turma">
        <Calendar events={events} />
      </ComponentCard>
    </ComponentCard>
  );
};

export default SchedulePage;