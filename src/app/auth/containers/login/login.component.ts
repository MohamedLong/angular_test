import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
    :host ::ng-deep .p-password input {
    width: 100%;
    padding:1rem;
    }

    :host ::ng-deep .pi-eye{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .pi-eye-slash{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `],
    providers: [MessageService]
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    decodedToken: string;
    isLoading: boolean = false;

    constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private messageService: MessageService) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: [''],
            password: ['']
        });
    }

    get f() { return this.loginForm.controls; }

    login() {
        this.isLoading = !this.isLoading;
        this.authService.login(
            {
                username: this.f.username.value,
                password: this.f.password.value
            }
        )
            .subscribe(res => {
                this.isLoading = false;
                if (!res) {
                    //console.log('err res:', res)
                    this.messageService.add({ severity: 'error', summary: 'Erorr', detail: res });
                } else if (this.authService.isLoggedIn()) {
                    //console.log(this.authService.isLoggedIn())
                    this.authService.doStoreUser(this.authService.getJwtToken(), this.router);
                }

            }, err => {
                this.isLoading = false;
                //console.log("error : " + err);
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err });
            }
            );
    }

}
