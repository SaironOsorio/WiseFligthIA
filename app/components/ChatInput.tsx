'use client';

import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState('');
  const canSend = !disabled && input.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 py-2 px-2 bg-transparent" aria-label="Formulario de mensaje">
    <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Pregunta sobre vuelos, destinos, mejores precios..."
        disabled={disabled}
      aria-label="Escribe tu mensaje"
      className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-base font-medium font-montserrat shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder:text-gray-400 transition-all disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
    />
    <button
        type="submit"
      disabled={!canSend}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 shadow-md transition-all hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
        aria-label="Enviar"
    >
        <span className="sr-only">Enviar</span>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        strokeWidth={2}
        >
       <path strokeLinecap="round" strokeLinejoin="round" d="M3 19l18-7-18-7v6l15 1-15 1v6z" />
        </svg>
    </button>
    </form>
  );
};
