import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: Authservice) {}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    const authToken = this.authService.getToken();
    console.log(authToken);
    const authRequest = req.clone({
      headers: req.headers.set('authorization', 'Bearer ' +  authToken)
    });
    console.log(authRequest);
    console.log(authToken);
    return next.handle(authRequest);

  }
}
