'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  {
    text: "Vuelos a Barcelona, España",
    image: "https://www.latamairlines.com/content/dam/latamxp/sites/vamos-latam/news-espana-nov-2024/barcelona/Barcelona_Foto%201_A%20Sagrada%20Familia.jpg"
  },
  {
    text: "Alojamientos en París, Francia",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
  },
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar sesión al cargar
  useEffect(() => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!sessionId) return;

    const userMessage: Message = {
      id: `user-${crypto.randomUUID()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiUrl = "/api/chat";
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sessionId: sessionId,
          message: text
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant-${crypto.randomUUID()}`,
        role: 'assistant',
        content: data.response || 'Sin respuesta del backend.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const assistantMessage: Message = {
        id: `assistant-${crypto.randomUUID()}`,
        role: 'assistant',
        content: `Error al conectar con el backend: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <a href='/' className="text-lg font-semibold text-gray-900">
            FlightWise
          </a>
          <p className="hidden text-sm text-gray-500 md:block">Tu asistente para planear viajes</p>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto bg-linear-to-b from-gray-50 to-white" aria-live="polite" aria-busy={isLoading}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-10 px-4 py-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                ¡Hola viajero! 👋🏻
                <br />
               ¿Estás pensando en tu próximo viaje 🛫? 
              </h2>
              <p className="text-base font-light text-gray-600 ">
                Pregunta sobre destinos, vuelos, hoteles o actividades. ¡Estoy aquí para inspirarte y ayudarte a planear tu viaje perfecto! 🏩
              </p>
            </div>
            <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
              {/* Sugerencias dinámicas con imagen y texto */}
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:shadow-lg">
                  <img
                    src={suggestion.image}
                    alt={suggestion.text}
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="text-white text-lg font-semibold mb-2">{suggestion.text}</div>
                    <button
                      onClick={() => handleSendMessage(suggestion.text)}
                      className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-purple-700 shadow transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                      aria-label={`Enviar sugerencia: ${suggestion.text}`}
                      disabled={isLoading}
                    >
                      Preguntar a FlightWise
                      <span role="img" aria-label="send">✈️</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <section className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8" aria-label="Mensajes del chat">
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                <ChatMessage role={message.role} content={message.content} />
              </div>
            ))}
            {isLoading && (
              <div className="mb-6 flex w-fit items-center gap-3 rounded-2xl rounded-bl-none border border-gray-200 bg-gray-100 px-5 py-4 shadow-sm" role="status" aria-label="FlightWise está escribiendo">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500"></div>
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: '300ms' }}></div>
                <span className="text-sm text-gray-600">FlightWise está escribiendo...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </section>
        )}
      </main>

      {/* Input Area */}
      <div className="border-t border-gray-100 px-4 py-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};
