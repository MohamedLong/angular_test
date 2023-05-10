import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ClaimService } from '../../../service/claim.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Privacy } from '../../../../common/model/privacy';
import { AssignType } from '../../../../common/model/assigntype';
import { Claim } from '../../../model/claim';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  providers: [MessageService]
})
export class EditClaimComponent implements OnInit {

    constructor(private messageService: MessageService, private authService: AuthService, private breadcrumbService: AppBreadcrumbService, private formBuilder: FormBuilder, private claimServie: ClaimService) { }
    partsList: any[] = [];
    parts: any[] = [];
    selectedParts = [];
    actions: string[] = ['No Action', 'Replace', 'Repair'];
    assignTypes = Object.keys(AssignType);
    privacyList = Object.keys(Privacy);
    claimId: any  = '';
    claim: any;
    loading: boolean = true;
    tenantId: number = JSON.parse(this.authService.getStoredUser()).tenant.id;
    updateClaimForm: FormGroup = this.formBuilder.group({
        id: [''],
        inspectedBy: [''],
        surveyedBy: [''],
        repairCost: [0],
        repairHrs: [0],
        officeLocation: [''],
        workshopGrade: [''],
        bidClosingDate: [''],
        assignType: ['Bidding'],
        assignedGarage: 0,
        privacy: ['Public'],
        suppliers: [[]],
        notes: [''],
    });
    saving: boolean = false;
    addPartDialog: boolean = false;

    ngOnInit(): void {
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Claim Details', routerLink: ['claim-details'] }, { 'label': 'Edit Claim', routerLink: ['edit-claim'] }]);
        this.claim = JSON.parse(localStorage.getItem('claim'));
        this.onGetClaimPartList();

         //set claim fields on edit??
    }

    onAction(event, part) {
        //console.log(event, part);
        if (event !== 'No Action') {
            part.partOption = event;

            if (this.selectedParts.length == 0) {
                this.selectedParts.push(part);
            } else {
                let arr = this.selectedParts.find(selectedPart => {
                    return selectedPart.partId == part.partId;
                });

                if (arr) {
                    arr.partOption = event;
                } else {
                    this.selectedParts.push(part);
                }
            };

        } else {
            let arr = this.selectedParts.find(selectedPart => {
                return selectedPart.partId == part.partId;
            });

            if (arr) {
                this.selectedParts = this.selectedParts.filter(selectedPart => {
                    return selectedPart.partId !== part.partId
                })
            }
        }

        console.log(this.selectedParts)
    }

    onGetClaimPartList() {
        this.claimServie.getClaimPartList().subscribe(
            res => {
                res.forEach((part, i) => {
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

            }, err => {
                console.log(err);
                this.loading = false;
            }
        )
    }

    onEnabelBidding(e: boolean) {
        if(e) {
            this.updateClaimForm.get('privacy').enable();
            this.updateClaimForm.get('assignedGarage').reset();
        } else {
            this.updateClaimForm.get('privacy').disable();
            this.updateClaimForm.get('suppliers').setValue([]);
            this.updateClaimForm.get('privacy').setValue(['Public']);
        }
    }

    onUpdateClaim() {
        this.saving = true;

        console.log(this.updateClaimForm.value);
        this.updateClaimForm.get('id').setValue(this.claim.id);
        for(const claimKey in this.claim) {
            for(const updatedClaimkey in  this.updateClaimForm.value) {
                if(claimKey == updatedClaimkey) {
                    this.claim[claimKey] = this.updateClaimForm.value[updatedClaimkey];
                }
            }
        };

        // console.log(this.claim)

        let claimBody = {
            claim: this.claim,
            claimPartsDtoList: this.selectedParts
        }

        console.log(claimBody);

        // this.claimServie.updateClaim(claimBody).subscribe(res => {
        //     //console.log(res);
        //     this.saving = false;
        //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim Updated Succefully' });
        //     this.selectedParts = [];
        // }, err => {
        //     //console.log(err);
        //     this.saving = false;
        //     this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'failed to update claim, please try again.' });
        // });
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
}
