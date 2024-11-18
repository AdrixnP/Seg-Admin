import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-infousuario',
  templateUrl: './infousuario.component.html'
})
export class InfousuarioComponent implements OnInit {
  formUser: any = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    uniId: '',
    role: 'USER',
    lessonSetHas: [], // Lecciones
    reservationSetHash: [] // Reservas
  };

  lessons: any[] = []; // Para almacenar todas las lecciones disponibles
  filteredLessons: any[] = []; // Lecciones filtradas
  classrooms: any[] = []; // Salones disponibles
  selectedLessonId: number | null = null; // Lección seleccionada
  selectedClassroomId: number | null = null; // Salón seleccionado
  userId: string = ''; // ID del usuario
  loading: boolean = false; // Para controlar el estado de carga
  errorMessage: string = ''; // Para mostrar mensajes de error
  selectedReservation: any | null = null; // Reserva seleccionada para edición
  reservationData: any = { reservationDate: '', startTime: '', endTime: '' }; // Datos del formulario
  isEditMode: boolean = false; // Modo de edición activado/desactivado
  reservations: any[] = []; // Lista de reservas existentes

  // Nuevas variables para manejar reservas
  reservationDate: string = '';
  startTime: string = '';
  endTime: string = '';
  reservationId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id']; // Extraemos el ID del usuario de la URL
      this.loadUserData(); // Cargamos los datos del usuario y las reservas asociadas
      this.loadLessons(); // Cargamos todas las lecciones disponibles
      this.loadClassrooms(); // Cargamos los salones disponibles
    });
  }

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


  // Método para cargar los datos del usuario con sus lecciones
  loadUserData(): void {
    this.apiService.getUserWithLessons(this.userId).subscribe({
      next: (userWithLessons) => {
        this.formUser = userWithLessons; // Asignamos los datos del usuario y sus lecciones
        console.log('Datos del usuario:', this.formUser);

        // Llamar a loadUserReservations después de que formUser esté cargado
        this.loadUserReservations();
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario con lecciones', err);
        this.errorMessage = 'Error al cargar los datos del usuario'; // Mostrar mensaje de error
      }
    });
  }


  // Método para cargar todas las lecciones disponibles
  loadLessons(): void {
    this.loading = true; // Inicia la carga
    this.apiService.getAllLessons().subscribe({
      next: (lessons) => {
        // Filtrar solo aquellas lecciones que tengan un subjectLesson no nulo
        this.lessons = lessons.filter(lesson => lesson.subjectLesson !== null && lesson.subjectLesson !== undefined);

        // Actualizamos las lecciones filtradas
        this.filteredLessons = [...this.lessons];

        this.loading = false; // Terminamos la carga
      },
      error: (err) => {
        console.error('Error al obtener las lecciones', err);
        this.errorMessage = 'Error al cargar las lecciones'; // Mostrar mensaje de error
        this.loading = false; // Terminamos la carga
      }
    });
  }

  // Método para cargar todos los salones disponibles
  loadClassrooms(): void {
    this.loading = true;
    this.apiService.getAllClassrooms().subscribe({
      next: (classrooms) => {
        this.classrooms = classrooms; // Cargamos los salones disponibles
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener los salones', err);
        this.errorMessage = 'Error al cargar los salones';
        this.loading = false;
      }
    });
  }

  // Método para asignar una lección a un usuario
  assignLessonToUser(): void {
    if (this.selectedLessonId) {
      // Convertimos selectedLessonId a string
      this.apiService.assignLessonToUser(this.userId, this.selectedLessonId.toString()).subscribe({
        next: (response) => {
          console.log('Lección asignada con éxito');
          // Actualizamos la lista de lecciones del usuario
          this.loadUserData(); // Recargamos los datos del usuario y sus lecciones
        },
        error: (err) => {
          console.error('Error al asignar la lección al usuario:', err);
          this.errorMessage = 'Error al asignar la lección al usuario'; // Mostrar mensaje de error
        }
      });
    } else {
      this.errorMessage = 'Debes seleccionar una lección antes de asignarla'; // Mensaje si no se selecciona lección
    }
  }

  // Método para eliminar una lección de un usuario
  removeLessonFromUser(lessonId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      console.log('Relación con la lección eliminada con éxito');
      // Llamar a la API para eliminar la relación de la lección con el usuario
      this.apiService.deleteUserLesson(this.userId, lessonId.toString()).subscribe({
        next: (response) => {
          console.log('Relación con la lección eliminada con éxito');
          // Recargamos los datos del usuario y sus lecciones
          this.loadUserData();
        },
        error: (err) => {
          console.error('Error al eliminar la relación con la lección:', err);
          this.errorMessage = 'Error al eliminar la relación con la lección'; // Mostrar mensaje de error
        }
      });
    } else {
      console.log('Eliminación de la relación con la lección cancelada.');
    }
  }

  // Cargar todas las reservas
  loadReservations(): void {
    this.apiService.getAllReservationsWithUsers().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
      },
    });
  }

  onCreateReservation(): void {
    const reservationData = {
      reservationDate: this.reservationData.reservationDate,
      startTime: this.convertTo24HourFormat(this.reservationData.startTime),
      endTime: this.convertTo24HourFormat(this.reservationData.endTime),
      classroomId: this.selectedClassroomId,
    };

    if (!reservationData.classroomId) {
      console.error('Error: Debes seleccionar un salón.');
      this.errorMessage = 'Debe seleccionar un salón para la reserva.';
      return;
    }

    this.apiService.createReservation(reservationData).pipe(
      switchMap((response: { id: number }) => {
        console.log('Reserva creada exitosamente:', response);
        if (response && response.id) {
          this.reservationId = response.id;
          if (this.selectedClassroomId) {
            console.log('Asignando salón con ID:', this.selectedClassroomId);
            return this.apiService.assignClassroomToReservation(
              this.reservationId,
              this.selectedClassroomId
            );
          } else {
            throw new Error('ID del salón es inválido.');
          }
        } else {
          throw new Error('No se obtuvo el ID de la reserva.');
        }
      })
    ).subscribe({
      next: () => {
        console.log('Reserva creada y salón asignado exitosamente.');
        this.loadReservations();
        this.resetForm();
        // Asociar la reserva al usuario
        this.associateReservationToUser();
      },
      error: (err) => {
        console.error('Error al procesar la reserva o asignar el salón:', err);
        this.errorMessage = 'Error al procesar la solicitud.';
      },
    });
  }

  // Actualizar una reserva existente
  onUpdateReservation(): void {
    if (this.selectedReservation) {
      const reservationData = {
        ...this.reservationData,
        startTime: this.convertTo24HourFormat(this.reservationData.startTime),
        endTime: this.convertTo24HourFormat(this.reservationData.endTime),
      };

      this.apiService.updateReservation(this.selectedReservation.id, reservationData).subscribe({
        next: (response) => {
          console.log('Reserva actualizada exitosamente:', response);
          this.loadReservations(); // Recargar la lista de reservas
          this.resetForm(); // Limpiar el formulario
        },
        error: (err) => {
          console.error('Error al actualizar la reserva:', err);
        },
      });
    }
  }

  // Seleccionar una reserva para editar
  onSelectReservation(reservation: any): void {
    this.selectedReservation = { ...reservation }; // Clonar los datos de la reserva
    this.reservationData = {
      reservationDate: reservation.reservationDate,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    };
    this.isEditMode = true; // Activar modo de edición
  }

  // Resetear el formulario
  resetForm(): void {
    this.reservationData = { reservationDate: '', startTime: '', endTime: '' }; // Limpiar campos
    this.selectedReservation = null; // Deseleccionar la reserva
    this.isEditMode = false; // Desactivar modo de edición
  }

  assignClassroomToReservation(): void {
    if (!this.reservationId || !this.selectedClassroomId) {
      this.errorMessage = 'Error: No se puede asignar el salón porque falta el ID de la reserva o el salón.';
      return;
    }

    this.apiService.assignClassroomToReservation(this.reservationId, this.selectedClassroomId).subscribe({
      next: () => {
        console.log(`Salón con ID ${this.selectedClassroomId} asignado a la reserva ${this.reservationId} con éxito.`);
      },
      error: (err) => {
        console.error('Error al asignar el salón a la reserva', err);
        this.errorMessage = 'Error al asignar el salón a la reserva.';
      }
    });
  }

  // Método para asociar la reserva al usuario
  associateReservationToUser(): void {
    if (this.reservationId) {
      this.apiService.associateReservationToUser(this.userId, this.reservationId).subscribe({
        next: () => {
          console.log('Reserva asociada al usuario');
          this.loadUserData(); // Recargamos los datos del usuario
        },
        error: (err) => {
          console.error('Error al asociar la reserva al usuario', err);
          this.errorMessage = 'Error al asociar la reserva';
        }
      });
    }
  }

  loadUserReservations(): void {
    this.apiService.getAllReservationsWithUsers().subscribe({
      next: (reservations: any[]) => {
        if (this.formUser && this.formUser.uniId) {
          this.formUser.reservationSetHash = reservations.filter((reservation) =>
            reservation.userSetHash.some((user: any) => user.uniId === this.formUser.uniId)
          );
          console.log('Reservas del usuario:', this.formUser.reservationSetHash);
        } else {
          console.warn('El uniId del usuario no está definido.');
        }
      },
      error: (err) => {
        console.error('Error al obtener las reservas con usuarios', err);
        this.errorMessage = 'Error al cargar las reservas del usuario';
      }
    });
  }

  onDeleteReservation(reservationId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      // Primero, eliminamos la relación entre el usuario y la reserva
      this.apiService.deleteUserReservation(this.userId, reservationId).subscribe({
        next: () => {
          console.log('Relación entre usuario y reserva eliminada con éxito');

          // Luego, eliminamos la relación entre el salón y la reserva
          this.apiService.deleteClassroomFromReservation(reservationId).subscribe({
            next: () => {
              console.log('Relación de salón con la reserva eliminada con éxito');

              // Finalmente, eliminamos la reserva
              this.apiService.deleteReservation(reservationId).subscribe({
                next: () => {
                  console.log('Reserva eliminada con éxito');
                  this.loadUserData(); // Recargamos los datos del usuario y sus reservas
                },
                error: (err) => {
                  console.error('Error al eliminar la reserva', err);
                  this.errorMessage = 'Error al eliminar la reserva';
                }
              });
            },
            error: (err) => {
              console.error('Error al eliminar la relación de salón con la reserva', err);
              this.errorMessage = 'Error al eliminar la relación con el salón';
            }
          });
        },
        error: (err) => {
          console.error('Error al eliminar la relación entre el usuario y la reserva', err);
          this.errorMessage = 'Error al eliminar la relación entre el usuario y la reserva';
        }
      });
    } else {
      console.log('Eliminación de la reserva cancelada.');
    }
  }

}
