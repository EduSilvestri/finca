export interface Visita {
  id?: number;
  fecha: string;
  telefono: string;
  comentario?: string;
  estado?: string;
  tipoAnimal?: string;

  usuario?: {
    email?: string;
    nombre?: string;
  };

  nombreVisitante?: string;
}

  