import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosubjectComponent } from './infosubject.component';

describe('InfosubjectComponent', () => {
  let component: InfosubjectComponent;
  let fixture: ComponentFixture<InfosubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosubjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
