import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryScan, ScanStatistics } from '../models/repository.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepositoryScanService {
  private apiUrl = `${environment.apiUrl}/repository-scans`;

  constructor(private http: HttpClient) {}

  getAllScans(): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(this.apiUrl);
  }

  getScanById(id: number): Observable<RepositoryScan> {
    return this.http.get<RepositoryScan>(`${this.apiUrl}/${id}`);
  }

  getScanByUuid(uuid: string): Observable<RepositoryScan> {
    return this.http.get<RepositoryScan>(`${this.apiUrl}/uuid/${uuid}`);
  }

  getScansByRepository(repositoryId: number): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/repository/${repositoryId}`);
  }

  getLatestScanByRepository(repositoryId: number): Observable<RepositoryScan> {
    return this.http.get<RepositoryScan>(`${this.apiUrl}/repository/${repositoryId}/latest`);
  }

  getLatestCompletedScanByRepository(repositoryId: number): Observable<RepositoryScan> {
    return this.http.get<RepositoryScan>(`${this.apiUrl}/repository/${repositoryId}/latest-completed`);
  }

  getScansByStatus(status: string): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/status/${status}`);
  }

  getFailedScans(): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/failed`);
  }

  getInProgressScans(): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/in-progress`);
  }

  getPendingScans(): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/pending`);
  }

  getScansByType(scanType: string): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/type/${scanType}`);
  }

  getScansByInitiatedBy(initiatedBy: string): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/initiated-by/${initiatedBy}`);
  }

  getScansByBranch(branch: string): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/branch/${branch}`);
  }

  getScansByDateRange(startDate: string, endDate: string): Observable<RepositoryScan[]> {
    return this.http.get<RepositoryScan[]>(`${this.apiUrl}/date-range`, {
      params: { startDate, endDate }
    });
  }

  getStatistics(): Observable<ScanStatistics> {
    return this.http.get<ScanStatistics>(`${this.apiUrl}/statistics`);
  }

  createScan(scan: Partial<RepositoryScan>): Observable<RepositoryScan> {
    return this.http.post<RepositoryScan>(this.apiUrl, scan);
  }

  updateScan(id: number, scan: Partial<RepositoryScan>): Observable<RepositoryScan> {
    return this.http.put<RepositoryScan>(`${this.apiUrl}/${id}`, scan);
  }

  completeScan(id: number, updates?: any): Observable<RepositoryScan> {
    return this.http.patch<RepositoryScan>(`${this.apiUrl}/${id}/complete`, updates || {});
  }

  failScan(id: number, errorMessage: string, errorDetails?: string): Observable<RepositoryScan> {
    return this.http.patch<RepositoryScan>(`${this.apiUrl}/${id}/fail`, {
      errorMessage,
      errorDetails
    });
  }

  updateScanStatus(id: number, status: string): Observable<RepositoryScan> {
    return this.http.patch<RepositoryScan>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }

  deleteScan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteScansOlderThan(date: string): Observable<{ deleted: number; olderThan: string }> {
    return this.http.delete<{ deleted: number; olderThan: string }>(`${this.apiUrl}/older-than`, {
      params: { date }
    });
  }
}
