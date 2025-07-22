"use client";
import ComponentCard from "@/components/common/ComponentCard";
import { Users, Clock, Calendar, MapPin, List } from "lucide-react";
import React from "react";

export default function WaitlistPage() {
  // Dados simulados de listas de espera
  const waitlists = [
    {
      name: "Futebol - Turma B",
      sport: "Futebol",
      instructor: "Prof. Ana Paula",
      location: "Quadra 2",
      semester: "2025.1",
      position: 2,
      total: 8,
      dateJoined: "10/04/2025"
    },
    {
      name: "Natação - Turma C",
      sport: "Natação",
      instructor: "Prof. Carlos Souza",
      location: "Piscina Olímpica",
      semester: "2025.1",
      position: 1,
      total: 5,
      dateJoined: "12/04/2025"
    }
  ];

  return (
    <ComponentCard title="Minhas Listas de Espera">

      {waitlists.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma lista de espera</h3>
            <p className="text-gray-600 dark:text-gray-400">Você não está em nenhuma lista de espera no momento</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {waitlists.map((turma, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <List className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{turma.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{turma.sport}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Posição: <span className="font-bold text-blue-700 dark:text-blue-400">{turma.position}</span> de {turma.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{turma.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{turma.semester}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Entrou em: {turma.dateJoined}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs font-medium">Aguardando vaga</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ComponentCard>
  );
}
