"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { useToast } from "@/components/ui/toast/ToastProvider";
import ComponentCard from "@/components/common/ComponentCard";

interface Turma {
  id: string;
  name: string;
  description?: string;
  location?: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  capacity: number;
  semester: string;
  modality?: { name: string };
  classTargetAudiences?: { targetAudience: { name: string } }[];
  createdAt: string;
}

interface TurmasResponse {
  success?: boolean;
  turmas: Turma[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const diasSemanaPt: Record<string, string> = {
  sunday: "Dom",
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
};

export default function ListarTurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTurmas();
  }, [currentPage]);

  async function fetchTurmas() {
    setLoading(true);
    try {
      const res = await fetch(`/api/classes?page=${currentPage}&limit=10`);
      const data: TurmasResponse = await res.json();

      if (data.success === false) {
        showToast({
          type: "error",
          title: "Erro",
          message: "Erro ao carregar turmas.",
        });
      } else {
        setTurmas(data.turmas || data);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || (data.turmas ? data.turmas.length : 0));
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro",
        message: "Erro ao carregar turmas.",
      });
    } finally {
      setLoading(false);
    }
  }

  function formatTime(dateString: string) {
    return dateString?.slice(11, 16) || "";
  }

  function formatDiasSemana(days: string[]) {
    return days.map((d) => diasSemanaPt[d] || d).join(", ");
  }

  return (
    <ComponentCard title="Listar Turmas">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando turmas...</p>
          </div>
        ) : turmas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhuma turma encontrada.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Nome
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Modalidade
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Local
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Dias
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Horário
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Público-alvo
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Capacidade
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Semestre
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {turmas.map((turma, index) => (
                    <TableRow
                      key={turma.id}
                      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50/50 dark:bg-gray-800/50"
                      }`}
                    >
                      <TableCell className="px-6 py-4 text-start">
                        <span className="font-medium text-gray-900 text-sm dark:text-white">
                          {turma.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {turma.modality?.name || "—"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {turma.location || "—"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {formatDiasSemana(turma.daysOfWeek)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {formatTime(turma.startTime)} - {formatTime(turma.endTime)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {turma.classTargetAudiences
                          ?.map((cta) => cta.targetAudience?.name)
                          .join(", ") || "—"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {turma.capacity}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {turma.semester}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Página {currentPage} de {totalPages} • {total} turmas
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ComponentCard>
  );
}