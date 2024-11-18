import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainSummaryComponent } from './main-summary.component';
import { CommonModule } from '@angular/common'; // Import CommonModule for Angular directives like @for
import { DatePipe } from '@angular/common'; // Import DatePipe if used in the template

describe('MainSummaryComponent', () => {
  let component: MainSummaryComponent;
  let fixture: ComponentFixture<MainSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule], // Add CommonModule
      declarations: [MainSummaryComponent], // Declare the component
      providers: [DatePipe] // Provide DatePipe if it's used in the template
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
