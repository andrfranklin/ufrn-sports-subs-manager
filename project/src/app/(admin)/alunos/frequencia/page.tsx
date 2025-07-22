"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  TrendingDown,
  TrendingUp
} from "lucide-react";

export default function FrequenciaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTurma, setSelectedTurma] = useState("todas");

  // Dados simulados de frequência
  const frequenciaData = [
    {
      id: 1,
      nome: "João Silva",
      turma: "Futebol - Turma A",
      totalAulas: 20,
      presencas: 18,
      faltas: 2,
      frequencia: 90,
      status: "regular"
    },
    {
      id: 2,
      nome: "Maria Santos",
      turma: "Natação - Turma B",
      totalAulas: 20,
      presencas: 14,
      faltas: 6,
      frequencia: 70,
      status: "em-risco"
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      turma: "Vôlei - Turma C",
      totalAulas: 20,
      presencas: 12,
      faltas: 8,
      frequencia: 65,
      status: "critico"
    },
    {
      id: 4,
      nome: "Ana Costa",
      turma: "Futebol - Turma A",
      totalAulas: 20,
      presencas: 19,
      faltas: 1,
      frequencia: 95,
      status: "regular"
    },
    {
      id: 5,
      nome: "Carlos Souza",
      turma: "Natação - Turma B",
      totalAulas: 20,
      presencas: 16,
      faltas: 4,
      frequencia: 80,
      status: "regular"
    },
    {
      id: 6,
      nome: "Juliana Lima",
      turma: "Vôlei - Turma C",
      totalAulas: 20,
      presencas: 13,
      faltas: 7,
      frequencia: 75,
      status: "em-risco"
    }
  ];

  const turmas = ["todas", "Futebol - Turma A", "Natação - Turma B", "Vôlei - Turma C"];

  const filteredData = frequenciaData.filter(aluno => {
    const matchesSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTurma = selectedTurma === "todas" || aluno.turma === selectedTurma;
    return matchesSearch && matchesTurma;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "regular":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "em-risco":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "critico":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "regular":
        return "Regular";
      case "em-risco":
        return "Em Risco";
      case "critico":
        return "Crítico";
      default:
        return "Pendente";
    }
  };

  const getFrequenciaColor = (frequencia: number) => {
    if (frequencia >= 80) return "text-green-600 dark:text-green-400";
    if (frequencia >= 70) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  // Estatísticas
  const totalAlunos = frequenciaData.length;
  const regulares = frequenciaData.filter(a => a.status === "regular").length;
  const emRisco = frequenciaData.filter(a => a.status === "em-risco").length;
  const criticos = frequenciaData.filter(a => a.status === "critico").length;
  const mediaFrequencia = Math.round(frequenciaData.reduce((acc, a) => acc + a.frequencia, 0) / totalAlunos);

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalAlunos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Em Risco</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{emRisco}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Crítico</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{criticos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Média Geral</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mediaFrequencia}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <ComponentCard title="Relatório de Frequência">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <select
            value={selectedTurma}
            onChange={(e) => setSelectedTurma(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {turmas.map(turma => (
              <option key={turma} value={turma}>
                {turma === "todas" ? "Todas as Turmas" : turma}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Aluno</th>
                <th className="px-6 py-3">Turma</th>
                <th className="px-6 py-3">Presenças</th>
                <th className="px-6 py-3">Faltas</th>
                <th className="px-6 py-3">Frequência</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((aluno) => (
                <tr key={aluno.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {aluno.nome}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {aluno.turma}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {aluno.presencas}/{aluno.totalAulas}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {aluno.faltas}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${getFrequenciaColor(aluno.frequencia)}`}>
                      {aluno.frequencia}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(aluno.status)}`}>
                      {getStatusText(aluno.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Eye className="w-4 h-4" />
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Nenhum aluno encontrado com os filtros aplicados.</p>
          </div>
        )}
      </ComponentCard>
    </div>
  );
} 