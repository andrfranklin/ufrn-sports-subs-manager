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
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Modal } from "@/components/ui/modal";
import { HorizontaLDots, PencilIcon, TrashBinIcon, UserIcon, EyeIcon } from "@/icons";

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
  studentCount?: number;
}

interface TurmasResponse {
  success?: boolean;
  turmas: Turma[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  cpf: string;
  telephone: string;
  birthdate: string;
  classId?: string;
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [showLinkStudentModal, setShowLinkStudentModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [turmaStudents, setTurmaStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudentsToRemove, setSelectedStudentsToRemove] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTurmas();
    fetchStudents();
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

  async function fetchStudents() {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  }

  async function fetchTurmaStudents(turmaId: string) {
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/classes/${turmaId}/students`);
      const data = await res.json();
      
      if (data.success) {
        setTurmaStudents(data.students || []);
      } else {
        showToast({
          type: "error",
          title: "Erro",
          message: "Erro ao carregar alunos da turma.",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro",
        message: "Erro ao carregar alunos da turma.",
      });
    } finally {
      setLoadingStudents(false);
    }
  }

  async function handleDeleteTurma(turmaId: string) {
    if (!confirm('Tem certeza que deseja deletar esta turma? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const res = await fetch(`/api/classes/${turmaId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast({
          type: "success",
          title: "Sucesso",
          message: "Turma deletada com sucesso!",
        });
        fetchTurmas();
      } else {
        const error = await res.json();
        showToast({
          type: "error",
          title: "Erro",
          message: error.error || "Erro ao deletar turma.",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro",
        message: "Erro ao deletar turma.",
      });
    }
  }

  async function handleLinkStudents(turmaId: string, studentIds: string[]) {
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const studentId of studentIds) {
        const res = await fetch(`/api/classes/${turmaId}/link-student`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentId }),
        });

        if (res.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast({
          type: "success",
          title: "Sucesso",
          message: `${successCount} aluno(s) vinculado(s) com sucesso!`,
        });
        fetchStudents();
        fetchTurmas(); 
        setShowLinkStudentModal(false);
        setSelectedStudents([]);
      }

      if (errorCount > 0) {
        showToast({
          type: "error",
          title: "Atenção",
          message: `${errorCount} aluno(s) não puderam ser vinculados.`,
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro",
        message: "Erro ao vincular alunos.",
      });
    }
  }

  async function handleRemoveStudents(turmaId: string, studentIds: string[]) {
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const studentId of studentIds) {
        const res = await fetch(`/api/classes/${turmaId}/link-student`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentId }),
        });

        if (res.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast({
          type: "success",
          title: "Sucesso",
          message: `${successCount} aluno(s) removido(s) com sucesso!`,
        });
        fetchStudents();
        fetchTurmas();
        fetchTurmaStudents(turmaId);
        setSelectedStudentsToRemove([]);
      }

      if (errorCount > 0) {
        showToast({
          type: "error",
          title: "Atenção",
          message: `${errorCount} aluno(s) não puderam ser removidos.`,
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro",
        message: "Erro ao remover alunos.",
      });
    }
  }

  function formatTime(dateString: string) {
    return dateString?.slice(11, 16) || "";
  }

  function formatDiasSemana(days: string[]) {
    return days.map((d) => diasSemanaPt[d] || d).join(", ");
  }

  function formatAge(birthdate: string) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} anos`;
  }

  function toggleDropdown(turmaId: string) {
    setOpenDropdown(openDropdown === turmaId ? null : turmaId);
  }

  function closeDropdown() {
    setOpenDropdown(null);
  }

  function openLinkStudentModal(turma: Turma) {
    setSelectedTurma(turma);
    setShowLinkStudentModal(true);
    setSelectedStudents([]);
    setSearchTerm("");
    closeDropdown();
  }

  function closeLinkStudentModal() {
    setShowLinkStudentModal(false);
    setSelectedTurma(null);
    setSelectedStudents([]);
    setSearchTerm("");
  }

  function openStudentsModal(turma: Turma) {
    setSelectedTurma(turma);
    setShowStudentsModal(true);
    fetchTurmaStudents(turma.id);
    closeDropdown();
  }

  function closeStudentsModal() {
    setShowStudentsModal(false);
    setSelectedTurma(null);
    setTurmaStudents([]);
    setSelectedStudentsToRemove([]);
  }

  function handleStudentSelection(studentId: string) {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  }

  function handleSelectAll() {
    const availableStudentIds = availableStudents.map(student => student.id);
    setSelectedStudents(availableStudentIds);
  }

  function handleDeselectAll() {
    setSelectedStudents([]);
  }

  function handleStudentSelectionForRemoval(studentId: string) {
    setSelectedStudentsToRemove(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  }

  function handleSelectAllForRemoval() {
    const allStudentIds = turmaStudents.map(student => student.id);
    setSelectedStudentsToRemove(allStudentIds);
  }

  function handleDeselectAllForRemoval() {
    setSelectedStudentsToRemove([]);
  }

  const availableStudents = students.filter(student => !student.classId);

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <TableCell
                      isHeader
                      className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                    >
                      Ações
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
                        <span className={`font-medium ${
                          (turma.studentCount || 0) >= turma.capacity 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {turma.studentCount || 0}/{turma.capacity}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {turma.semester}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-start">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(turma.id)}
                            className="dropdown-toggle p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
                          >
                            <HorizontaLDots className="w-5 h-5" />
                          </button>

                          <Dropdown
                            isOpen={openDropdown === turma.id}
                            onClose={closeDropdown}
                            className="w-48"
                          >
                            <DropdownItem
                              onClick={() => {
                                showToast({
                                  type: "info",
                                  title: "Funcionalidade",
                                  message: "Edição será implementada em breve.",
                                });
                                closeDropdown();
                              }}
                              className="flex items-center gap-3 px-4 py-2 text-sm"
                            >
                              <PencilIcon className="w-6 h-6" />
                              Editar
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => openStudentsModal(turma)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <EyeIcon className="w-6 h-6" />
                              Ver Alunos ({turma.studentCount || 0})
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => openLinkStudentModal(turma)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <UserIcon className="w-6 h-6" />
                              Vincular Aluno
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDeleteTurma(turma.id)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <TrashBinIcon className="w-6 h-6" />
                              Deletar
                            </DropdownItem>
                          </Dropdown>
                        </div>
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

      <Modal
        isOpen={showLinkStudentModal}
        onClose={closeLinkStudentModal}
        className="w-full max-w-2xl mx-4"
      >
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Vincular Alunos - {selectedTurma?.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selecione os alunos que deseja vincular a esta turma
            </p>
          </div>

          {availableStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Todos os alunos já estão vinculados a turmas.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar alunos por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Selecionar Todos
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Desmarcar Todos
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                {filteredStudents.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum aluno encontrado.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                          selectedStudents.includes(student.id)
                            ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                            : ""
                        }`}
                        onClick={() => handleStudentSelection(student.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {student.email}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleStudentSelection(student.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedStudents.length} aluno(s) selecionado(s)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={closeLinkStudentModal}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (selectedStudents.length > 0 && selectedTurma) {
                        handleLinkStudents(selectedTurma.id, selectedStudents);
                      }
                    }}
                    disabled={selectedStudents.length === 0}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Vincular {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ""}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showStudentsModal}
        onClose={closeStudentsModal}
        className="w-full max-w-4xl mx-4"
      >
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Alunos Vinculados - {selectedTurma?.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lista de alunos matriculados nesta turma
            </p>
          </div>

          {loadingStudents ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Carregando alunos...</p>
            </div>
          ) : turmaStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum aluno vinculado a esta turma.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: {turmaStudents.length} aluno(s)
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleSelectAllForRemoval}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Selecionar Todos
                </button>
                <button
                  onClick={handleDeselectAllForRemoval}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Desmarcar Todos
                </button>
              </div>

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
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                      >
                        CPF
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                      >
                        Telefone
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                      >
                        Idade
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                      >
                        Selecionar
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-6 py-4 font-semibold text-gray-700 text-start text-sm dark:text-gray-300"
                      >
                        Ações
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {turmaStudents.map((student, index) => (
                      <TableRow
                        key={student.id}
                        className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50/50 dark:bg-gray-800/50"
                        } ${
                          selectedStudentsToRemove.includes(student.id)
                            ? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
                            : ""
                        }`}
                      >
                        <TableCell className="px-6 py-4 text-start">
                          <span className="font-medium text-gray-900 text-sm dark:text-white">
                            {student.name}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                          {student.email}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                          {student.cpf}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                          {student.telephone}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                          {formatAge(student.birthdate)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-start">
                          <input
                            type="checkbox"
                            checked={selectedStudentsToRemove.includes(student.id)}
                            onChange={() => handleStudentSelectionForRemoval(student.id)}
                            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4 text-start">
                          <button
                            onClick={() => {
                              if (confirm(`Tem certeza que deseja remover ${student.name} desta turma?`)) {
                                handleRemoveStudents(selectedTurma!.id, [student.id]);
                              }
                            }}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Remover
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedStudentsToRemove.length} aluno(s) selecionado(s) para remoção
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={closeStudentsModal}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      if (selectedStudentsToRemove.length > 0 && selectedTurma) {
                        if (confirm(`Tem certeza que deseja remover ${selectedStudentsToRemove.length} aluno(s) desta turma?`)) {
                          handleRemoveStudents(selectedTurma.id, selectedStudentsToRemove);
                        }
                      }
                    }}
                    disabled={selectedStudentsToRemove.length === 0}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Remover {selectedStudentsToRemove.length > 0 ? `(${selectedStudentsToRemove.length})` : ""}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </ComponentCard>
  );
}