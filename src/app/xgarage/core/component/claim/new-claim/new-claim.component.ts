import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from '../../../service/claim.service';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InsuranceType } from '../../../model/insurancetype';
import { Claim } from '../../../model/claim';

@Component({
    selector: 'app-new-claim',
    templateUrl: './new-claim.component.html',
    styles: ['']
})
export class NewClaimComponent implements OnInit{

    constructor(private router: Router, private messageService: MessageService, private authService: AuthService, private breadcrumbService: AppBreadcrumbService, private claimService: ClaimService, private formBuilder: FormBuilder) { }

    newClaimForm: FormGroup = this.formBuilder.group({
        tenant: [JSON.parse(this.authService.getStoredUser()).tenant.id],
        insuranceType: ['', Validators.required],
        claimNo: ['', Validators.required],
        customerName: ['', Validators.required],
        contactNo: [null, Validators.required],
        excessRo: [0, Validators.required],
    });

    insuranceType: string[] = Object.keys(InsuranceType);;
    submitted: boolean = false;
    saving: boolean = false;
    @Input() claim: Claim;
    @Output() createClaimEvent = new EventEmitter<any>();

    ngOnInit(): void {
        if(this.claim) {
            console.log('theis is a review');
            this.newClaimForm.patchValue({
                insuranceType: this.claim.insuranceType,
                claimNo: this.claim.claimNo,
                customerName: this.claim.customerName,
                contactNo: this.claim.contactNo,
                excessRo: this .claim.excessRo + ' OMR'
            });

            for(const control in this.newClaimForm.value) {
                this.newClaimForm.get(control).disable()
            };
        }
    }

    onNewClaimFormSubmit() {
        this.submitted = true;

        if (this.newClaimForm.valid) {
            this.createClaimEvent.emit(this.newClaimForm.value);
        } else {
            console.log('form is not valid')
        }
    }

}
