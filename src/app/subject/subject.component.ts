import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html'
})
export class SubjectComponent implements OnInit {
  subjects: any[] = []; // Array para almacenar las materias
  sortColumn = '';  // Columna por la que se ordena
  sortDirection = 'asc'; // Dirección de la ordenación ('asc' o 'desc')
  formSubject: any = {
    id: 0,
    nrc: '',
    name: ''
  };

  selectedSubject: any = null; // Variable para seleccionar una materia para editar
  subjectInfo: any = null; // Variable para almacenar la información de la materia
  subjectId: string | null = null; // ID de la materia (si es necesario)

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute  // Inyectamos ActivatedRoute para obtener parámetros de la URL
  ) {}

  ngOnInit() {
    this.getAllSubjects();  // Llamar a getAllSubjects para cargar las materias

    this.subjectId = this.route.snapshot.paramMap.get('id');

    if (this.subjectId) {
      this.apiService.getSubjectById(this.subjectId).subscribe(
        (response) => {
          this.subjectInfo = response;  // Guarda la información de la materia
        },
        (error) => {
          console.error('Error fetching subject info:', error);
        }
      );
    }
  }

  // Método para obtener todas las materias
  getAllSubjects() {
    this.apiService.getAllSubjects().subscribe(
      (data: any[]) => {
        this.subjects = data; // Asignar las materias al array
      },
      (error) => {
        console.error('Error fetching subjects:', error); // Manejar error
      }
    );
  }

  // Método para crear una nueva materia
  onCreate() {
    this.apiService.createSubject(this.formSubject).subscribe(
      (response) => {
        console.log('Materia creada exitosamente:', response);
        this.getAllSubjects(); // Actualizar la lista de materias
        this.router.navigate(['/subject']); // Redirigir a la lista de materias
      },
      (error) => {
        console.error('Error creando la materia:', error);
      }
    );
  }

  // Método para editar una materia
  onEdit(subject: any) {
    this.selectedSubject = { ...subject };  // Copiar los datos de la materia
    this.formSubject = { ...subject };      // Rellenar el formulario con los datos
  }

  // Método para actualizar una materia
  onUpdate(subject: any) {
    this.apiService.updateSubject(subject.id, subject).subscribe(
      (response) => {
        console.log('Materia actualizada:', response);
        this.getAllSubjects(); // Actualizar la lista de materias
        this.resetForm();  // Limpiar el formulario después de actualizar
      },
      (error) => {
        console.error('Error al actualizar la materia:', error);
      }
    );
  }

  // Método para eliminar una materia
  onDelete(subjectId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      this.apiService.deleteSubject(subjectId).subscribe(
        (response) => {
          console.log('Materia eliminada exitosamente:', response);
          alert('Materia eliminada exitosamente!');
          this.getAllSubjects(); // Actualizar la lista de materias
        },
        (error) => {
          console.error('Error eliminando la materia:', error);
          alert('No se pudo eliminar la materia.');
        }
      );
    }
  }

  // Resetear el formulario
  resetForm() {
    this.formSubject = {
      id: 0,
      nrc: '',
      name: ''
    };
    this.selectedSubject = null;
  }

  // Función para ordenar las materias
  sortData() {
    if (this.sortColumn) {
      this.subjects.sort((a, b) => {
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
