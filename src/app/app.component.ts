import { Component } from '@angular/core';
import { UserAppComponent } from './components/user-app.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserAppComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'user-app';
}
