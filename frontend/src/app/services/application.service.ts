import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplicationStatistics } from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  getApplicationByUuid(uuid: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/uuid/${uuid}`);
  }

  searchApplications(term: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/search`, {
      params: { term }
    });
  }

  getApplicationsByDepartment(department: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/department/${department}`);
  }

  getAllDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/departments`);
  }

  getSharedComponents(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/shared-components`);
  }

  createApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  updateApplication(id: number, application: Application): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${id}`, application);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStatistics(): Observable<ApplicationStatistics> {
    return this.http.get<ApplicationStatistics>(`${this.apiUrl}/statistics`);
  }
}
