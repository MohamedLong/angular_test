import { SupplierLocation } from './../../../xgarage/core/model/supplierlocation';
import { PartType } from './../../../xgarage/common/model/parttype';
import { ServiceType } from './../../../xgarage/common/model/servicetype';
import { Supplier } from './../../../xgarage/core/model/supplier';
import { SupplierService } from './../../../xgarage/core/service/supplier.service';
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
import { Brand } from 'src/app/xgarage/common/model/brand';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styles: ['.pages-body{height: unset}', '.pages-body .topbar {background-color: #fff;}'],
    providers: [MessageService]
})
export class SignupComponent implements OnInit {

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
        private messageService: MessageService, private tenantService: TenantService,
        private tenantTypeService: TenantTypeService) { }

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
        location: ['']
    });

    serviceTypes: ServiceType[] = [{ id: 1 }];
    brands: Brand[] = [{ id: 1 }];
    partTypes: PartType[] = [{ id: 1 }];
    supplierLocations: SupplierLocation[] = [{ id: 1 }];
    userId: number;
    supplier: Supplier = {};
    tenants: Tenant[];
    tenantTypes: TenantType[];
    selectedType: TenantType = {};
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


    createUserWithNewTenant() {
        if (this.signupForm.controls.newTenantName.value && this.signupForm.controls.newCr.value) {
            this.selectedTenant.tenantType = this.tenantTypes.find(val => val.id == this.signupForm.controls.tenantType.value);
            this.selectedTenant.name = this.signupForm.controls.newTenantName.value;
            this.selectedTenant.cr = this.signupForm.controls.newCr.value;
            this.selectedTenant.location = this.signupForm.controls.location.value;
            this.selectedTenant.email = this.signupForm.controls.email.value;

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

    createUserOnExistingTenant() {
        if (this.signupForm.valid) {
            let user = this.createUserObjectFromSignupForm();
            this.authService.newSignup(user).subscribe(res => {
                this.userId = res;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User successfully created, waiting for Approval.' });
                setTimeout(() => {
                    this.router.navigateByUrl('login')
                }, 1000);
            }, err => {
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err.error.message });
            })
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Please fill out all fields' })
        }
    }

    private createUserObjectFromSignupForm() {
        this.selectedTenant.id = this.signupForm.controls.tenant.value;
        this.selectedType.id = this.signupForm.controls.tenantType.value;
        this.selectedTenant.tenantType = this.selectedType;
        let user: User = {
            createdDate: new Date(),
            email: this.signupForm.get('email').value,
            firstName: this.signupForm.get('firstName').value,
            lastName: this.signupForm.get('lastName').value,
            phone: this.signupForm.get('phone').value,
            userId: this.signupForm.get('email').value,
            password: this.signupForm.get('password').value,
            provider: 'local',
            tenant: this.selectedTenant,
        }
        return user;
    }

    onSubmit() {
        if (this.newTenantTrigger) {
            this.createUserWithNewTenant();
        }
        else if (!this.newTenantTrigger) {
            this.createUserOnExistingTenant();
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Error in creating the user' })
        }
    }
}
