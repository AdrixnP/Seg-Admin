import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';  // Asegúrate de que ApiService esté importado

@Component({
  selector: 'app-infoclassroom',
  templateUrl: './infoclassroom.component.html',
  styleUrls: ['./infoclassroom.component.css']
})
export class InfoclassroomComponent implements OnInit {
  classroomId: number = 0;  // ID del salón, inicializado como 0
  classroomInfo: any;  // Información del salón
  lessons: any[] = [];  // Lecciones disponibles
  filteredLessons: any[] = [];  // Lecciones filtradas para mostrar
  reservations: any[] = [];  // Reservas filtradas para mostrar
  selectedLessonId: number | null = null;  // ID de la lección seleccionada
  loading: boolean = false;  // Estado de carga
  errorMessage: string = '';  // Mensaje de error

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    // Captura el parámetro 'id' de la URL
    this.route.params.subscribe(params => {
      const id = +params['id'];  // Convertimos el 'id' de la URL a número
      if (id) {
        this.classroomId = id;  // Asignamos el ID del aula
        this.loadClassroomInfo(this.classroomId);  // Cargar información del salón
        this.loadLessons();  // Cargar todas las lecciones disponibles
        this.loadReservations();  // Cargar todas las reservas disponibles
      } else {
        console.error('El ID del aula no es válido');
      }
    });
  }

  loadClassroomInfo(classroomId: number): void {
    this.apiService.getClassroomById(classroomId.toString()).subscribe(
      (response: any) => {
        this.classroomInfo = response;
      },
      (error: any) => {
        console.error('Error al obtener la información del salón:', error);
      }
    );
  }

  loadLessons(): void {
    this.loading = true; // Inicia la carga
    this.apiService.getAllLessons().subscribe({
      next: (lessons) => {
        // Filtrar solo aquellas lecciones que tengan un subjectLesson no nulo
        this.lessons = lessons.filter(lesson => lesson.subjectLesson !== null && lesson.subjectLesson !== undefined);

        // Filtrar las lecciones por el aula
        this.filteredLessons = this.lessons.filter(lesson =>
          lesson.classroomLesson && lesson.classroomLesson.name === this.classroomInfo?.name
        );

        this.loading = false; // Terminamos la carga
      },
      error: (err) => {
        console.error('Error al obtener las lecciones', err);
        this.errorMessage = 'Error al cargar las lecciones'; // Mostrar mensaje de error
        this.loading = false; // Terminamos la carga
      }
    });
  }

  loadReservations(): void {
    this.loading = true; // Inicia la carga
    this.apiService.getAllReservationsWithUsers().subscribe({
      next: (reservations) => {
        // Filtrar solo las reservas que coinciden con el nombre del aula seleccionado
        this.reservations = reservations.filter(reservation =>
          reservation.classroomReservation?.name === this.classroomInfo?.name
        );

        this.loading = false; // Terminamos la carga
      },
      error: (err) => {
        console.error('Error al obtener las reservas', err);
        this.errorMessage = 'Error al cargar las reservas'; // Mostrar mensaje de error
        this.loading = false; // Terminamos la carga
      }
    });
  }

  // Método para asignar el aula a la lección
  assignClassroomToLesson(lessonId: number): void {
    if (lessonId && this.classroomId) {
      this.apiService.assignClassroomToLesson(lessonId, this.classroomId).subscribe(
        (response: any) => {
          console.log('Aula asignada correctamente:', response);
          this.loadLessons();  // Recargar las lecciones después de la asignación
        },
        (error: any) => {
          console.error('Error al asignar el aula:', error);
        }
      );
    } else {
      console.error('ID de lección o aula no válido');
    }
  }

  // Método para eliminar el aula de la lección
  removeClassroomFromLesson(lessonId: number): void {
    if (lessonId && this.classroomId) {
      this.apiService.deleteClassroomFromLesson(lessonId.toString()).subscribe(
        (response: any) => {
          console.log('Aula eliminado correctamente:', response);
          this.loadLessons();  // Recargar las lecciones
        },
        (error: any) => {
          console.error('Error al eliminar el aula:', error);
        }
      );
    }
  }
}
