import { User } from './../../../xgarage/common/model/user';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Tenant } from 'src/app/xgarage/common/model/tenant';
import { TenantType } from 'src/app/xgarage/common/model/tenanttype';
import { TenantService } from 'src/app/xgarage/common/service/tenant.service';
import { TenantTypeService } from 'src/app/xgarage/common/service/tenanttype.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    // styleUrls: ['./signup.component.scss'],
    providers: [MessageService]
})
export class SignupComponent implements OnInit {

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private messageService: MessageService, private tenantService: TenantService, private tenantTypeService: TenantTypeService) { }

    signupForm: FormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userId: [''],
        phone: ['', [Validators.required, Validators.pattern(/^[279]\d{7}$/)]],
        password: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        provider: ['local'],
        tenantType: ['', Validators.required],
        tenant: [null],
        newTenantName: [''],
        newCr: [''],
        location: []
    });

    tenants: Tenant[];
    tenantTypes: TenantType[];
    selectedType: TenantType;    
    selectedTenant: Tenant = {};
    newTenantTrigger = false;

    ngOnInit(): void {
        this.getTenantTypes();
        this.selectedTenant = {};
    }

    getTenantsByType(typeId: number) {
        this.tenantService.getTenantsByType(typeId).subscribe((res: Tenant[]) => {
            this.tenants = res;
        })
    }

    getTenantTypes() {
        this.tenantTypeService.getAll().subscribe((res: Tenant[]) => {
            this.tenantTypes = res;
        })
    }

    changeTenants(event) {
        this.tenants = [];
        this.getTenantsByType(event.value);
    }

    
    createUserWithNewTenant(){
        if (this.signupForm.controls.newTenantName.value && this.signupForm.controls.newCr.value) {
            this.selectedTenant.tenantType = this.tenantTypes.find(val => val.id == this.signupForm.controls.tenantType.value);
            this.selectedTenant.name = this.signupForm.controls.newTenantName.value;
            this.selectedTenant.cr = this.signupForm.controls.newCr.value;
            this.selectedTenant.location = this.signupForm.controls.location.value;

            this.tenantService.add(this.selectedTenant).subscribe(
                {
                    next: (data) => {
                        this.selectedTenant = data;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'New Tenant Has Been Registered' });                    
                        this.signupForm.patchValue({
                            tenant: this.selectedTenant.id,
                            userId: this.signupForm.get('email').value
                        });
                        this.createUserOnExistingTenant();
                    },
                    error: (e) => alert(e)
                }
            );
        }        
    }

    createUserOnExistingTenant(){
        if (this.signupForm.valid) {
            let user = this.createUserObjectFromSignupForm();
            this.authService.signup(user).subscribe(res => {
                if(res != "200") {
                    this.messageService.add({ severity: 'error', summary: 'Erorr', detail:  res.message });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Success' });
                if (this.authService.isLoggedIn()) {
                    this.authService.doStoreUser(this.authService.getJwtToken(), this.router);
                }
            }, err => {
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail:  err.message });
            })
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Please fill out all fields' })
        }
    }

    private createUserObjectFromSignupForm() {
        this.selectedTenant.id = this.signupForm.controls.tenant.value;
        let user: User = {
            createdDate : new Date(),
            email : this.signupForm.get('email').value,
            firstName : this.signupForm.get('firstName').value,
            lastName : this.signupForm.get('lastName').value,
            phone : this.signupForm.get('phone').value,
            userId : this.signupForm.get('email').value,
            password : this.signupForm.get('password').value,
            provider : 'local',
            tenant : this.selectedTenant,
        }
        return user;
    }

    onSubmit() {
        if(this.newTenantTrigger){
            this.createUserWithNewTenant();
        }
        else if(!this.newTenantTrigger){
            this.createUserOnExistingTenant();
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Error in creating the user' })
        }
    }
    }
