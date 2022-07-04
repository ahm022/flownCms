import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPageComponent } from './add-new-page.component';

describe('AddNewPageComponent', () => {
  let component: AddNewPageComponent;
  let fixture: ComponentFixture<AddNewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
