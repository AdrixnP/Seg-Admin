import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainSummaryComponent } from './main-summary/main-summary.component';
import { UserComponent } from './user/user.component';
import { ClassroomComponent } from './classroom/classroom.component';
import { InfousuarioComponent } from './infousuario/infousuario.component';
import { InfoclassroomComponent } from './infoclassroom/infoclassroom.component';
import { SubjectComponent } from './subject/subject.component';
import { InfosubjectComponent } from './infosubject/infosubject.component';
import { InfolessonComponent } from './infolesson/infolesson.component';

// Definición de las rutas
export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainSummaryComponent },
  { path: 'classroom', component: ClassroomComponent },
  { path: 'classroom/info/:id', component: InfoclassroomComponent },
  { path: 'user', component: UserComponent },
  { path: 'user/info/:id', component: InfousuarioComponent },
  { path: 'subject', component: SubjectComponent },
  { path: 'subject/info/:id', component: InfosubjectComponent},
  { path: 'lesson/info/:id', component: InfolessonComponent},
  { path: '**', redirectTo: '/main' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
