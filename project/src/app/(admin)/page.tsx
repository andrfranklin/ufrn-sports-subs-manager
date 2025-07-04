import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "SIGEE - UFRN Sports",
  description: "SIGEE - UFRN Sports",
};

export default function Ecommerce() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <p>Painel administrativo será implementado aqui.testezin na aula</p>
      </div>
    </div>
  );
}
