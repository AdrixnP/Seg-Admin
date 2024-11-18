import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service'; // Asegúrate de que ApiService tiene los métodos adecuados para salones
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html'
})
export class ClassroomComponent implements OnInit {
  classrooms: any[] = [];  // Array para almacenar los salones
  sortColumn = '';  // Columna por la que se ordena
  sortDirection = 'asc'; // Dirección de la ordenación ('asc' o 'desc')
  formClassroom: any = {
    id: 0,
    name: '',
    capacity: 0
  };

  selectedClassroom: any = null;  // Variable para seleccionar un salón para editar
  classroomInfo: any = null; // Variable para almacenar la información del salón (para la vista detallada)
  classroomId: string | null = null; // ID del salón (si es necesario)

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute  // Inyectamos ActivatedRoute para obtener parámetros de la URL
  ) {}

  ngOnInit() {
    this.getAllClassrooms();  // Asegúrate de llamar a getAllClassrooms en ngOnInit para cargar los salones

    this.classroomId = this.route.snapshot.paramMap.get('id');

    if (this.classroomId) {
      this.apiService.getClassroomById(this.classroomId).subscribe(
        (response) => {
          this.classroomInfo = response;  // Guarda la información del salón
        },
        (error) => {
          console.error('Error fetching classroom info:', error);
        }
      );
    }
  }

  // Método para obtener todos los salones
  getAllClassrooms() {
    this.apiService.getAllClassrooms().subscribe(
      (data: any[]) => {
        this.classrooms = data; // Asignar los salones al array
      },
      (error) => {
        console.error('Error fetching classrooms:', error); // Manejar error
      }
    );
  }

  // Método para crear un nuevo salón
  onCreate() {
    if (this.formClassroom.name && this.formClassroom.capacity) {
      this.apiService.createClassroom(this.formClassroom).subscribe(
        (response) => {
          console.log('Classroom created successfully:', response);
          this.getAllClassrooms(); // Actualizar la lista de salones
          this.router.navigate(['/classroom']); // Redirigir a la lista de salones
        },
        (error) => {
          console.error('Error creating classroom:', error);
        }
      );
    } else {
      console.warn('Formulario incompleto');
    }
  }

  // Método para editar un salón
  onEdit(classroom: any) {
    this.selectedClassroom = { ...classroom };  // Copiar los datos del salón
    this.formClassroom = { ...classroom };      // Rellenar el formulario con los datos
  }

  // Método para actualizar un salón
  onUpdate(classroom: any) {
    if (classroom.name && classroom.capacity) {
      this.apiService.updateClassroom(classroom.id, classroom).subscribe(
        (response) => {
          console.log('Classroom updated:', response);
          this.getAllClassrooms();
          this.resetForm();  // Limpiar el formulario después de actualizar
        },
        (error) => {
          console.error('Error updating classroom:', error);
        }
      );
    } else {
      console.warn('Formulario incompleto');
    }
  }

  // Método para eliminar un salón
  onDelete(classroomId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este salón?')) {
      this.apiService.deleteClassroom(classroomId).subscribe(
        (response) => {
          console.log('Classroom deleted successfully:', response);
          alert('Classroom deleted successfully!');
          this.getAllClassrooms(); // Actualizar la lista de salones
        },
        (error) => {
          console.error('Error deleting classroom:', error);
          alert('Failed to delete classroom.');
        }
      );
    }
  }

  resetForm() {
    this.formClassroom = {
      id: 0,
      name: '',
      capacity: 0
    };
    this.selectedClassroom = null;
  }

  // Función para ordenar los datos
  sortData() {
    if (this.sortColumn) {
      this.classrooms.sort((a, b) => {
        if (a[this.sortColumn] < b[this.sortColumn]) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (a[this.sortColumn] > b[this.sortColumn]) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
  }

  // Función para cambiar la columna y la dirección del orden
  onSort(column: string) {
    if (this.sortColumn === column) {
      // Si ya está ordenado por esta columna, cambiar la dirección
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si la columna es nueva, ordenar ascendente por defecto
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();  // Ordenar los datos según la nueva columna y dirección
  }
}
