'use client'
import axios from "axios";
import { useEffect, useState } from "react";

const fechFunctionExample = async () => axios.get(`/api/modality`).then(res => res.data);
export default function Home2() {
    const [modalities, setModalities] = useState<{ id: string; name: string; }[]>([])

    useEffect(() => {
      (async () => {
        const data = await fechFunctionExample();
        setModalities(data);
      })()
    }, []);


  return (
     <div>
      <h1>Exemplo de uso da api com prisma: (client-component)</h1>
      <ul>
        {modalities.map((modality: { id: string; name: string; }) => (
          <li key={modality.id}>{modality.name}</li>
        ))}
      </ul>
    </div>
  );
}
