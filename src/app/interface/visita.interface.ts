export interface Visita {
    id?: number;
    fecha: string;
    telefono: string;
    comentario?: string;
    estado?: string;
    tipoAnimal?: string;
  
    // Relación con usuario
    usuario?: {
      email?: string;
      nombre?: string;
    };
  
    // Relación con animales visitados
    animales?: {
        tipo?: string;
    }[];
  }
  