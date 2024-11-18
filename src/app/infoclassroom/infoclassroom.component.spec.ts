import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoclassroomComponent } from './infoclassroom.component';

describe('InfoclassroomComponent', () => {
  let component: InfoclassroomComponent;
  let fixture: ComponentFixture<InfoclassroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoclassroomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoclassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
