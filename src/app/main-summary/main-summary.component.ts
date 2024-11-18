import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service'; // Asegúrate de que este sea el ApiService correcto
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-summary',
  standalone: true,
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.css'],
  imports: [CommonModule] // Agregar CommonModule si es necesario
})
export class MainSummaryComponent implements OnInit {
  lessons: any[] = []; // Aquí almacenamos las lecciones
  reservations: any[] = []; // Aquí almacenamos las reservas

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // Obtener el día de la semana actual
    const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toUpperCase(); // "MONDAY", "TUESDAY", etc.

    // Llamamos al servicio para obtener todas las lecciones
    this.apiService.getAllLessons().subscribe(
      (data) => {
        // Filtrar las lecciones para mostrar solo las que ocurren hoy
        this.lessons = data.filter((lesson: any) => lesson.dayWeek === today);
      },
      (error) => {
        console.error('Error al obtener las lecciones:', error);
      }
    );

    // Llamamos al servicio para obtener todas las reservas con usuarios
    this.apiService.getAllReservationsWithUsers().subscribe(
      (data) => {
        // Filtrar las reservas para mostrar solo las de hoy
        const reservationToday = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
        this.reservations = data.filter((reservation: any) => reservation.reservationDate === reservationToday);

        // Verificar si los datos de reservas tienen la estructura esperada
        console.log(this.reservations);
      },
      (error) => {
        console.error('Error al obtener las reservas:', error);
      }
    );
  }
}
