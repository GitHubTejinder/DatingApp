import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginationResult } from '../_models/pagination';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(pageNumber?, pageSize?, userParams?): Observable<PaginationResult<User[]>>{
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
}
