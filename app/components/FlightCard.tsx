'use client';

import React from 'react';

export interface Flight {
  airline: string;
  type: string; // "Directo" o "1 escala MAD"
  departure: string;
  arrival: string;
  duration: string;
  priceUSD: string;
  priceCOP: string;
  origin?: string;
  destination?: string;
}

interface FlightCardProps {
  flight: Flight;
}

// Mapeo de aerolíneas a logos (aerolíneas principales del mundo)
const airlineLogos: Record<string, string> = {
  // Latinoamérica
  'Avianca': 'https://images.kiwi.com/airlines/64/AV.png',
  'LATAM': 'https://images.kiwi.com/airlines/64/LA.png',
  'Copa': 'https://images.kiwi.com/airlines/64/CM.png',
  'Wingo': 'https://images.kiwi.com/airlines/64/P5.png',
  'JetSMART': 'https://images.kiwi.com/airlines/64/JA.png',
  'Aeromexico': 'https://images.kiwi.com/airlines/64/AM.png',
  'Viva': 'https://images.kiwi.com/airlines/64/VH.png',
  'VivaAerobus': 'https://images.kiwi.com/airlines/64/VB.png',
  'Volaris': 'https://images.kiwi.com/airlines/64/Y4.png',
  'GOL': 'https://images.kiwi.com/airlines/64/G3.png',
  'Azul': 'https://images.kiwi.com/airlines/64/AD.png',
  
  // Europa
  'Iberia': 'https://images.kiwi.com/airlines/64/IB.png',
  'Vueling': 'https://images.kiwi.com/airlines/64/VY.png',
  'Ryanair': 'https://images.kiwi.com/airlines/64/FR.png',
  'EasyJet': 'https://images.kiwi.com/airlines/64/U2.png',
  'Lufthansa': 'https://images.kiwi.com/airlines/64/LH.png',
  'AirFrance': 'https://images.kiwi.com/airlines/64/AF.png',
  'KLM': 'https://images.kiwi.com/airlines/64/KL.png',
  'BritishAirways': 'https://images.kiwi.com/airlines/64/BA.png',
  'Alitalia': 'https://images.kiwi.com/airlines/64/AZ.png',
  'TAP': 'https://images.kiwi.com/airlines/64/TP.png',
  'Swiss': 'https://images.kiwi.com/airlines/64/LX.png',
  'Norwegian': 'https://images.kiwi.com/airlines/64/DY.png',
  'WizzAir': 'https://images.kiwi.com/airlines/64/W6.png',
  
  // América del Norte
  'American': 'https://images.kiwi.com/airlines/64/AA.png',
  'Delta': 'https://images.kiwi.com/airlines/64/DL.png',
  'United': 'https://images.kiwi.com/airlines/64/UA.png',
  'Southwest': 'https://images.kiwi.com/airlines/64/WN.png',
  'JetBlue': 'https://images.kiwi.com/airlines/64/B6.png',
  'Spirit': 'https://images.kiwi.com/airlines/64/NK.png',
  'Frontier': 'https://images.kiwi.com/airlines/64/F9.png',
  'Alaska': 'https://images.kiwi.com/airlines/64/AS.png',
  'AirCanada': 'https://images.kiwi.com/airlines/64/AC.png',
  
  // Asia y Medio Oriente
  'Emirates': 'https://images.kiwi.com/airlines/64/EK.png',
  'Qatar': 'https://images.kiwi.com/airlines/64/QR.png',
  'Etihad': 'https://images.kiwi.com/airlines/64/EY.png',
  'TurkishAirlines': 'https://images.kiwi.com/airlines/64/TK.png',
  'Singapore': 'https://images.kiwi.com/airlines/64/SQ.png',
  'Cathay': 'https://images.kiwi.com/airlines/64/CX.png',
  'ANA': 'https://images.kiwi.com/airlines/64/NH.png',
  'JAL': 'https://images.kiwi.com/airlines/64/JL.png',
  'Korean': 'https://images.kiwi.com/airlines/64/KE.png',
  'AirChina': 'https://images.kiwi.com/airlines/64/CA.png',
  'ThaiAirways': 'https://images.kiwi.com/airlines/64/TG.png',
  
  // Oceanía
  'Qantas': 'https://images.kiwi.com/airlines/64/QF.png',
  'AirNewZealand': 'https://images.kiwi.com/airlines/64/NZ.png',
};

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const airlineName = flight.airline.split('/')[0].trim();
  const logo = airlineLogos[airlineName] || 'https://images.kiwi.com/airlines/64/GENERIC.png';

  return (
    <div className="mb-4 w-[250px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:shadow-lg">
      <div className="p-4 md:p-5">
        {/* Header con logo y aerolínea */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt={airlineName}
              className="h-8 w-8 rounded-md object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=✈️';
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
              <p className="text-xs text-gray-500">{flight.type}</p>
            </div>
          </div>
          {/* Badge de tipo de vuelo */}
          {flight.type.includes('Directo') && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Directo
            </span>
          )}
        </div>

        {/* Información de vuelo */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm md:gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
              {flight.origin && <p className="text-xs text-gray-500">{flight.origin}</p>}
            </div>
            <div className="flex flex-col items-center px-2 md:px-4">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <p className="mt-1 text-xs font-medium text-gray-600">{flight.duration}</p>
            </div>
            {flight.arrival !== '-' && (
              <div>
                <p className="text-2xl font-bold text-gray-900">{flight.arrival.split(' ')[0]}</p>
                {flight.destination && <p className="text-xs text-gray-500">{flight.destination}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Precio y acciones */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-500">Precio para 1 adulto</p>
            <p className="text-2xl font-bold text-gray-900">COP {flight.priceCOP.replace(/\$/g, '').replace(/COP/g, '').trim()}</p>
            <p className="text-xs text-gray-500">{flight.priceUSD}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
