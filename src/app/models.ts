// src/app/models.ts

export interface User {
  id: number;
  idUni: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  // Considera no incluir 'password' en la interfaz por razones de seguridad
}

export interface Classroom {
  id: number;
  name: string;
  capacity: number;
}

export interface Class {
  id: number;
  name: string;
  dayWeek: string; // Podrías usar un tipo 'enum' para los días de la semana
  startTime: string; // También podrías usar Date si prefieres
  endTime: string;
}

export interface Reservation {
  id: number;
  reservationDate: string; // Puedes usar Date si necesitas manipular fechas
  startTime: string;
  endTime: string;
  classroom: Classroom; // Relación con el salón
}
