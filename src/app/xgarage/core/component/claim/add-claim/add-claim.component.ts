import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ClaimService } from '../../../service/claim.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InsuranceType } from '../../../model/insurancetype';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-claim',
    templateUrl: './add-claim.component.html',
    styles: [
        `
    .wizard-card {width: 100% !important}
    .wizard-body {background: none; height: unset;}
    .wizard-card, .wizard-card-header {border-radius: 5px;}
    .tab:first-of-type {
        border-top-left-radius: 5px
    }
    .tab:last-of-type {
        border-top-right-radius: 5px
    }
    .wizard-body .wizard-wrapper .wizard-content {
        height: auto;
        min-height: auto;
    }

    .wizard-body .wizard-wrapper .wizard-content .wizard-card {
        height: 100%;
    }
    `
    ],
    providers: [MessageService]
})
export class AddClaimComponent implements OnInit {

    constructor(private router: Router, private messageService: MessageService, private authService: AuthService, private breadcrumbService: AppBreadcrumbService, private claimService: ClaimService, private formBuilder: FormBuilder) { }

    activeTab = 'car-info';

    car: any;
    ticks: { id: number, name: string }[];
    selectedTicks;
    insuranceType = Object.keys(InsuranceType);
    claimForm: FormGroup = this.formBuilder.group({
        tenant: [JSON.parse(this.authService.getStoredUser()).tenant.id],
        insuranceType: ['', Validators.required],
        claimNo: ['', Validators.required],
        claimDate: ['', Validators.required],
        excDeliveryDate: ['', Validators.required],
        breakDown: ['', Validators.required],
        km: ['', Validators.required],
        claimTicks: [[]],
        car: [''],
    });
    saving: boolean = false;
    saved: boolean = false;
    submitted: boolean = false;
    minExcDeliveryDate:  Date;

    ngOnInit(): void {
        this.onGetJobTicks();
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Add Claim', routerLink: ['add-claim'] }]);
    }

    onCarFormEvent(event) {
        console.log(event);
        this.car = event;

        for (const key in event.claimData) {
            this.claimForm.addControl(key, new FormControl(event.claimData[key]));
        };

        this.claimForm.get('car').setValue({ id: event.id });
        this.claimForm.addControl('claimTitle', new FormControl(`${event.brandId.brandName} ${event.carModelId.name} ${event.carModelYearId.year},  ${event.carModelTypeId.type}`));

        this.activeTab = 'create-claim';
    }

    onGetJobTicks() {
        this.claimService.getClaimTicks().subscribe(res => {
            //console.log(res)
            this.ticks = res;
            //this.claimForm.get('claimTicks').setValue(res);
        })
    }

    onTicksChange(tick: any, event: any) {
        //console.log(tick, event)
        if (!event.checked) {

            let isTickFound = this.claimForm.get('claimTicks').value.filter(claimTick => {
                return claimTick.id == tick.id;
            });

            if (isTickFound) {
                this.claimForm.get('claimTicks').setValue(
                    this.claimForm.get('claimTicks').value.filter(val => {
                        return val.id !== tick.id;
                    })
                );
            }
        } else {
            this.claimForm.get('claimTicks').setValue([...this.claimForm.get('claimTicks').value, { id: tick.id }]);
        }

    }

    onCreateCalim() {

        this.submitted = true;

        if (this.claimForm.valid) {
            // if (this.claimForm.get('claimTicks').value.length > 0) {
            // }
            // else {
            //     this.claimForm.get('claimTicks').setErrors({required: true});
            // }

            this.saving = true;

            let datetime = new Date(this.claimForm.get('claimDate').value).toISOString();
            let updatedClaimForm = this.claimForm.value;
            updatedClaimForm.claimDate = datetime;

            //console.log(updatedClaimForm)

            this.claimService.add(updatedClaimForm).subscribe(res => {
                //console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim Created Succefully. Redirecting To Claim..' });
                this.saving = false;
                this.saved = true;
                //this.claimForm.reset('');
                setTimeout(() => {
                    this.goToClaimDetails(res.id);
                }, 1000)

            }, err => {
                //console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error });
                this.saving = false;
            });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Some Fields Are Not Valid, Please Try Again.' });
        }
    }

    goToClaimDetails(id: number) {
        localStorage.setItem('claimId', JSON.stringify(id));
        this.router.navigate(['claim-details']);
    }

    onRecievedDateSelect(val: any) {
        this.claimForm.get('excDeliveryDate').setValue('');
        this.minExcDeliveryDate =  new Date(val);
        this.minExcDeliveryDate.setDate(this.minExcDeliveryDate.getDate() + 1);
    }

}
