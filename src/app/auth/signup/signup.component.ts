import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Authservice } from '../auth.service';
import { format } from 'url';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: Authservice) { }

  ngOnInit() {
   this.authStatusSub =  this.authService.getAuthStatusListener().subscribe(
     authStatus => {
       this.isLoading = false;
     }
   );
  }
  onSignup(signupForm: NgForm){

    if(signupForm.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signupForm.value.email, signupForm.value.password);

  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
