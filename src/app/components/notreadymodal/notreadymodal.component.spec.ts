import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotreadymodalComponent } from './notreadymodal.component';

describe('NotreadymodalComponent', () => {
  let component: NotreadymodalComponent;
  let fixture: ComponentFixture<NotreadymodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotreadymodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotreadymodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
