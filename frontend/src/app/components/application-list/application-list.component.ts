import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h1>Applications</h1>

    <mat-card>
      <mat-card-content>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Search applications</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup.enter)="search()" placeholder="Search by name or description">
          <button mat-icon-button matSuffix (click)="search()">
            <mat-icon>search</mat-icon>
          </button>
        </mat-form-field>
      </mat-card-content>
    </mat-card>

    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <mat-card *ngIf="!loading">
      <mat-card-content>
        <table mat-table [dataSource]="applications" class="mat-elevation-z0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let app">
              <a [routerLink]="['/applications', app.id]">{{ app.name }}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let app">{{ app.description || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let app">{{ app.department || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="version">
            <th mat-header-cell *matHeaderCellDef>Version</th>
            <td mat-cell *matCellDef="let app">{{ app.currentVersion }}</td>
          </ng-container>

          <ng-container matColumnDef="isShared">
            <th mat-header-cell *matHeaderCellDef>Shared</th>
            <td mat-cell *matCellDef="let app">
              <mat-chip *ngIf="app.isSharedComponent" color="accent">Shared</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="lastScanned">
            <th mat-header-cell *matHeaderCellDef>Last Scanned</th>
            <td mat-cell *matCellDef="let app">
              {{ app.lastScannedAt ? (app.lastScannedAt | date:'short') : 'Never' }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="applications.length === 0" style="text-align: center; padding: 20px;">
          <p>No applications found.</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    table {
      width: 100%;
    }

    a {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  displayedColumns: string[] = ['name', 'description', 'department', 'version', 'isShared', 'lastScanned'];
  searchTerm = '';
  loading = true;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getAllApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.applicationService.searchApplications(this.searchTerm).subscribe({
        next: (apps) => {
          this.applications = apps;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching applications:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadApplications();
    }
  }
}
