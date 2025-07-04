export default function CadastrarAlunoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Aluno</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <form>
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
} 