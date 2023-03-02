import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    destination: string;

    constructor(private authService: AuthService, private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router, private messageService: MessageService) { }

    // ngOnInit() {
    //   console.log(this.authService.isLoggedIn())
    //     this.loginForm = this.formBuilder.group({
    //         username: [''],
    //         password: ['']
    //     });
    // }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.destination = params['destination'];
        });
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
        ).subscribe(
            {
                next: (success) => {
                    if (this.authService.isLoggedIn()) {
                        // const link = this.router.createUrlTree(['/order-details', 338]).toString();
                        // this.authService.doStoreUser(this.authService.getJwtToken(), link);
                        this.authService.doStoreUser(this.authService.getJwtToken(), this.router);


                    }
                },
                error: (e) => {
                    this.isLoading = false;
                    this.messageService.add({ severity: 'error', summary: 'Erorr', detail: e });
                }
            }
        );
    }

}
