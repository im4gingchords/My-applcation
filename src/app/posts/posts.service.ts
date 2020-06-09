
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, timeInterval } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Authservice } from '../auth/auth.service';
import { Post } from './posts.model';
import { environment } from 'src/environments/environment';

const BACKNED_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
private posts: Post[] = [];
private postsUpdated = new Subject<Post[]>();

constructor(private http: HttpClient, private router: Router, private authService: Authservice) {}

getPosts(postsPerPage: number, currentPage: number) {
  const queryParams = '?pagesize=' + postsPerPage + '&page=' + currentPage;
  this.http.get<{posts: any,  maxPosts: number}>(BACKNED_URL + queryParams)
  .pipe(map((postData) => {
    return  postData.posts.map(post => {
      return{
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath,
        creator: post.creator
      };
    });
  }))
  .subscribe(transformedPosts => {
    console.log(transformedPosts);
    this.posts = transformedPosts;
    this.postsUpdated.next([...this.posts]);
  }) ;
}

getPost(id: string){
  return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>('http://localhost:3000/api/posts/' + id);
}

getPostListener() {
  return this.postsUpdated.asObservable();
}

addPost(title: string, content: string, image: File) {
const postData = new FormData();

postData.append('title', title);
postData.append('content', content);
postData.append('image', image, title);

this.http.post<{message: string, post: Post}>(
  BACKNED_URL,
  postData
  )
.subscribe((responseData) => {
  const post: Post = {
    id: responseData.post.id,
    title,
    content,
    imagePath: responseData.post.imagePath,
    creator: responseData.post.creator

  };
  this.posts.push(post);
  console.log(post);
  console.log(this.authService.getToken());
  this.postsUpdated.next([...this.posts]);
  this.router.navigate(['/']);

});

}

updatePost(id: string, title: string, content: string, image: File | string){


  let postData: Post | FormData;
  if (typeof(image) === 'object'){

    postData = new FormData();

    postData.append('id', id);
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title)

  }
  else{
     postData = {
      id,
      title,
      content,
      imagePath: image,
      creator: null
    }


  }
  this.http.put(BACKNED_URL + id, postData)
  .subscribe(response => {
    const updatedPosts = [...this.posts];
    const oldPostIndex = updatedPosts.findIndex(p => p.id ===id);
    const post: Post = {
      id,
      title,
      content,
      imagePath: '',
      creator: ''
    };
    updatedPosts[oldPostIndex] = post;
    console.log(post);
    this.posts = updatedPosts;
    this.postsUpdated.next([...this.posts]);
    this.router.navigate(['/']);
  });
}

deletePost(postId: string){
  this.http.delete(BACKNED_URL + postId)
  .subscribe(() => {
    console.log('deleted!');
    const updatedPosts = this.posts.filter(post => post.id !== postId);
    this.posts = updatedPosts;
    this.postsUpdated.next([...this.posts]);
  });
}

}
