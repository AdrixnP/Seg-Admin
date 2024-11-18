import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private classroomsSubject = new BehaviorSubject<any[]>([]);
  classrooms$ = this.classroomsSubject.asObservable();

  constructor() {}

  addClassroom(classroom: any) {
    const currentClassrooms = this.classroomsSubject.value;
    this.classroomsSubject.next([...currentClassrooms, classroom]);
  }

  updateClassroom(updatedClassroom: any) {
    const currentClassrooms = this.classroomsSubject.value.map(c =>
      c.id === updatedClassroom.id ? updatedClassroom : c
    );
    this.classroomsSubject.next(currentClassrooms);
  }

  deleteClassroom(id: number) {
    const updatedClassrooms = this.classroomsSubject.value.filter(c => c.id !== id);
    this.classroomsSubject.next(updatedClassrooms);
  }
}
