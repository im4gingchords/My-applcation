import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Authservice } from 'src/app/auth/auth.service';
import { Post } from '../posts.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  posts: Post[] = [];
  isLoading = false;
  totalPost = 10;
  pageSizeOptions = [1, 2, 5, 10];
  postsPerPage = 2;
  currentPage = 1;
  userId: string;
  userIsAuthenticate = false;
  isIdPresent = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postService: PostsService, private authService: Authservice) { }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub =  this.postService.getPostListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
    this.userIsAuthenticate = this.authService.getIsAuth();
    this.isIdPresent = this.authService.isPresent();
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(userIsAuthenticated => {
       this.userIsAuthenticate = userIsAuthenticated;

       this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    console.log(pageData);
  }

  onDelete(postId: string){
    this.postService.deletePost(postId);
  }


}
