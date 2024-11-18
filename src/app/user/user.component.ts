import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { InfousuarioComponent } from '../infousuario/infousuario.component';
import { CommonModule } from '@angular/common';
import { AppModule } from '../app.module';
import { Router, ActivatedRoute, RouterModule  } from '@angular/router'; // Añadir ActivatedRoute para acceder a los parámetros de la URL

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  users: any[] = []; // Array para almacenar los usuarios
  sortColumn = '';  // Columna por la que se ordena
  sortDirection = 'asc'; // Dirección de la ordenación ('asc' o 'desc')
  formUser: any = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    uniId: '',
    password: '',
    role: 'USER'
  };

  selectedUser: any = null; // Variable para seleccionar un usuario para editar
  userInfo: any = null; // Variable para almacenar la información del usuario (para la vista detallada)
  userId: string | null = null; // ID del usuario (si es necesario)

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute  // Inyectamos ActivatedRoute para obtener parámetros de la URL
  ) {}

  ngOnInit() {
    this.getAllUsers();  // Asegúrate de llamar a getAllUsers en ngOnInit para cargar los usuarios

    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.apiService.getUserById(this.userId).subscribe(
        (response) => {
          this.userInfo = response;  // Guarda la información del usuario
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  // Método para obtener todos los usuarios
  getAllUsers() {
    this.apiService.getAllUsers().subscribe(
      (data: any[]) => {
        this.users = data; // Asignar los usuarios al array
      },
      (error) => {
        console.error('Error fetching users:', error); // Manejar error
      }
    );
  }

  // Método para crear un nuevo usuario
  onCreate() {
    this.apiService.createUser(this.formUser).subscribe(
      (response) => {
        console.log('User created successfully:', response);
        this.getAllUsers(); // Actualizar la lista de usuarios
        this.router.navigate(['/user']); // Redirigir a la lista de usuarios
      },
      (error) => {
        console.error('Error creating user:', error);
      }
    );
  }

  onEdit(user: any) {
    this.selectedUser = { ...user };  // Copiar los datos del usuario
    this.formUser = { ...user };      // Rellenar el formulario con los datos
  }

  // Método para actualizar un usuario
  onUpdate(user: any) {
    this.apiService.updateUser(user.id, user).subscribe(
      (response) => {
        console.log('Usuario actualizado:', response);
        this.getAllUsers();
        this.resetForm();  // Limpiar el formulario después de actualizar
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  // Método para eliminar un usuario
  onDelete(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(userId).subscribe(
        (response) => {
          console.log('User deleted successfully:', response);
          alert('User deleted successfully!');
          this.getAllUsers(); // Actualizar la lista de usuarios
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user.');
        }
      );
    }
  }

  resetForm() {
    this.formUser = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      uniId: '',
      password: '',
      role: 'USER'
    };
    this.selectedUser = null;
  }

   // Función para ordenar los datos
  sortData() {
    if (this.sortColumn) {
      this.users.sort((a, b) => {
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
