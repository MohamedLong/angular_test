
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
        newTenant: [''],
        newCr: ['']
    });

    tenants: Tenant[];
    tenantTypes: TenantType[];
    selectedType: TenantType;    
    tenant: Tenant = {};
    newTenantTrigger = false;

    ngOnInit(): void {
        this.getTenantTypes();
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
        if (this.signupForm.controls.newTenant.value && this.signupForm.controls.newCr.value) {
            this.selectedType = this.tenantTypes.find(val => val.id == this.signupForm.controls.tenantType.value);
            this.tenant.tenantType = this.selectedType;
            this.tenant.name = this.signupForm.controls.newTenant.value;
            this.tenant.cr = this.signupForm.controls.newCr.value;

            this.tenantService.add(this.tenant).subscribe(
                {
                    next: (data) => {
                        this.tenant = data;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'New Tenant Has Been Registered' });                    
                        this.createUserOnExistingTenant();
                    },
                    error: (e) => alert(e)
                }
            );}        
    }

    createUserOnExistingTenant(){
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

    onSubmit() {
        if(this.newTenantTrigger){
            this.tenant = {};
            this.createUserWithNewTenant();
        }
        else if(!this.newTenantTrigger){
            this.signupForm.patchValue({
                tenant: { id: Number(this.signupForm.get('tenant').value) },
                userId: this.signupForm.get('email').value
            });
            this.createUserOnExistingTenant();
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Error in creating the user' })
        }
    }
    }
