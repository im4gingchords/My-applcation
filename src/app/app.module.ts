import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/postscreate/posts-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line: max-line-length

import { HeadersComponent } from './headers/headers.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostsService } from './posts/posts.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { Authservice } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FrontPageComponent } from './frontpage/frontpage.component';

@NgModule({
  declarations: [
    AppComponent, HeadersComponent, ErrorComponent, FrontPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    PostsModule,
    AuthModule,
    SimplebarAngularModule

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],

  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
