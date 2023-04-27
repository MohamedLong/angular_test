import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ClaimService } from '../../../service/claim.service';

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
    updateClaimForm: FormGroup = this.formBuilder.group({
        inspectedBy: [''],
        surveyedBy: [''],
        repairCost: [],
        repairHrs: [''],
        officeLocation: [''],
        workshopGrade: [''],
        bidClosingDate: [''],
        assignType: [''],
        privacy: [''],
        notes: [''],
    });

    claim;

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

            if(this.selectedParts.length == 0) {
                this.selectedParts.push(part);
            } else {
                let arr = this.selectedParts.find(selectedPart => {
                    return selectedPart.partId == part.partId;
                });

                if(arr) {
                    arr.partOption = event;
                } else{
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

    sendRequest() {
        //update claim with new values
        console.log(this.updateClaimForm.value)

        //send request list
        let claimParts = {
            claimId: this.claim.id,
            claimPartsDtoList: this.selectedParts
        }

        console.log(claimParts)

        // this.claimServie.saveClaimParts(claimParts).subscribe(res => {
        //     console.log(res)
        // }, err => {
        //     console.log(err)
        // })
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

                //console.log(this.partsList)

            }, err => {
                console.log(err)
            }
        )
    }
}
