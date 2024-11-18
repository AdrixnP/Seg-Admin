import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';  // Importa tu ApiService

@Component({
  selector: 'app-infolesson',
  standalone: true,
  imports: [],
  templateUrl: './infolesson.component.html',
  styleUrls: ['./infolesson.component.css'],
})
export class InfolessonComponent implements OnInit {
  lessonId!: string;
  lessonDetails: any;
  users: any[] = [];  // Lista de usuarios detallada

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    // Obtiene el id de la lección desde la URL
    this.lessonId = this.route.snapshot.paramMap.get('id')!;
    this.loadLessonDetails();
  }

  loadLessonDetails(): void {
    // Llama al servicio para obtener los usuarios de la lección
    this.apiService.getUsersByLesson(this.lessonId).subscribe({
      next: (data: any) => {
        this.lessonDetails = data;
        const users = data.userSetHash; // Array de objetos de usuarios

        // Por cada objeto de usuario, hacer una solicitud para obtener los detalles
        users.forEach((user: any) => {
          const userId = user.id;  // Obtener solo el ID del usuario
          console.log('Attempting to fetch user with ID:', userId); // Verifica el valor de userId

          // Verifica si userId es válido (string o number)
          if (userId && (typeof userId === 'string' || typeof userId === 'number')) {
            this.apiService.getUserById(userId.toString()).subscribe({
              next: (userData: any) => {
                this.users.push(userData);  // Agregar los datos del usuario
              },
              error: (err) => {
                console.error('Error fetching user details:', err);
              }
            });
          } else {
            console.error('Invalid user ID:', userId);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching lesson details:', err);
      }
    });
  }
}
