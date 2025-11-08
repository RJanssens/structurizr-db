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
import { MatSelectModule } from '@angular/material/select';
import { RepositoryService } from '../../services/repository.service';
import { Repository } from '../../models/repository.model';

@Component({
  selector: 'app-repository-list',
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
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  template: `
    <h1>GitLab Repositories</h1>

    <mat-card>
      <mat-card-content>
        <div style="display: flex; gap: 16px; align-items: center;">
          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Search repositories</mat-label>
            <input matInput [(ngModel)]="searchTerm" (keyup.enter)="search()" placeholder="Search by name or description">
            <button mat-icon-button matSuffix (click)="search()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>

          <mat-form-field appearance="outline" style="width: 200px;">
            <mat-label>Filter</mat-label>
            <mat-select [(ngModel)]="filterType" (selectionChange)="applyFilter()">
              <mat-option value="all">All Repositories</mat-option>
              <mat-option value="enabled">Enabled</mat-option>
              <mat-option value="active">Active</mat-option>
              <mat-option value="archived">Archived</mat-option>
              <mat-option value="without-apps">Without Applications</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-content>
    </mat-card>

    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <mat-card *ngIf="!loading">
      <mat-card-content>
        <table mat-table [dataSource]="repositories" class="mat-elevation-z0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let repo">
              <a [routerLink]="['/repositories', repo.id]">{{ repo.name }}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="namespace">
            <th mat-header-cell *matHeaderCellDef>Namespace</th>
            <td mat-cell *matCellDef="let repo">{{ repo.namespacePath || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let repo">
              {{ repo.description ? (repo.description.length > 60 ? repo.description.substring(0, 60) + '...' : repo.description) : 'N/A' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="visibility">
            <th mat-header-cell *matHeaderCellDef>Visibility</th>
            <td mat-cell *matCellDef="let repo">
              <mat-chip [style.background-color]="getVisibilityColor(repo.visibility)">
                {{ repo.visibility || 'N/A' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="applications">
            <th mat-header-cell *matHeaderCellDef>Applications</th>
            <td mat-cell *matCellDef="let repo">
              {{ repo.applicationCount || 0 }}
            </td>
          </ng-container>

          <ng-container matColumnDef="scans">
            <th mat-header-cell *matHeaderCellDef>Scans</th>
            <td mat-cell *matCellDef="let repo">
              {{ repo.scanCount || 0 }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let repo">
              <mat-chip *ngIf="repo.isArchived" color="warn">Archived</mat-chip>
              <mat-chip *ngIf="!repo.isArchived && repo.isEnabledForScanning" color="accent">Enabled</mat-chip>
              <mat-chip *ngIf="!repo.isArchived && !repo.isEnabledForScanning">Disabled</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="lastScan">
            <th mat-header-cell *matHeaderCellDef>Last Scan</th>
            <td mat-cell *matCellDef="let repo">
              {{ repo.lastScanAt ? (repo.lastScanAt | date:'short') : 'Never' }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="repositories.length === 0" style="text-align: center; padding: 20px;">
          <p>No repositories found.</p>
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

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
  `]
})
export class RepositoryListComponent implements OnInit {
  repositories: Repository[] = [];
  displayedColumns: string[] = ['name', 'namespace', 'description', 'visibility', 'applications', 'scans', 'status', 'lastScan'];
  searchTerm = '';
  filterType = 'all';
  loading = true;

  constructor(private repositoryService: RepositoryService) {}

  ngOnInit(): void {
    this.loadRepositories();
  }

  loadRepositories(): void {
    this.repositoryService.getAllRepositories().subscribe({
      next: (repos) => {
        this.repositories = repos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading repositories:', error);
        this.loading = false;
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.repositoryService.searchRepositories(this.searchTerm).subscribe({
        next: (repos) => {
          this.repositories = repos;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching repositories:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadRepositories();
    }
  }

  applyFilter(): void {
    this.loading = true;
    let observable;

    switch (this.filterType) {
      case 'enabled':
        observable = this.repositoryService.getEnabledRepositories();
        break;
      case 'active':
        observable = this.repositoryService.getActiveRepositories();
        break;
      case 'archived':
        observable = this.repositoryService.getArchivedRepositories();
        break;
      case 'without-apps':
        observable = this.repositoryService.getRepositoriesWithoutApplications();
        break;
      default:
        observable = this.repositoryService.getAllRepositories();
    }

    observable.subscribe({
      next: (repos) => {
        this.repositories = repos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering repositories:', error);
        this.loading = false;
      }
    });
  }

  getVisibilityColor(visibility?: string): string {
    switch (visibility?.toLowerCase()) {
      case 'public':
        return '#4caf50';
      case 'private':
        return '#f44336';
      case 'internal':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  }
}
