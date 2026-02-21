'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { FlightCard, Flight } from './FlightCard';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

// Función para parsear información de vuelos del texto
const parseFlights = (content: string): Flight[] => {
  const flights: Flight[] = [];
  
  const flightRegex = /(?:\d+\.\s+)?(?:\*\*)?([A-Za-z]+(?:\/[A-Za-z]+)?):?\*?\*?\s*\$?([\d,.]+)\s+USD\s*\/\s*\$?([\d,.]+)\s+COP\s*\|\s*(\d{1,2}:\d{2})\s*\|\s*([^|]+?)\s*\|\s*(.+?)(?=\n|$)/gi;
  
  let match;
  while ((match = flightRegex.exec(content)) !== null) {
    flights.push({
      airline: match[1].trim(),
      type: match[6].trim(),
      departure: match[4].trim(),
      arrival: '-',
      duration: match[5].trim(),
      priceUSD: `$${match[2].trim()} USD`,
      priceCOP: `$${match[3].trim()} COP`,
    });
  }
  
  return flights;
};

// Función para remover la información de vuelos del contenido markdown
const removeFlightInfo = (content: string): string => {
  // Remover tanto el formato con numeración como sin ella
  return content.replace(/(?:\d+\.\s+)?(?:\*\*)?[A-Za-z]+(?:\/[A-Za-z]+)?:?\*?\*?\s*\$?[\d,.]+\s+USD\s*\/\s*\$?[\d,.]+\s+COP\s*\|[^|]+\|[^|]+\|[^\n]+/gi, '').trim();
};

// Función para extraer enlace de Google Flights
const extractGoogleFlightsLink = (content: string): string | null => {
  const match = content.match(/\[Ver más opciones en Google Flights\]\((https?:\/\/[^\)]+)\)/i);
  return match ? match[1] : null;
};

// Función para remover el enlace de Google Flights del contenido
const removeGoogleFlightsLink = (content: string): string => {
  return content.replace(/\*\*\[Ver más opciones en Google Flights\]\(https?:\/\/[^\)]+\)\*\*/gi, '')
                .replace(/\[Ver más opciones en Google Flights\]\(https?:\/\/[^\)]+\)/gi, '')
                .replace(/🔗/g, '') // Remover emoji de link
                .trim();
};

const cleanContent = (content: string): string => {
  return content.replace(/🔗/g, '').trim();
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === 'user';
  
  // Para mensajes del asistente, detectar si hay vuelos y enlaces
  const flights = role === 'assistant' ? parseFlights(content) : [];
  const hasFlights = flights.length > 0;
  const googleFlightsLink = role === 'assistant' ? extractGoogleFlightsLink(content) : null;
  
  let textContent = content;
  if (hasFlights) {
    textContent = removeFlightInfo(textContent);
  }
  if (googleFlightsLink) {
    textContent = removeGoogleFlightsLink(textContent);
  }
  // Limpiar emojis innecesarios
  textContent = cleanContent(textContent).trim();

  return (
    <div className={`mb-5 flex w-full items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Ícono del asistente (izquierda) */}
      {!isUser && (
        <div className="shrink-0 self-end">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 shadow-sm">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>
      )}
      
      <div
        className={`${isUser ? 'max-w-[88%] md:max-w-[78%]' : 'w-full max-w-full'} transition-all`}
      >
        {isUser ? (
          <div className="rounded-2xl rounded-br-none bg-linear-to-br from-blue-600 to-blue-700 px-4 py-3 text-white shadow-sm md:px-5 md:py-4">
            <p className="whitespace-pre-wrap text-[15px] font-medium leading-6 text-white">{content}</p>
          </div>
        ) : (
          <>
            {/* Mostrar texto normal si hay contenido adicional */}
            {textContent && (
              <div className="mb-4 rounded-2xl rounded-bl-none border border-gray-200 bg-gray-100 px-4 py-3 shadow-sm md:px-5 md:py-4">
                <div className="markdown-content">
                  <ReactMarkdown 
                    components={{
                      h1: ({node, ...props}) => <h1 className="mb-3 mt-4 text-xl font-bold text-gray-900" {...props} />,
                      h2: ({node, ...props}) => <h2 className="mb-3 mt-4 text-lg font-bold text-gray-900" {...props} />,
                      h3: ({node, ...props}) => <h3 className="mb-2 mt-3 text-base font-bold text-gray-900" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 text-[15px] leading-7 text-gray-800" {...props} />,
                      ul: ({node, ...props}) => <ul className="mb-3 list-disc space-y-2 pl-5 text-[15px] text-gray-800" {...props} />,
                      ol: ({node, ...props}) => <ol className="mb-3 list-decimal space-y-2 pl-5 text-[15px] text-gray-800" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-800" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="my-3 rounded-r-lg border-l-4 border-gray-400 bg-gray-50 px-4 py-3 italic text-gray-700" {...props} />,
                      code: ({node, ...props}) => <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono text-gray-800" {...props} />,
                      pre: ({node, ...props}) => <pre className="mb-3 overflow-x-auto rounded-lg bg-gray-200 p-3 text-sm text-gray-800" {...props} />,
                    }}
                  >
                    {textContent}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            
            {/* Mostrar tarjetas de vuelos */}
            {hasFlights && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {flights.map((flight, index) => (
                  <FlightCard key={index} flight={flight} />
                ))}
              </div>
            )}
            
            {/* Mostrar enlace de Google Flights si existe */}
            {googleFlightsLink && (
              <div className="mt-4">
                <a 
                  href={googleFlightsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver más opciones en Google Flights
                </a>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Ícono del usuario (derecha) */}
      {isUser && (
        <div className="shrink-0 self-end">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 shadow-sm">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
