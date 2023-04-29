import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ClaimService } from '../../../service/claim.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';

@Component({
    selector: 'app-claim-details',
    templateUrl: './claim-details.component.html',
})
export class ClaimDetailsComponent implements OnInit {

    constructor(private breadcrumbService: AppBreadcrumbService, private formBuilder: FormBuilder, private claimServie: ClaimService) { }
    partsList: any[] = [];
    parts: any[] = [];
    selectedParts = [];
    actions: string[] = ['No Action', 'Replace', 'Repair'];
    assignTypes: {type:string}[] = [{type: 'Direct'}, {type: 'Bidding'}];
    claim: any  = '';
    loading: boolean = true;
    updateClaimForm: FormGroup = this.formBuilder.group({
        id: [''],
        inspectedBy: [''],
        surveyedBy: [''],
        repairCost: [0],
        repairHrs: [0],
        officeLocation: [''],
        workshopGrade: [''],
        bidClosingDate: [''],
        assignType: [''],
        privacy: [{ value: 'Public', disabled: true }],
        notes: [''],
    });

    ngOnInit(): void {
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Claim Details', routerLink: ['claim-details'] }]);
        this.claim = JSON.parse(localStorage.getItem('claim'));
        // console.log(claim)
        this.onGetClaimPartList();
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
                //console.log(this.partsList)

            }, err => {
                console.log(err);
                this.loading = false;
            }
        )
    }

    onAssignTypeChange(e) {
        //console.log(e.value, this.assignTypes[1].type)
        e.value == this.assignTypes[1].type ? this.updateClaimForm.get('privacy').enable() : this.updateClaimForm.get('privacy').disable();
    }

    sendRequest() {
        //update claim with new values
        console.log(this.updateClaimForm.value);
        this.updateClaimForm.get('id').setValue(this.claim.id);

        //send request list
        let claimParts = {
            claimId: this.claim.id,
            claimPartsDtoList: this.selectedParts
        }

        console.log(claimParts);

        // this.claimServie.saveClaimParts(claimParts).subscribe((res: MessageResponse) => {
        //     //console.log(res)
        //     if (res.messageCode == 200) {
        //         // this.claimServie.update(this.updateClaimForm.value).subscribe(res => {
        //         //     console.log(res)
        //         // }, err => {
        //         //     console.log(err)
        //         // })
        //     }
        // }, err => {
        //     console.log(err)
        // });

        this.claimServie.update(this.updateClaimForm.value).subscribe(res => {
            console.log(res)
        }, err => {
            console.log(err)
        });
    }

    calcHalf(arr) {
        // console.log(Math.ceil(arr.length / 2))
        return Math.ceil(arr.length / 2);
    }
}
