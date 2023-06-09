import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageMainBoxComponent } from './home-page-main-box.component';

describe('HomePageMainBoxComponent', () => {
  let component: HomePageMainBoxComponent;
  let fixture: ComponentFixture<HomePageMainBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePageMainBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageMainBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
