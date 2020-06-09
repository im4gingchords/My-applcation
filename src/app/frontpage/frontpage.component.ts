import { OnDestroy, OnInit, Component } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})

export class FrontPageComponent implements OnInit{

  ngOnInit(){

    // tslint:disable-next-line: only-arrow-functions
    $(window).on('scroll', function(){
      if($(window).scrollTop()){
        const n = document.querySelector('.nav-scrolled');
        $('header').addClass(n[1]);
      }
      else{
        $('header').removeClass('nav-scrolled');
      }
    })

}

}
