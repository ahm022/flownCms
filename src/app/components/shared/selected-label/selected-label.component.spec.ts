import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedLabelComponent } from './selected-label.component';

describe('SelectedLabelComponent', () => {
  let component: SelectedLabelComponent;
  let fixture: ComponentFixture<SelectedLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
