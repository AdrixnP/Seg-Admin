import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { InfousuarioComponent } from './infousuario/infousuario.component';
import { CommonModule } from '@angular/common'
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClassroomComponent } from './classroom/classroom.component';
import { SubjectComponent } from './subject/subject.component';
import { InfoclassroomComponent } from './infoclassroom/infoclassroom.component';
import { InfosubjectComponent } from './infosubject/infosubject.component';
import { InfolessonComponent } from './infolesson/infolesson.component';

@NgModule({
  declarations: [
    UserComponent,
    InfousuarioComponent,
    ClassroomComponent,
    InfoclassroomComponent,
    SubjectComponent,
    InfosubjectComponent,
    InfolessonComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Esto ya incluye CommonModule
    CommonModule,
    FormsModule,
    RouterModule.forRoot([  // Define tus rutas aquí
      { path: 'user', component: UserComponent },
      { path: 'userinfo/:id', component: InfousuarioComponent },  // Ruta para el componente de información del usuario
      // otras rutas
    ])
  ]
})

export class AppModule {}

