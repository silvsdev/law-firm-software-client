import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDropdownDesktopNavComponent } from './menu-dropdown-desktop-nav.component';

describe('MenuDropdownDesktopNavComponent', () => {
  let component: MenuDropdownDesktopNavComponent;
  let fixture: ComponentFixture<MenuDropdownDesktopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDropdownDesktopNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDropdownDesktopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
