import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationService } from '../../services/application.service';
import { ApplicationVersionService } from '../../services/application-version.service';
import { Application, ApplicationVersion } from '../../models/application.model';
import { ApplicationCardsComponent } from '../application-cards/application-cards.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ApplicationCardsComponent
  ],
  template: `
    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <div *ngIf="!loading && application">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1>{{ application.name }}</h1>
        <button mat-raised-button color="primary" routerLink="/applications">
          <mat-icon>arrow_back</mat-icon>
          Back to List
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Application Details</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="detail-grid">
            <div class="detail-item">
              <strong>UUID:</strong> {{ application.uuid }}
            </div>
            <div class="detail-item">
              <strong>Description:</strong> {{ application.description || 'N/A' }}
            </div>
            <div class="detail-item">
              <strong>Repository:</strong>
              <a *ngIf="application.repositoryUrl" [href]="application.repositoryUrl" target="_blank">
                {{ application.repositoryUrl }}
              </a>
              <span *ngIf="!application.repositoryUrl">N/A</span>
            </div>
            <div class="detail-item">
              <strong>Department:</strong> {{ application.department || 'N/A' }}
            </div>
            <div class="detail-item">
              <strong>Author:</strong> {{ application.author || 'N/A' }}
            </div>
            <div class="detail-item">
              <strong>Current Version:</strong> {{ application.currentVersion }}
            </div>
            <div class="detail-item">
              <strong>Last Scanned:</strong> {{ application.lastScannedAt ? (application.lastScannedAt | date:'medium') : 'Never' }}
            </div>
            <div class="detail-item">
              <strong>Shared Component:</strong>
              <mat-chip *ngIf="application.isSharedComponent" color="accent">Yes</mat-chip>
              <span *ngIf="!application.isSharedComponent">No</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-tab-group>
        <mat-tab label="Technology Stack">
          <mat-card>
            <mat-card-content>
              <table mat-table [dataSource]="application.technologyStack || []" *ngIf="application.technologyStack && application.technologyStack.length > 0">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let tech">{{ tech.name }}</td>
                </ng-container>

                <ng-container matColumnDef="version">
                  <th mat-header-cell *matHeaderCellDef>Version</th>
                  <td mat-cell *matCellDef="let tech">{{ tech.version || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>Category</th>
                  <td mat-cell *matCellDef="let tech">{{ tech.category || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let tech">{{ tech.description || 'N/A' }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['name', 'version', 'category', 'description']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'version', 'category', 'description'];"></tr>
              </table>

              <div *ngIf="!application.technologyStack || application.technologyStack.length === 0" style="text-align: center; padding: 20px;">
                <p>No technology stack information available.</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <mat-tab label="Interfaces">
          <mat-card>
            <mat-card-content>
              <h3>Outbound Interfaces</h3>
              <table mat-table [dataSource]="application.outboundInterfaces || []" *ngIf="application.outboundInterfaces && application.outboundInterfaces.length > 0">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let intf">{{ intf.name }}</td>
                </ng-container>

                <ng-container matColumnDef="target">
                  <th mat-header-cell *matHeaderCellDef>Target</th>
                  <td mat-cell *matCellDef="let intf">{{ intf.targetApplicationName || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="protocol">
                  <th mat-header-cell *matHeaderCellDef>Protocol</th>
                  <td mat-cell *matCellDef="let intf">{{ intf.protocol || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="destination">
                  <th mat-header-cell *matHeaderCellDef>Destination</th>
                  <td mat-cell *matCellDef="let intf">{{ intf.destination || 'N/A' }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['name', 'target', 'protocol', 'destination']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'target', 'protocol', 'destination'];"></tr>
              </table>

              <div *ngIf="!application.outboundInterfaces || application.outboundInterfaces.length === 0" style="text-align: center; padding: 20px;">
                <p>No outbound interfaces defined.</p>
              </div>

              <h3 style="margin-top: 30px;">Inbound Interfaces</h3>
              <table mat-table [dataSource]="application.inboundInterfaces || []" *ngIf="application.inboundInterfaces && application.inboundInterfaces.length > 0">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let intf">{{ intf.name }}</td>
                </ng-container>

                <ng-container matColumnDef="source">
                  <th mat-header-cell *matHeaderCellDef>Source</th>
                  <td mat-cell *matCellDef="let intf">{{ intf.sourceApplicationName || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="protocol">
                  <th mat-header-cell *matHeaderCellDef>Protocol</th>
                  <td mat-cell *matCellDef="let intf">{{ intf.protocol || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="destination">
                  <th mat-header-cell *matHeaderCellDef>Destination</th>
                  <td mat-cell *matCellDef="let intf">{{ intf.destination || 'N/A' }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['name', 'source', 'protocol', 'destination']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'source', 'protocol', 'destination'];"></tr>
              </table>

              <div *ngIf="!application.inboundInterfaces || application.inboundInterfaces.length === 0" style="text-align: center; padding: 20px;">
                <p>No inbound interfaces defined.</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <mat-tab label="Version History">
          <mat-card>
            <mat-card-content>
              <table mat-table [dataSource]="versions" *ngIf="versions.length > 0">
                <ng-container matColumnDef="version">
                  <th mat-header-cell *matHeaderCellDef>Version</th>
                  <td mat-cell *matCellDef="let ver">{{ ver.versionNumber }}</td>
                </ng-container>

                <ng-container matColumnDef="branch">
                  <th mat-header-cell *matHeaderCellDef>Branch</th>
                  <td mat-cell *matCellDef="let ver">{{ ver.scannedBranch }}</td>
                </ng-container>

                <ng-container matColumnDef="commit">
                  <th mat-header-cell *matHeaderCellDef>Commit</th>
                  <td mat-cell *matCellDef="let ver">{{ ver.commitHash?.substring(0, 8) || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="scannedAt">
                  <th mat-header-cell *matHeaderCellDef>Scanned At</th>
                  <td mat-cell *matCellDef="let ver">{{ ver.scannedAt | date:'medium' }}</td>
                </ng-container>

                <ng-container matColumnDef="scannedBy">
                  <th mat-header-cell *matHeaderCellDef>Scanned By</th>
                  <td mat-cell *matCellDef="let ver">{{ ver.scannedBy || 'N/A' }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['version', 'branch', 'commit', 'scannedAt', 'scannedBy']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['version', 'branch', 'commit', 'scannedAt', 'scannedBy'];"></tr>
              </table>

              <div *ngIf="versions.length === 0" style="text-align: center; padding: 20px;">
                <p>No version history available.</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <mat-tab label="Documentation Cards">
          <app-application-cards [applicationId]="application.id"></app-application-cards>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      padding: 10px 0;
    }

    .detail-item {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
    }

    table {
      width: 100%;
      margin-top: 10px;
    }

    h3 {
      margin-top: 20px;
      margin-bottom: 10px;
    }
  `]
})
export class ApplicationDetailComponent implements OnInit {
  application?: Application;
  versions: ApplicationVersion[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private versionService: ApplicationVersionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadApplication(id);
    this.loadVersions(id);
  }

  loadApplication(id: number): void {
    this.applicationService.getApplicationById(id).subscribe({
      next: (app) => {
        this.application = app;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading application:', error);
        this.loading = false;
      }
    });
  }

  loadVersions(id: number): void {
    this.versionService.getVersionsByApplicationId(id).subscribe({
      next: (versions) => {
        this.versions = versions;
      },
      error: (error) => {
        console.error('Error loading versions:', error);
      }
    });
  }
}
