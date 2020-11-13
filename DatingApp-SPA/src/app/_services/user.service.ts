import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { PaginationResult } from '../_models/pagination';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(pageNumber?, pageSize?, userParams?, likesParam?): Observable<PaginationResult<User[]>>{
    const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>();
    let params = new HttpParams();
    if (pageNumber != null){
      params = params.append('pageNumber', pageNumber);
    }
    if (pageSize != null){
      params = params.append('pageSize', pageSize);
    }

    if (userParams != null){
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers'){
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees'){
      params = params.append('likees', 'true');
    }

    return this.http.get<User[]>(this.baseURL + 'users', {observe: 'response', params}).pipe(
      map(response => {
        paginationResult.result = response.body;
        if (response.headers.get('Pagination') != null){
          paginationResult.pagination = JSON.parse(response.headers.get('Pagination'))
        }
        return paginationResult;
      })
    );
  }

  getUser(id: number): Observable<User>{
    return this.http.get<User>(this.baseURL + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseURL + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseURL + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseURL + 'users/' + userId + '/photos/' + id);
  }

  sendLike(userId: number, recipientId: number) {
    return this.http.post(this.baseURL + 'users/' + userId + '/like/' + recipientId, {});
  }

  getMessages(id: number, pageNumber?, pageSize?, messageContainer?): Observable<PaginationResult<Message[]>>{
    const paginationResult: PaginationResult<Message[]> = new PaginationResult<Message[]>();
    let params = new HttpParams();
    if (pageNumber != null){
      params = params.append('pageNumber', pageNumber);
    }
    if (pageSize != null){
      params = params.append('pageSize', pageSize);
    }

    params = params.append('messageContainer', messageContainer);

    return this.http.get<Message[]>(this.baseURL + 'users/' + id + '/messages', {observe: 'response', params}).pipe(
      map(response => {
        paginationResult.result = response.body;
        if (response.headers.get('Pagination') != null){
          paginationResult.pagination = JSON.parse(response.headers.get('Pagination'))
        }
        return paginationResult;
      })
    );
  }

  getMessageThread(id: number, recipientId: number){
    return this.http.get<Message[]>(this.baseURL + 'users/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message){
    return this.http.post(this.baseURL + 'users/' + id + '/messages', message);
  }

  deleteMessage(messageId: number, userId: number){
    return this.http.post(this.baseURL + 'users/' + userId + '/messages/' + messageId, {});
  }

  markAsRead(userId: number, messageId: number){
    return this.http.post(this.baseURL + 'users/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
  }
}
