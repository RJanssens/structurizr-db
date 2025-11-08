import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TechnologyStack } from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnologyStackService {
  private apiUrl = `${environment.apiUrl}/technology-stack`;

  constructor(private http: HttpClient) {}

  getByApplicationId(applicationId: number): Observable<TechnologyStack[]> {
    return this.http.get<TechnologyStack[]>(`${this.apiUrl}/application/${applicationId}`);
  }

  getByApplicationUuid(uuid: string): Observable<TechnologyStack[]> {
    return this.http.get<TechnologyStack[]>(`${this.apiUrl}/application/uuid/${uuid}`);
  }

  getAllTechnologies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/technologies`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  findByTechnology(name: string, version?: string): Observable<TechnologyStack[]> {
    let params = new HttpParams().set('name', name);
    if (version) {
      params = params.set('version', version);
    }
    return this.http.get<TechnologyStack[]>(`${this.apiUrl}/search`, { params });
  }
}
