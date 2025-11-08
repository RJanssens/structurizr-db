import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationInterface } from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationInterfaceService {
  private apiUrl = `${environment.apiUrl}/interfaces`;

  constructor(private http: HttpClient) {}

  getByApplicationId(applicationId: number): Observable<ApplicationInterface[]> {
    return this.http.get<ApplicationInterface[]>(`${this.apiUrl}/application/${applicationId}`);
  }

  getBySourceApplicationId(sourceAppId: number): Observable<ApplicationInterface[]> {
    return this.http.get<ApplicationInterface[]>(`${this.apiUrl}/source/${sourceAppId}`);
  }

  getByTargetApplicationId(targetAppId: number): Observable<ApplicationInterface[]> {
    return this.http.get<ApplicationInterface[]>(`${this.apiUrl}/target/${targetAppId}`);
  }

  getAllProtocols(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/protocols`);
  }

  getByProtocol(protocol: string): Observable<ApplicationInterface[]> {
    return this.http.get<ApplicationInterface[]>(`${this.apiUrl}/protocol/${protocol}`);
  }

  getByUuid(uuid: string): Observable<ApplicationInterface> {
    return this.http.get<ApplicationInterface>(`${this.apiUrl}/uuid/${uuid}`);
  }
}
