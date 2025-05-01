import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { Role } from '../interfaces/role';
import { PasswordChangeRequest } from '../interfaces/password-change-request';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private tokenKey='token';
  apiUrl:string = environment.apiUrl;
  constructor(private http:HttpClient) { }

  login(data:LoginRequest): Observable<AuthResponse>{
      return this.http
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        map((response)=>{
          if(response.isSuccess){
            localStorage.setItem(this.tokenKey, response.token);
          }
          return response;
        }
      ));
  }

  register(data:RegisterRequest):Observable<AuthResponse>{
    return this.http
    .post<AuthResponse>(`${this.apiUrl}account/register`, data)
    .pipe(
      map((response)=>{
        return response;
      })
    )
  }

  changePassword(data:PasswordChangeRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}account/changePassword`, data)
    .pipe(map((response)=>{return response;}))
  }

  getDetail = (): Observable<UserDetail> =>
    this.http.get<UserDetail>(`${this.apiUrl}account/detail`);

  getUserDetail=()=>{
    const token = this.getToken();
    if(!token) return null;
    const decodedToken:any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullname: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    }
    return userDetail;
  }

  isLoggedIn=():boolean=>{
    const token = this.getToken();
    if(!token) return false

    return !this.isTokenExpired();
  }

  private isTokenExpired() {
    const token = this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if(isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout=():void=>{
    localStorage.removeItem(this.tokenKey);
  }

  getToken=():string|null => localStorage.getItem(this.tokenKey) || '';

  getAll=():Observable<UserDetail[]> => 
    this.http.get<UserDetail[]>(`${this.apiUrl}account`);

  getRoles=():string[] | null =>{
    const token = this.getToken();
    if(!token) return null;
    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;

    };
}
