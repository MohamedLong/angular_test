import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ClaimService } from '../../../service/claim.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Privacy } from '../../../../common/model/privacy';
import { AssignType } from '../../../../common/model/assigntype';
import { Claim } from '../../../model/claim';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-claim',
    templateUrl: './edit-claim.component.html',
    providers: [MessageService]
})
export class EditClaimComponent implements OnInit {

    constructor(private router: Router, private messageService: MessageService, private authService: AuthService, private breadcrumbService: AppBreadcrumbService, private formBuilder: FormBuilder, private claimServie: ClaimService) { }
    partsList: any[] = [];
    parts: any[] = [];
    selectedParts = [];
    actions: { id: number, name: string }[] = [
        { id: 0, name: 'No Action' },
        { id: 1, name: 'Repair' },
        { id: 2, name: 'Replace' },
        { id: 3, name: 'Check' }
    ];
    assignTypes = Object.keys(AssignType);
    privacyList = Object.keys(Privacy);
    claimId: any = '';
    claim: any;
    loading: boolean = true;
    tenantId: number = JSON.parse(this.authService.getStoredUser()).tenant.id;
    updateClaimForm: FormGroup = this.formBuilder.group({
        id: [''],
        inspectedBy: ['', Validators.required],
        surveyedBy: ['', Validators.required],
        repairCost: [0, Validators.required],
        repairHrs: [0, Validators.required],
        officeLocation: ['', Validators.required],
        workshopGrade: ['', Validators.required],
        bidClosingDate: ['', Validators.required],
        assignType: ['Bidding', Validators.required],
        assignedGarage: [0],
        privacy: ['Public', Validators.required],
        suppliers: [[]],
        notes: [''],
    });
    addPartDialog: boolean = false;
    submitted: boolean = false;
    saving: boolean = false;
    claimDate: Date;
    label: string = "Create Request";
    selectedPartOptions: any[] = [];
    @ViewChild('partList') partList: ElementRef;

    ngOnInit(): void {
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Claim Details', routerLink: ['claim-details'] }, { 'label': 'Edit Claim', routerLink: ['edit-claim'] }]);
        this.claim = JSON.parse(localStorage.getItem('claim'));
        if (localStorage.getItem('claimSelectedParts')) {
            this.selectedPartOptions = JSON.parse(localStorage.getItem('claimSelectedParts'));
            this.label = 'Update Claim';
        };

        //get claim date & add one day to it
        this.claimDate = new Date(this.claim.claimDate);
        this.claimDate.setDate(this.claimDate.getDate() + 1);

        this.onGetClaimPartList();

        //set claim fields on edit??
        this.updateClaimForm.patchValue({
            inspectedBy: this.claim.inspectedBy,
            surveyedBy: this.claim.surveyedBy,
            repairCost: this.claim.repairCost? this.claim.repairCost : 0,
            repairHrs: this.claim.repairHrs? this.claim.repairHrs : 0,
            officeLocation: this.claim.officeLocation,
            workshopGrade: this.claim.workshopGrade,
            bidClosingDate: this.claim.bidClosingDate? new Date(this.claim.bidClosingDate) : '',
            assignType: this.claim.assignType,
            assignedGarage: this.claim.assignedGarage? this.claim.assignedGarage : 0,
            privacy: this.claim.privacy,
            suppliers: this.claim.suppliers,
            notes: this.claim.notes,
        })
    }

    onAction(action: string, part: any) {
        // console.log(action, part);
        part.partOption = action;
        if (action !== this.actions[0].name) {
            if (this.selectedParts.length == 0) {
                this.selectedParts.push(part);
            } else {
                let arr = this.selectedParts.find(selectedPart => {
                    return selectedPart.partId == part.partId;
                });

                if (arr) {
                    arr.partOption = action;
                } else {
                    this.selectedParts.push(part);
                }
            }
        } else {
            let arr = this.selectedParts.find(selectedPart => {
                return selectedPart.partId == part.partId;
            });

            if (arr) {
                this.selectedParts = this.selectedParts.filter(selectedPart => {
                    return selectedPart.partId !== part.partId
                })
            }
        };


        console.log(this.selectedParts)
    }

    onGetClaimPartList() {
        this.claimServie.getClaimPartList().subscribe(
            res => {
                res.forEach((part, i) => {
                    part.action = this.actions[0].name;
                    if (i == 0) {
                        this.partsList.push({ id: part.categoryId, categoryName: part.categoryName, list: [part] })
                    } else {
                        let arr = this.partsList.find(list => {
                            return list.id == part.categoryId
                        });

                        if (arr) {
                            arr.list.push(part)
                        } else {
                            this.partsList.push({ id: part.categoryId, categoryName: part.categoryName, list: [part] })
                        }
                    }
                });

                this.loading = false;

                //fill part list with old values if found
                this.partsList.forEach(part => {
                    part.list.forEach(listItem => {
                        if (this.selectedPartOptions.length > 0) {
                            this.selectedPartOptions.forEach(item => {
                                if (listItem.partId == item.part.id) {
                                    //console.log(item, listItem)
                                    listItem.action = item.partOption;
                                    listItem.disabled = true;
                                    // this.selectedParts.push({partId: listItem.partId, partOption: listItem.action})
                                }
                            })
                        }
                    })
                });

                //console.log(this.partsList)

            }, err => {
                console.log(err);
                this.loading = false;
            }
        )
    }

    onEnabelBidding(e: boolean) {
        console.log(e)
        if (e) {
            this.updateClaimForm.get('privacy').enable();
            this.updateClaimForm.get('assignedGarage').reset();
        } else {
            this.updateClaimForm.get('privacy').disable();
            this.updateClaimForm.get('suppliers').setValue([]);
            this.updateClaimForm.get('privacy').setValue(['Public']);
        }
    }

    onUpdateClaim() {
        this.submitted = true;
        if (this.updateClaimForm.valid) {
            this.saving = true;

            console.log('form is valid');
            //console.log(this.updateClaimForm.value);
            this.updateClaimForm.get('id').setValue(this.claim.id);
            for (const claimKey in this.claim) {
                for (const updatedClaimkey in this.updateClaimForm.value) {
                    if (claimKey == updatedClaimkey) {
                        this.claim[claimKey] = this.updateClaimForm.value[updatedClaimkey];
                    }
                }
            };

            let claimBody = {
                claim: this.claim,
                claimPartsDtoList: this.selectedParts
            }

            //console.log(claimBody);

            this.claimServie.updateClaim(claimBody).subscribe(res => {
                //console.log(res);
                this.saving = false;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim Updated Succefully' });
                setTimeout(() => {
                    this.router.navigate(['claim-details']);
                }, 1000);

                this.selectedParts = [];
            }, err => {
                //console.log(err);
                this.saving = false;
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'failed to update claim, please try again.' });
            });
            // else {
            //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You must select at least one part.' });
            //     this.getYPosition();
            // }
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Some Fields Are Not Valid, Please Try Again.' });
        }

    }

    calcHalf(arr) {
        // console.log(Math.ceil(arr.length / 2))
        return Math.ceil(arr.length / 2);
    }

    resetForm() {
        this.updateClaimForm.patchValue({
            inspectedBy: '',
            surveyedBy: '',
            repairCost: 0,
            repairHrs: 0,
            officeLocation: '',
            workshopGrade: '',
            bidClosingDate: '',
            assignType: 'Bidding',
            privacy: 'Public',
            suppliers: [],
            notes: '',
        });
    }

    getYPosition() {
        this.partList.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
