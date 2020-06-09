import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
   return next.handle(req).pipe(
     catchError((error: HttpErrorResponse) => {
       let errorMessage = 'An unknown error occured';
       if(error.error.error.message){
         errorMessage = error.error.error.message;
         console.log(errorMessage);
       }

       this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
       return throwError(error);
     })
   );
  }
}
