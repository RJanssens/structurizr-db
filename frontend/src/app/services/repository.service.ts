import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repository, RepositoryStatistics } from '../models/repository.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private apiUrl = `${environment.apiUrl}/repositories`;

  constructor(private http: HttpClient) {}

  getAllRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>(this.apiUrl);
  }

  getRepositoryById(id: number): Observable<Repository> {
    return this.http.get<Repository>(`${this.apiUrl}/${id}`);
  }

  getRepositoryByUuid(uuid: string): Observable<Repository> {
    return this.http.get<Repository>(`${this.apiUrl}/uuid/${uuid}`);
  }

  getRepositoryByUrl(url: string): Observable<Repository> {
    return this.http.get<Repository>(`${this.apiUrl}/url`, {
      params: { url }
    });
  }

  getRepositoryByGitlabProjectId(gitlabProjectId: number): Observable<Repository> {
    return this.http.get<Repository>(`${this.apiUrl}/gitlab/${gitlabProjectId}`);
  }

  getRepositoriesByNamespace(namespacePath: string): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiUrl}/namespace/${namespacePath}`);
  }

  getAllNamespaces(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/namespaces`);
  }

  searchRepositories(term: string): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiUrl}/search`, {
      params: { term }
    });
  }

  getEnabledRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiUrl}/enabled`);
  }

  getArchivedRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiUrl}/archived`);
  }

  getActiveRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiUrl}/active`);
  }

  getRepositoriesByVisibility(visibility: string): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiUrl}/visibility/${visibility}`);
  }

  getRepositoriesWithoutApplications(): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiUrl}/without-applications`);
  }

  getRepositoriesNeedingSync(hoursAgo: number = 24): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiUrl}/needing-sync`, {
      params: { hoursAgo: hoursAgo.toString() }
    });
  }

  getStatistics(): Observable<RepositoryStatistics> {
    return this.http.get<RepositoryStatistics>(`${this.apiUrl}/statistics`);
  }

  createRepository(repository: Partial<Repository>): Observable<Repository> {
    return this.http.post<Repository>(this.apiUrl, repository);
  }

  updateRepository(id: number, repository: Partial<Repository>): Observable<Repository> {
    return this.http.put<Repository>(`${this.apiUrl}/${id}`, repository);
  }

  enableRepository(id: number): Observable<Repository> {
    return this.http.patch<Repository>(`${this.apiUrl}/${id}/enable`, {});
  }

  disableRepository(id: number): Observable<Repository> {
    return this.http.patch<Repository>(`${this.apiUrl}/${id}/disable`, {});
  }

  deleteRepository(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
