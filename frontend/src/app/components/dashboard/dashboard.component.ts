import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApplicationService } from '../../services/application.service';
import { ApplicationStatistics } from '../../models/application.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatGridListModule
  ],
  template: `
    <h1>Dashboard</h1>

    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <mat-grid-list *ngIf="!loading && statistics" cols="3" rowHeight="150px" gutterSize="20px">
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Total Applications</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ statistics.totalApplications }}</h2>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Shared Components</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ statistics.sharedComponents }}</h2>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Departments</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ statistics.departments }}</h2>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [`
    mat-card {
      width: 100%;
      height: 100%;
      text-align: center;
    }

    h2 {
      font-size: 3em;
      margin: 0;
      color: #3f51b5;
    }
  `]
})
export class DashboardComponent implements OnInit {
  statistics?: ApplicationStatistics;
  loading = true;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.applicationService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
      }
    });
  }
}
