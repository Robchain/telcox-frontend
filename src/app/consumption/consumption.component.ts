import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

interface ConsumptionData {
  customer_id: string;
  customer_name: string;
  plan: string;
  balance: number;
  data: {
    consumed_gb: number;
    limit_gb: number;
    remaining_gb: number;
    usage_percentage: number;
  };
  minutes: {
    consumed: number;
    limit: number;
    remaining: number;
    usage_percentage: number;
  };
  last_updated: string;
}

@Component({
  selector: 'app-consumption',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent implements OnInit, OnDestroy {
  consumptionData: ConsumptionData | null = null;
  loading = false;
  error = '';
  customerId = '12345'; // Por defecto
  
  private refreshSubscription?: Subscription;
  private readonly API_BASE_URL = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadConsumptionData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  loadConsumptionData() {
    this.loading = true;
    this.error = '';
    
    this.http.get<ConsumptionData>(`${this.API_BASE_URL}/customer/${this.customerId}/consumption`)
      .subscribe({
        next: (data) => {
          this.consumptionData = data;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
          this.loading = false;
        }
      });
  }

  switchCustomer(newCustomerId: string) {
    this.customerId = newCustomerId;
    this.loadConsumptionData();
  }

  startAutoRefresh() {
    // Actualizar cada 30 segundos
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadConsumptionData();
    });
  }

  stopAutoRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      this.error = 'Cliente no encontrado. Verifique el ID de cliente.';
    } else if (error.status === 0) {
      this.error = 'No se puede conectar con el servidor. Verifique su conexión.';
    } else {
      this.error = `Error del servidor: ${error.message}`;
    }
  }

  getProgressBarClass(percentage: number): string {
    if (percentage >= 90) return 'bg-danger';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  }

  refreshData() {
    this.loadConsumptionData();
  }
}