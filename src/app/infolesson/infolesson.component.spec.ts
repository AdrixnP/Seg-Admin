import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfolessonComponent } from './infolesson.component';

describe('InfolessonComponent', () => {
  let component: InfolessonComponent;
  let fixture: ComponentFixture<InfolessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfolessonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfolessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
