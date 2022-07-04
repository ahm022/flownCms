import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputValidationErrorComponent } from './input-validation-error.component';

describe('InputValidationErrorComponent', () => {
  let component: InputValidationErrorComponent;
  let fixture: ComponentFixture<InputValidationErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputValidationErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputValidationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
