import { registerLocaleData } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelEmitter = new EventEmitter();
  model: any = {};
  constructor(private authService: AuthService) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
  }

  // tslint:disable-next-line: typedef
  register() {
    this.authService.register(this.model).subscribe(() => {
      console.log('Registered successfully');
    },
    error => {
      console.log(error);
    });
  }

  // tslint:disable-next-line: typedef
  cancel(){
    this.cancelEmitter.emit(false);
    console.log('cancelled');
  }

}
