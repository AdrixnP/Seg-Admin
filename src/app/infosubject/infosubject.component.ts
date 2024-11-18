import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-infosubject',
  templateUrl: './infosubject.component.html',
})
export class InfosubjectComponent implements OnInit {
  subjectId: string = '';  // ID de la asignatura
  subjectNrc: string = ''; // NRC de la asignatura
  subjectInfo: any = null;  // Información de la asignatura
  lessons: any[] = [];      // Lecciones asociadas a la asignatura
  newLesson: any = {        // Nueva lección a crear
    dayWeek: '',
    startTime: '',
    endTime: ''
  };
  selectedLesson: any = null;  // Lección seleccionada para edición
  isEditMode: boolean = false;  // Modo de edición
  sortColumn: string = '';  // Columna de orden
  sortDirection: 'asc' | 'desc' = 'asc'; // Dirección de orden

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID de la asignatura desde la URL
    this.subjectId = this.route.snapshot.paramMap.get('id') || '';

    if (this.subjectId) {
      this.loadLessons();  // Si existe el ID, cargamos las lecciones
    } else {
      console.error('ID de la asignatura no válido');
    }
  }

  // Función para convertir de 12h a 24h y añadir los segundos
  convertTo24HourFormat(time: string): string {
    const [hour, minute] = time.split(':'); // Separamos las horas y los minutos
    const period = time.slice(-2); // Extraemos AM/PM

    let hours24 = parseInt(hour, 10); // Convertimos las horas a número

    if (period === 'AM') {
      if (hours24 === 12) { // 12 AM es medianoche en formato 24 horas
        hours24 = 0;
      }
    } else if (period === 'PM') {
      if (hours24 !== 12) { // 12 PM es mediodía en formato 24 horas
        hours24 += 12;
      }
    }

    // Formateamos el tiempo como HH:mm:ss, añadiendo segundos (00)
    return `${hours24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
  }


  // Cargar las lecciones asociadas a la asignatura
  loadLessons(): void {
    // Llamamos al servicio para obtener todas las lecciones
    this.apiService.getAllLessons().subscribe(
      (data) => {
        this.apiService.getSubjectById(this.subjectId).subscribe(
          (subjectData) => {
            this.subjectInfo = subjectData;  // Guardamos la información de la asignatura
            this.subjectNrc = subjectData.nrc;  // Guardamos el NRC de la asignatura

            // Filtramos las lecciones por el NRC de la asignatura
            this.lessons = data.filter((lesson: any) => lesson.subjectLesson?.nrc === this.subjectNrc);

            this.sortLessons();  // Ordenamos las lecciones
          },
          (error) => {
            console.error('Error al obtener la información de la asignatura:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener las lecciones:', error);
      }
    );
  }

  // Ordenar las lecciones
  sortLessons(): void {
    if (!this.sortColumn) return;

    this.lessons.sort((a, b) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Manejo del click en las cabeceras de la tabla para ordenar
  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortLessons();  // Ordenamos después de cambiar la columna o la dirección
  }

  // Crear una lección y asociarla a la asignatura
  onCreateLesson(): void {
    const lessonData = {
      dayWeek: this.newLesson.dayWeek,  // Día de la semana
      startTime: this.convertTo24HourFormat(this.newLesson.startTime),  // Convertimos la hora de inicio
      endTime: this.convertTo24HourFormat(this.newLesson.endTime),      // Convertimos la hora de fin
    };

    // Crear la lección primero
    this.apiService.createLesson(lessonData).subscribe(
      (createdLesson) => {
        console.log('Lección creada exitosamente:', createdLesson);

        // Una vez creada la lección, la asociamos a la asignatura
        this.apiService.assignLessonToSubject(createdLesson.id, this.subjectId).subscribe(
          (assignedLesson) => {
            console.log('Lección asignada a la asignatura exitosamente:', assignedLesson);

            // Recargamos las lecciones para que aparezca la nueva lección
            this.loadLessons();

            // Limpiamos el formulario
            this.resetForm();
          },
          (error) => {
            console.error('Error al asignar la lección a la asignatura:', error);
          }
        );
      },
      (error) => {
        console.error('Error al crear la lección:', error);
      }
    );
  }

  onUpdateLesson(): void {
    const lessonData = {
      dayWeek: this.newLesson.dayWeek,  // Día de la semana
      startTime: this.convertTo24HourFormat(this.newLesson.startTime),  // Convertimos la hora de inicio
      endTime: this.convertTo24HourFormat(this.newLesson.endTime),      // Convertimos la hora de fin
    };

    // Actualizamos la lección
    this.apiService.updateLesson(this.selectedLesson.id, lessonData).subscribe(
      (response) => {
        console.log('Lección actualizada exitosamente:', response);
        this.loadLessons();  // Recargamos las lecciones
        this.resetForm();  // Limpiamos el formulario
      },
      (error) => {
        console.error('Error al actualizar la lección:', error);
      }
    );
  }

  // Seleccionar lección para editar
  onSelectLesson(lesson: any): void {
    this.selectedLesson = { ...lesson };  // Clonamos la lección seleccionada
    this.newLesson = {
      dayWeek: lesson.dayWeek,
      startTime: lesson.startTime,
      endTime: lesson.endTime
    };
    this.isEditMode = true;  // Activamos el modo de edición
  }

  // Resetear el formulario de lección
  resetForm(): void {
    this.newLesson = { dayWeek: '', startTime: '', endTime: '' };  // Limpiamos los campos
    this.selectedLesson = null;  // Eliminamos la lección seleccionada
    this.isEditMode = false;  // Desactivamos el modo de edición
  }

  // Función principal para eliminar la lección
  onDeleteLesson(lessonId: any): void {
    console.log('onDeleteLesson: Iniciando la eliminación de la lección con ID:', lessonId);

    // Asegúrate de que lessonId sea una cadena antes de hacer split
    const lessonIdStr = lessonId.toString(); // Convertir a cadena si es un número
    const lessonIdCleaned = lessonIdStr.split(':')[0]; // Tomar solo la parte antes de ':'

    if (confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      console.log('onDeleteLesson: Confirmación aceptada para eliminar la lección.');

      // Paso 1: Obtener los usuarios inscritos en la lección
      this.apiService.getUsersByLesson(lessonIdCleaned).subscribe(
        (response: any) => {
          // Paso 2: Eliminar las relaciones de cada usuario con la lección
          response.userSetHash.forEach((user: any) => {
            this.deleteUserLessonRelationship(user.id, lessonIdCleaned);
          });

          // Paso 3: Proceder con la eliminación de la relación de aula y asignatura (ya funciona)
          if (this.selectedLesson?.classroomLesson !== null) {
            console.log('onDeleteLesson: Eliminando la relación de aula...');
            this.deleteClassroomFromLesson(lessonIdCleaned);
          } else {
            console.log('onDeleteLesson: No hay relación de aula.');
          }

          if (this.selectedLesson?.subjectLesson !== null) {
            console.log('onDeleteLesson: Eliminando la relación de asignatura...');
            this.deleteSubjectFromLesson(lessonIdCleaned);
          } else {
            console.log('onDeleteLesson: No hay relación de asignatura.');
          }

          // Llamar al servicio de eliminación pasando el ID limpio
          this.deleteLesson(lessonIdCleaned);
        },
        (error) => {
          console.error('Error al obtener los usuarios de la lección:', error);
          alert('Hubo un error al obtener los usuarios de la lección.');
        }
      );
    } else {
      console.log('onDeleteLesson: Eliminación de la lección cancelada.');
    }
  }

  // Función para eliminar la relación de un usuario con la lección
  deleteUserLessonRelationship(userId: string, lessonId: string): void {
    console.log('deleteUserLessonRelationship: Iniciando la eliminación de la relación del usuario con la lección');

    this.apiService.deleteUserLesson(userId, lessonId).subscribe(
      (response) => {
        console.log(`deleteUserLessonRelationship: Relación eliminada para el usuario con ID: ${userId}`);
      },
      (error) => {
        console.error(`deleteUserLessonRelationship: Error al eliminar la relación para el usuario con ID: ${userId}`, error);
      }
    );
  }

  deleteClassroomFromLesson(lessonId: string): void {
    console.log('deleteClassroomFromLesson: Iniciando eliminación de la relación de aula para la lección con ID:', lessonId);

    this.apiService.deleteClassroomFromLesson(lessonId).subscribe(
      (response) => {
        console.log('deleteClassroomFromLesson: Relación de aula eliminada exitosamente:', response);
      },
      (error) => {
        console.error('deleteClassroomFromLesson: Error al eliminar la relación de aula:', error);
      }
    );
  }


  deleteSubjectFromLesson(lessonId: string): void {
    console.log('deleteSubjectFromLesson: Iniciando eliminación de la relación de asignatura para la lección con ID:', lessonId);

    this.apiService.deleteSubjectFromLesson(lessonId).subscribe(
      (response) => {
        console.log('deleteSubjectFromLesson: Relación de asignatura eliminada exitosamente:', response);
      },
      (error) => {
        console.error('deleteSubjectFromLesson: Error al eliminar la relación de asignatura:', error);
      }
    );
  }

  deleteLesson(lessonId: string): void {
    this.apiService.deleteLesson(lessonId).subscribe(
      (response) => {
        console.log('Lección eliminada exitosamente:', response);
        alert('Lección eliminada exitosamente!');
        this.loadLessons(); // Actualizar la lista de materias
      },
      (error) => {
        console.error('Error eliminando la lección:', error);
        alert('No se pudo eliminar la lección.');
      }
    );
  }

}
