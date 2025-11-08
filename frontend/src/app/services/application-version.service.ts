import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationVersion } from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationVersionService {
  private apiUrl = `${environment.apiUrl}/versions`;

  constructor(private http: HttpClient) {}

  getVersionsByApplicationId(applicationId: number): Observable<ApplicationVersion[]> {
    return this.http.get<ApplicationVersion[]>(`${this.apiUrl}/application/${applicationId}`);
  }

  getVersionsByApplicationUuid(uuid: string): Observable<ApplicationVersion[]> {
    return this.http.get<ApplicationVersion[]>(`${this.apiUrl}/application/uuid/${uuid}`);
  }

  getVersionById(id: number): Observable<ApplicationVersion> {
    return this.http.get<ApplicationVersion>(`${this.apiUrl}/${id}`);
  }
}
