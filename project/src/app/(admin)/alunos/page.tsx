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

interface Student {
  id: string;
  name: string;
  email: string;
  cpf: string;
  telephone: string;
  birthdate: string;
  createdAt: string;
}

interface StudentsResponse {
  success: boolean;
  students: Student[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function ListarAlunosPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch(`/api/students?page=${currentPage}&limit=10`);
      const data: StudentsResponse = await res.json();
      
      if (data.success) {
        setStudents(data.students);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } else {
        showToast({ 
          type: "error", 
          title: "Erro", 
          message: "Erro ao carregar alunos." 
        });
      }
    } catch (error) {
      showToast({ 
        type: "error", 
        title: "Erro", 
        message: "Erro ao carregar alunos." 
      });
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR');
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listar Alunos</h1>
        <div className="text-sm text-gray-500">
          Total: {total} alunos
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando alunos...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum aluno encontrado.</p>
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
                      Data de Cadastro
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {students.map((student, index) => (
                    <TableRow 
                      key={student.id}
                      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                        index % 2 === 0 
                          ? 'bg-white dark:bg-gray-800' 
                          : 'bg-gray-50/50 dark:bg-gray-800/50'
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
                      <TableCell className="px-6 py-4 text-gray-600 text-start text-sm dark:text-gray-300">
                        {formatDate(student.createdAt)}
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
                    Página {currentPage} de {totalPages} • {total} alunos
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
    </div>
  );
} 