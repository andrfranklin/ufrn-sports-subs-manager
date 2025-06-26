import { listAllModalities } from "@/actions/modality/listAll";
export default async function Home() {
  
  const modalities = await listAllModalities();

  return (
    <div>
      <h1>Exemplo de uso da api com prisma: (server-component)</h1>
      <ul>
          {modalities.map((modality: { id: string; name: string; }) => (
          <li key={modality.id}>{modality.name}</li>
        ))}
      </ul>
    </div>
  );
}
