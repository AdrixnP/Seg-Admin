import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  myModel: any;
  title = 'Seg-Admin';
  isNavVisible = false;

  toggleNav() {
    this.isNavVisible = !this.isNavVisible;
  }
}
