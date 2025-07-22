"use client";
import React from "react";
import { Calendar, CheckCircle, XCircle, Clock, MapPin, Users } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

const AttendancePage = () => {
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

  const aulas = [
    {
      day: "Segunda-feira",
      time: "14:00 - 16:00",
      status: "present",
      date: "15/04/2025",
      attendance: "present"
    },
    {
      day: "Quarta-feira", 
      time: "14:00 - 16:00",
      status: "present",
      date: "17/04/2025",
      attendance: "present"
    },
    {
      day: "Sexta-feira",
      time: "14:00 - 16:00", 
      status: "absent",
      date: "19/04/2025",
      attendance: "absent"
    },
    {
      day: "Segunda-feira",
      time: "14:00 - 16:00",
      status: "present",
      date: "22/04/2025",
      attendance: "present"
    },
    {
      day: "Quarta-feira",
      time: "14:00 - 16:00",
      status: "present", 
      date: "24/04/2025",
      attendance: "present"
    },
    {
      day: "Sexta-feira",
      time: "14:00 - 16:00",
      status: "upcoming",
      date: "26/04/2025",
      attendance: "pending"
    }
  ];

  const getAttendanceColor = (attendance: string) => {
    switch (attendance) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getAttendanceText = (attendance: string) => {
    switch (attendance) {
      case "present":
        return "Presente";
      case "absent":
        return "Ausente";
      case "pending":
        return "Pendente";
      default:
        return "Não registrado";
    }
  };

  const getAttendanceIcon = (attendance: string) => {
    switch (attendance) {
      case "present":
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-400" />;
    }
  };

  // Calcular estatísticas
  const totalAulas = aulas.length;
  const aulasPresente = aulas.filter(aula => aula.attendance === "present").length;
  const aulasAusente = aulas.filter(aula => aula.attendance === "absent").length;
  const frequencia = totalAulas > 0 ? Math.round((aulasPresente / (totalAulas - 1)) * 100) : 0; // -1 para não contar aula futura

  return (
    <ComponentCard title="Minha Frequência">

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
                <Calendar className="w-4 h-4" />
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

      {/* Lista de Aulas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Registro de Frequência
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Histórico de presença nas aulas da sua turma
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {aulas.map((aula, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    {getAttendanceIcon(aula.attendance)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {aula.day}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {aula.time} • {aula.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceColor(aula.attendance)}`}>
                    {getAttendanceText(aula.attendance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Presenças</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{aulasPresente}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Faltas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{aulasAusente}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Frequência</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{frequencia}%</p>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default AttendancePage;
