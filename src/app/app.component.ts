import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsumptionComponent } from './consumption/consumption.component';

@Component({
  selector: 'app-root',
  standalone: true,
 imports: [ConsumptionComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TelcoX Platform';
}