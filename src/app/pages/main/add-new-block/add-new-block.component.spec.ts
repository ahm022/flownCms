import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBlockComponent } from './add-new-block.component';

describe('AddNewBlockComponent', () => {
  let component: AddNewBlockComponent;
  let fixture: ComponentFixture<AddNewBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
