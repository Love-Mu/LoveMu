import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessaginglayoutstuffComponent } from './messaginglayoutstuff.component';

describe('MessaginglayoutstuffComponent', () => {
  let component: MessaginglayoutstuffComponent;
  let fixture: ComponentFixture<MessaginglayoutstuffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessaginglayoutstuffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessaginglayoutstuffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
