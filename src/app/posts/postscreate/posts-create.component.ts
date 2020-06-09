import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from 'src/app/posts/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { validateVerticalPosition } from '@angular/cdk/overlay';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { Authservice } from 'src/app/auth/auth.service';
import { Post } from '../posts.model';


@Component({
selector : 'app-post-component',
templateUrl : './posts-create.component.html',
styleUrls: ['./posts-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
 constructor(public postService: PostsService, public route: ActivatedRoute, public authService: Authservice) {}
 node = 'create';
 postId: string;
 post: Post;
 isLoading = false;
 form: FormGroup;
 imagePreview: string;
 private authStatusSub: Subscription;

 ngOnInit() {
   this.authStatusSub = this.authService
   .getAuthStatusListener()
   .subscribe(authStatus => {
     this.isLoading = false;
   })
   this.form = new FormGroup({
   title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
   content: new FormControl(null, {validators: [Validators.required]}),
   image: new FormControl(null, {validators: [Validators.required],
   asyncValidators: [mimeType]
  })
   });
   this.route.paramMap.subscribe((paramMap: ParamMap) => {
  if (paramMap.has('postId')) {
    this.node = 'edit';
    this.postId = paramMap.get('postId');
    this.isLoading = true;
    this.postService.getPost(this.postId).subscribe(postData => {
      this.isLoading = false;
      this.post = {id: postData._id, title: postData.title, content: postData.content , imagePath: postData.imagePath, creator: postData.creator};
      this.form.setValue({
        title: this.post.title,
        content: this.post.content,
        image: this.post.imagePath,

      });
    });
  } else {
    this.node = 'create';
    this.postId = null;
    console.log('created');
  }
   });
 }

 onImagePicked(event: Event) {
  const file = (event.target as HTMLInputElement).files[0];
  this.form.patchValue({image: file});
  this.form.get('image').updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
    console.log(this.imagePreview);
  };
  reader.readAsDataURL(file);
 }

onAdd() {
  if (this.form.invalid) {
    return;
  }
  this.isLoading = true;
  if (this.node === 'create') {
    this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);

  } else {
  this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
  }

  this.form.reset();
}

ngOnDestroy(){
  this.authStatusSub.unsubscribe();
}


}
