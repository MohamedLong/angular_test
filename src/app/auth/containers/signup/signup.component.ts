import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Tenant } from 'src/app/xgarage/common/model/tenant';
import { TenantService } from 'src/app/xgarage/common/service/tenantservice';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    providers: [MessageService]
})
export class SignupComponent implements OnInit {

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private messageService: MessageService, private tenantService: TenantService) { }

    signupForm: FormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userId: [''],
        phone: ['', [Validators.required, Validators.pattern(/^[279]\d{7}$/)]],
        password: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        provider: ['local'],
        tenant: [null, Validators.required]
    });

    tenanats: Tenant[];

    ngOnInit(): void {
        this.tenantService.getAll().subscribe((res: Tenant[]) => {
            this.tenanats = res;
        })
    }

    onSubmit() {

        this.signupForm.patchValue({
            tenant: { id: Number(this.signupForm.get('tenant').value) },
            userId: this.signupForm.get('email').value
        });

        console.log(this.signupForm.value)
        if (this.signupForm.valid) {
            this.authService.signup(this.signupForm.value).subscribe(res => {
                if (!res) {
                    this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Error signing up' });
                    return;
                }

                this.messageService.add({ severity: 'success', summary: 'Success' });
                if (this.authService.isLoggedIn()) {
                    this.authService.doStoreUser(this.authService.getJwtToken(), this.router);
                }
            }, err => {
                console.log(err)
            })
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Please fill out all fields' })
        }
    }

}
