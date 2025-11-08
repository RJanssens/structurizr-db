import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationCard } from '../models/application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationCardService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  /**
   * Get all cards for an application
   */
  getCards(applicationId: number, visible?: boolean): Observable<ApplicationCard[]> {
    let params = new HttpParams();
    if (visible !== undefined) {
      params = params.set('visible', visible.toString());
    }
    return this.http.get<ApplicationCard[]>(`${this.apiUrl}/${applicationId}/cards`, { params });
  }

  /**
   * Get a specific card by ID
   */
  getCard(applicationId: number, cardId: number): Observable<ApplicationCard> {
    return this.http.get<ApplicationCard>(`${this.apiUrl}/${applicationId}/cards/${cardId}`);
  }

  /**
   * Get cards by type
   */
  getCardsByType(applicationId: number, cardType: string): Observable<ApplicationCard[]> {
    return this.http.get<ApplicationCard[]>(`${this.apiUrl}/${applicationId}/cards/type/${cardType}`);
  }

  /**
   * Search cards by term
   */
  searchCards(applicationId: number, term: string): Observable<ApplicationCard[]> {
    const params = new HttpParams().set('term', term);
    return this.http.get<ApplicationCard[]>(`${this.apiUrl}/${applicationId}/cards/search`, { params });
  }

  /**
   * Get distinct card types for an application
   */
  getCardTypes(applicationId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${applicationId}/cards/types`);
  }

  /**
   * Create a new card
   */
  createCard(applicationId: number, card: ApplicationCard): Observable<ApplicationCard> {
    return this.http.post<ApplicationCard>(`${this.apiUrl}/${applicationId}/cards`, card);
  }

  /**
   * Update an existing card
   */
  updateCard(applicationId: number, cardId: number, card: ApplicationCard): Observable<ApplicationCard> {
    return this.http.put<ApplicationCard>(`${this.apiUrl}/${applicationId}/cards/${cardId}`, card);
  }

  /**
   * Delete a card
   */
  deleteCard(applicationId: number, cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${applicationId}/cards/${cardId}`);
  }

  /**
   * Delete all cards for an application
   */
  deleteAllCards(applicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${applicationId}/cards`);
  }
}
