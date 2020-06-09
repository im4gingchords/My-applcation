import { Component, OnInit, OnDestroy } from '@angular/core';
import { Authservice } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListener: Subscription;
  constructor(private authService: Authservice) { }

  ngOnDestroy(){

    this.authListener.unsubscribe();

  }

  ngOnInit() {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListener = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

  }

  onLogout(){
    this.authService.logout();
  }

}
