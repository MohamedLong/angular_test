import { Router } from '@angular/router';
import { UserService } from './../../service/userservice';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['../../../../demo/view/tabledemo.scss'],
})
export class ChangepasswordComponent implements OnInit {

  passwordForm: FormGroup;
  submitted = false;
  userId: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private authService: AuthService, private router: Router) { }



  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user')).userId;
    this.passwordForm = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        password: [''],
        confirm_password: ['']
      }, {
        validator: this.mustMatch('password', 'confirm_password')
      }
    );

  }

  get c() { return this.passwordForm.controls; }

  save() {
    this.submitted = true;
    this.userService.changePassword({userId:this.userId, oldPass:this.c.oldPassword.value, newPass:this.c.password.value})
    console.log(this.passwordForm.value)
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }

}
