import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authService: AuthService, private alertifyService: AlertifyService,
              private routeService: Router) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  // tslint:disable-next-line: typedef
  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertifyService.success('Logged in successfully');
    },
    error => {
      this.alertifyService.error(error);
    },
    () => {
      this.routeService.navigate(['/members']);
    });
  }

  // tslint:disable-next-line: typedef
  loggedIn(){
    return this.authService.loggedIn();
  }

  // tslint:disable-next-line: typedef
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertifyService.message('Logged out');
    this.routeService.navigate(['/home']);
  }

}
