"use client";

import { createContext, useContext, useState } from "react";
import type { ServiceName } from "@/lib/constants";

interface BookingContextValue {
  selectedService: ServiceName | "";
  selectService: (value: ServiceName) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

// Ponte leve entre a vitrine de Serviços e o fluxo de Agendamento —
// clicar em "Agendar" num card de serviço já leva a etapa 1 preenchida.
export default function BookingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedService, setSelectedService] = useState<ServiceName | "">("");

  return (
    <BookingContext.Provider
      value={{ selectedService, selectService: setSelectedService }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBookingContext deve ser usado dentro de BookingProvider");
  }
  return ctx;
}
