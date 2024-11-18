import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = `http://34.135.38.136:8080/api/v2`;

  constructor(private http: HttpClient) {}

  // User endpoints
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user`, user);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/id/${id}`);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/${id}`);
  }

  // Asignar una lección a un usuario
  assignLessonToUser(userId: string, lessonId: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user/${userId}/lesson/${lessonId}`, {});
  }



  // Subject endpoints
  createSubject(subject: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/subject`, subject);
  }

  getAllSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/subject`);
  }

  getSubjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subject/${id}`);
  }

  updateSubject(id: string, subject: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/subject/${id}`, subject);
  }

  deleteSubject(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/subject/${id}`);
  }

  // Reservation endpoints
  createReservation(reservation: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservation`, reservation);
  }

  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservation`);
  }

  getAllReservationsWithUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservation/with-users`);
  }

  getReservationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reservation/${id}`);
  }

  updateReservation(id: string, reservation: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/reservation/${id}`, reservation);
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservation/${id}`);
  }

  assignClassroomToReservation(reservationId: number, classroomId: number): Observable<any> {
    console.log(`PUT request to: ${this.baseUrl}/reservation/${reservationId}/classroom/${classroomId}`);
    return this.http.put(`${this.baseUrl}/reservation/${reservationId}/classroom/${classroomId}`, {});
  }


  associateReservationToUser(userId: string, reservationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${userId}/reservation/${reservationId}`, {});
  }

  // Lesson endpoints
  // Método para obtener las lecciones asociadas a la asignatura
  // Crear una nueva lección
  createLesson(lessonData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/lesson`, lessonData);
  }

  // Asignar una lección a una asignatura
  assignLessonToSubject(lessonId: string, subjectId: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/lesson/${lessonId}/subject/${subjectId}`, {});
  }

  // Obtener las lecciones asociadas a una asignatura
  getLessonsBySubject(subjectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/lesson/subject/${subjectId}`);
  }

  getLessonById(lessonId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/lessons/${lessonId}`);
  }

  // Obtener la asignatura con sus lecciones
  getSubjectWithLessons(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subject/with-lessons/${id}`);
  }

  // Actualizar lección
  updateLesson(lessonId: string, lessonData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/lesson/${lessonId}`, lessonData);
  }

  // Eliminar la relación de un aula en una lección
  deleteClassroomFromLesson(lessonId: string): Observable<any> {
    const url = `${this.baseUrl}/lesson/delete/classroom-in-lesson/${lessonId}`;
    return this.http.delete<any>(url);
  }

  // Eliminar la relación de la asignatura en una lección
  deleteSubjectFromLesson(lessonId: string): Observable<any> {
    const url = `${this.baseUrl}/lesson/delete/subject-in-lesson/${lessonId}`;
    return this.http.delete<any>(url);
  }

  // Eliminar una lección
  deleteLesson(lessonId: string): Observable<any> {
    const url = `${this.baseUrl}/lesson/${lessonId}`;
    return this.http.delete<any>(url);
  }

  getAllLessons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/lesson`);
  }

  // Classroom endpoints
  createClassroom(classroom: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/classroom`, classroom);
  }

  getAllClassrooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/classroom`);
  }

  getClassroomById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/classroom/${id}`);
  }

  getClassroomWithLessons(classroomId: string) {
    return this.http.get(`${this.baseUrl}/classroom/with-lessons/${classroomId}`);
  }

  updateClassroom(id: string, classroom: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/classroom/${id}`, classroom);
  }

  deleteClassroom(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/classroom/${id}`);
  }

  // Authentication endpoint
  login(uniId: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { uniId, password });
  }

  // Attendance endpoint
  registerAttendance(attendance: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/assist`, attendance);
  }

  // Infousuario
  getUserWithReservations(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/id/with-reservations/${id}`);
  }

  // Obtener usuario con lecciones
  getUserWithLessons(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/id/with-lessons/${id}`);
  }

  deleteUserLesson(userId: string, lessonId: string) {
    return this.http.delete(`${this.baseUrl}/user/delete-user-lesson/user/${userId}/lesson/${lessonId}`);
  }

  getUsersByLesson(lessonId: string) {
    return this.http.get<any>(`${this.baseUrl}/lesson/with-users/${lessonId}`);
  }

  assignClassroomToLesson(lessonId: number, classroomId: number): Observable<any> {
    // Usamos backticks para interpolar las variables dentro de la URL
    return this.http.put(`${this.baseUrl}/lesson/${lessonId}/classroom/${classroomId}`, {});
  }

  deleteClassroomFromReservation(reservationId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservation/delete/classroom-in-reservation/${reservationId}`);
  }

  deleteUserReservation(userId: string, reservationId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/delete-user-reservation/user/${userId}/reservation/${reservationId}`);
  }
}
