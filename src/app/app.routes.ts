import { Routes } from '@angular/router';
import { ConsumptionComponent } from './consumption/consumption.component';

export const routes: Routes = [
  { path: '', redirectTo: '/consumption', pathMatch: 'full' },
  { path: 'consumption', component: ConsumptionComponent },
  { path: '**', redirectTo: '/consumption' }
];