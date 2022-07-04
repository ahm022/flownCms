import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultipleValueComponent } from './select-multiple-value.component';

describe('SelectMultipleValueComponent', () => {
  let component: SelectMultipleValueComponent;
  let fixture: ComponentFixture<SelectMultipleValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMultipleValueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMultipleValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
