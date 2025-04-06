import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesktopNavComponent } from '../../../navigation/desktop-nav/desktop-nav.component';
import { MobileNavComponent } from '../../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, DesktopNavComponent, MobileNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
