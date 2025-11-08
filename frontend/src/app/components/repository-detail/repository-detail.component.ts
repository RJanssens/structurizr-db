import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RepositoryService } from '../../services/repository.service';
import { RepositoryScanService } from '../../services/repository-scan.service';
import { Repository, RepositoryScan } from '../../models/repository.model';

@Component({
  selector: 'app-repository-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule
  ],
  template: `
    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <div *ngIf="!loading && repository">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h1>{{ repository.name }}</h1>
        <div>
          <a mat-raised-button [href]="repository.webUrl" target="_blank" *ngIf="repository.webUrl">
            <mat-icon>open_in_new</mat-icon>
            View in GitLab
          </a>
        </div>
      </div>

      <mat-tab-group>
        <mat-tab label="Overview">
          <div style="padding: 20px;">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Repository Details</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="detail-grid">
                  <div class="detail-item">
                    <strong>Namespace:</strong>
                    <span>{{ repository.namespacePath || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Visibility:</strong>
                    <mat-chip [style.background-color]="getVisibilityColor(repository.visibility)">
                      {{ repository.visibility || 'N/A' }}
                    </mat-chip>
                  </div>
                  <div class="detail-item">
                    <strong>Default Branch:</strong>
                    <span>{{ repository.defaultBranch || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>GitLab Project ID:</strong>
                    <span>{{ repository.gitlabProjectId || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Status:</strong>
                    <div>
                      <mat-chip *ngIf="repository.isArchived" color="warn">Archived</mat-chip>
                      <mat-chip *ngIf="!repository.isArchived && repository.isEnabledForScanning" color="accent">Enabled for Scanning</mat-chip>
                      <mat-chip *ngIf="!repository.isArchived && !repository.isEnabledForScanning">Disabled</mat-chip>
                    </div>
                  </div>
                  <div class="detail-item">
                    <strong>Repository URL:</strong>
                    <a [href]="repository.url" target="_blank">{{ repository.url }}</a>
                  </div>
                  <div class="detail-item" *ngIf="repository.description">
                    <strong>Description:</strong>
                    <span>{{ repository.description }}</span>
                  </div>
                  <div class="detail-item" *ngIf="repository.topics">
                    <strong>Topics:</strong>
                    <span>{{ repository.topics }}</span>
                  </div>
                  <div class="detail-item" *ngIf="repository.languages">
                    <strong>Languages:</strong>
                    <span>{{ repository.languages }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Last Activity:</strong>
                    <span>{{ repository.lastActivityAt ? (repository.lastActivityAt | date:'medium') : 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Created in GitLab:</strong>
                    <span>{{ repository.gitlabCreatedAt ? (repository.gitlabCreatedAt | date:'medium') : 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Last Synced:</strong>
                    <span>{{ repository.lastSyncedAt ? (repository.lastSyncedAt | date:'medium') : 'Never' }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card style="margin-top: 16px;">
              <mat-card-header>
                <mat-card-title>Statistics</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">{{ repository.applicationCount || 0 }}</div>
                    <div class="stat-label">Applications</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ repository.scanCount || 0 }}</div>
                    <div class="stat-label">Total Scans</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ repository.lastScanAt ? (repository.lastScanAt | date:'short') : 'Never' }}</div>
                    <div class="stat-label">Last Scan</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card style="margin-top: 16px;" *ngIf="repository.applications && repository.applications.length > 0">
              <mat-card-header>
                <mat-card-title>Applications ({{ repository.applications.length }})</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div *ngFor="let app of repository.applications" class="app-item">
                  <a [routerLink]="['/applications', app.id]">{{ app.name }}</a>
                  <span *ngIf="app.description"> - {{ app.description }}</span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Scan History">
          <div style="padding: 20px;">
            <div *ngIf="loadingScans" class="loading-spinner">
              <mat-spinner></mat-spinner>
            </div>

            <mat-card *ngIf="!loadingScans">
              <mat-card-content>
                <table mat-table [dataSource]="scans" class="mat-elevation-z0">
                  <ng-container matColumnDef="scanStartedAt">
                    <th mat-header-cell *matHeaderCellDef>Started</th>
                    <td mat-cell *matCellDef="let scan">{{ scan.scanStartedAt | date:'short' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="branch">
                    <th mat-header-cell *matHeaderCellDef>Branch</th>
                    <td mat-cell *matCellDef="let scan">{{ scan.scannedBranch }}</td>
                  </ng-container>

                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef>Type</th>
                    <td mat-cell *matCellDef="let scan">
                      <mat-chip>{{ scan.scanType }}</mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let scan">
                      <mat-chip [style.background-color]="getScanStatusColor(scan.scanStatus)">
                        {{ scan.scanStatus }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="duration">
                    <th mat-header-cell *matHeaderCellDef>Duration</th>
                    <td mat-cell *matCellDef="let scan">
                      {{ scan.scanDurationSeconds ? formatDuration(scan.scanDurationSeconds) : 'N/A' }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="applications">
                    <th mat-header-cell *matHeaderCellDef>Apps</th>
                    <td mat-cell *matCellDef="let scan">{{ scan.applicationsFound || 0 }}</td>
                  </ng-container>

                  <ng-container matColumnDef="technologies">
                    <th mat-header-cell *matHeaderCellDef>Techs</th>
                    <td mat-cell *matCellDef="let scan">{{ scan.technologiesFound || 0 }}</td>
                  </ng-container>

                  <ng-container matColumnDef="interfaces">
                    <th mat-header-cell *matHeaderCellDef>Interfaces</th>
                    <td mat-cell *matCellDef="let scan">{{ scan.interfacesFound || 0 }}</td>
                  </ng-container>

                  <ng-container matColumnDef="initiatedBy">
                    <th mat-header-cell *matHeaderCellDef>Initiated By</th>
                    <td mat-cell *matCellDef="let scan">{{ scan.initiatedBy || 'N/A' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="error">
                    <th mat-header-cell *matHeaderCellDef>Error</th>
                    <td mat-cell *matCellDef="let scan">
                      <mat-icon *ngIf="scan.errorMessage" color="warn" [matTooltip]="scan.errorMessage">error</mat-icon>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="scanColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: scanColumns;"></tr>
                </table>

                <div *ngIf="scans.length === 0" style="text-align: center; padding: 20px;">
                  <p>No scans found for this repository.</p>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>

    <div *ngIf="!loading && !repository" style="text-align: center; padding: 40px;">
      <h2>Repository not found</h2>
      <button mat-raised-button routerLink="/repositories">Back to Repositories</button>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item strong {
      color: #666;
      font-size: 0.9em;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .stat-card {
      text-align: center;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #3f51b5;
    }

    .stat-label {
      color: #666;
      font-size: 0.9em;
      margin-top: 4px;
    }

    .app-item {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .app-item:last-child {
      border-bottom: none;
    }

    .app-item a {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }

    .app-item a:hover {
      text-decoration: underline;
    }

    table {
      width: 100%;
    }
  `]
})
export class RepositoryDetailComponent implements OnInit {
  repository?: Repository;
  scans: RepositoryScan[] = [];
  loading = true;
  loadingScans = true;
  scanColumns = ['scanStartedAt', 'branch', 'type', 'status', 'duration', 'applications', 'technologies', 'interfaces', 'initiatedBy', 'error'];

  constructor(
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private scanService: RepositoryScanService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadRepository(id);
      this.loadScans(id);
    }
  }

  loadRepository(id: number): void {
    this.repositoryService.getRepositoryById(id).subscribe({
      next: (repo) => {
        this.repository = repo;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading repository:', error);
        this.loading = false;
      }
    });
  }

  loadScans(repositoryId: number): void {
    this.scanService.getScansByRepository(repositoryId).subscribe({
      next: (scans) => {
        this.scans = scans;
        this.loadingScans = false;
      },
      error: (error) => {
        console.error('Error loading scans:', error);
        this.loadingScans = false;
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

  getScanStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return '#4caf50';
      case 'IN_PROGRESS':
        return '#2196f3';
      case 'PENDING':
        return '#ff9800';
      case 'FAILED':
        return '#f44336';
      case 'CANCELLED':
        return '#9e9e9e';
      default:
        return '#9e9e9e';
    }
  }

  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}m ${secs}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }
}
