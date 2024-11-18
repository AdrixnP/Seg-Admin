import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfousuarioComponent } from './infousuario.component';

describe('InfousuarioComponent', () => {
  let component: InfousuarioComponent;
  let fixture: ComponentFixture<InfousuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfousuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfousuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
