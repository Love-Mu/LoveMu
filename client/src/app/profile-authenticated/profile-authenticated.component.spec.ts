import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAuthenticatedComponent } from './profile-authenticated.component';

describe('ProfileAuthenticatedComponent', () => {
  let component: ProfileAuthenticatedComponent;
  let fixture: ComponentFixture<ProfileAuthenticatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileAuthenticatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
