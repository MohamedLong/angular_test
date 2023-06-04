import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ClaimService } from '../../../service/claim.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Privacy } from '../../../../common/model/privacy';
import { AssignType } from '../../../../common/model/assigntype';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RequestService } from '../../../service/request.service';
import { PrincipleService } from '../../../service/principle.service'
import { PartService } from '../../../service/part.service';
import { StatusService } from 'src/app/xgarage/common/service/status.service';

@Component({
    selector: 'app-edit-claim',
    templateUrl: './edit-claim.component.html',
    providers: [MessageService]
})
export class EditClaimComponent implements OnInit {

    constructor(private partservice: PartService, private requestService: RequestService, private router: Router,
        private messageService: MessageService, private authService: AuthService, private breadcrumbService: AppBreadcrumbService,
        private formBuilder: FormBuilder, private claimServie: ClaimService,
        private principleService: PrincipleService, private statusService: StatusService) { }
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
    tenant: any = JSON.parse(this.authService.getStoredUser()).tenant;
    updateClaimForm: FormGroup = this.formBuilder.group({
        id: [''],
        inspector: ['', Validators.required],
        surveyer: ['', Validators.required],
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
    submittedPart: boolean = false;
    saving: boolean = false;
    claimDate: Date;
    label: string = "Create Request";
    selectedPartOptions: any[] = [];
    @ViewChild('partList') partList: ElementRef;
    partName: string = '';
    partCategory: any;
    partSubcategory: any;
    principles: any[];
    filteredPrinciples: any[];

    ngOnInit(): void {
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Claim Details', routerLink: ['claim-details'] }, { 'label': 'Edit Claim', routerLink: ['edit-claim'] }]);
        this.claim = JSON.parse(localStorage.getItem('claim'));
        if (localStorage.getItem('claimSelectedParts')) {
            this.selectedPartOptions = JSON.parse(localStorage.getItem('claimSelectedParts'));
            this.label = 'Update Claim';
        };

        //get all principles
        this.onGetPrinciples();

        //get claim date & add one day to it
        this.claimDate = new Date(this.claim.claimDate);
        this.claimDate.setDate(this.claimDate.getDate() + 1);

        this.onGetClaimPartList();

        //set claim fields on edit
        this.updateClaimForm.patchValue({
            inspector: this.claim.inspector,
            surveyer: this.claim.surveyer,
            repairCost: this.claim.repairCost ? this.claim.repairCost : 0,
            repairHrs: this.claim.repairHrs ? this.claim.repairHrs : 0,
            officeLocation: this.claim.officeLocation,
            workshopGrade: this.claim.workshopGrade,
            bidClosingDate: this.claim.bidClosingDate ? new Date(this.claim.bidClosingDate) : '',
            assignType: this.claim.assignType,
            assignedGarage: this.claim.assignedGarage ? this.claim.assignedGarage : null,
            privacy: this.claim.privacy,
            suppliers: this.claim.suppliers,
            notes: this.claim.notes,
        });

        if (this.updateClaimForm.get('suppliers').value.length > 0 || this.updateClaimForm.get('assignedGarage').value !== null) {
            this.updateClaimForm.get('privacy').disable();
            this.updateClaimForm.get('assignType').disable();
        }

    }

    onAction(action: string, part: any) {
        console.log(action, part);
        console.log('before:', this.selectedParts)
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

                console.log(this.partsList)

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

            //check if entered inpector is new
            if (!this.updateClaimForm.get('inspector').value.id) {
                this.updateClaimForm.get('inspector').setValue({
                    role: "Inspector",
                    name: this.updateClaimForm.get('inspector').value,
                    tenant: this.tenant.id,
                    deleted: false
                })
            } else {
                delete this.updateClaimForm.get('inspector').value.updatedAt;
                delete this.updateClaimForm.get('inspector').value.createdAt;
            }

            //check if entered surveyor is new
            if (!this.updateClaimForm.get('surveyer').value.id) {
                this.updateClaimForm.get('surveyer').setValue({
                    role: "Surveyer",
                    name: this.updateClaimForm.get('surveyer').value,
                    tenant: this.tenant.id,
                    deleted: false
                })
            } else {
                delete this.updateClaimForm.get('surveyer').value.updatedAt;
                delete this.updateClaimForm.get('surveyer').value.createdAt;
            }

            //console.log(this.updateClaimForm.value);
            this.updateClaimForm.get('id').setValue(this.claim.id);
            for (const claimKey in this.claim) {
                for (const updatedClaimkey in this.updateClaimForm.value) {
                    if (claimKey == updatedClaimkey) {
                        this.claim[claimKey] = this.updateClaimForm.value[updatedClaimkey];
                    }
                }
            };

            delete this.claim.updatedAt;
            delete this.claim.createdAt;

            if (this.claim.suppliers.length > 0) {
                this.claim.suppliers.forEach((sup, i) => {
                    this.claim.suppliers[i] = { id: sup.id }
                })
            };

            //check if status is already updated & update status if not
            if (this.claim.status.id == 13) {
                this.claim.status = this.statusService.statuses.find(status => { return status.id == 12 });
            }

            //console.log(this.claim)

            let claimBody = {
                claim: this.claim,
                claimPartsDtoList: this.selectedParts
            }

            let stringUpdatedClaimBody = JSON.stringify(claimBody);
            let UpdatedClaimFormData = new FormData();

            UpdatedClaimFormData.append('claimBody', stringUpdatedClaimBody);
            UpdatedClaimFormData.append('claimDocument', null);

            //console.log(claimBody);

            this.claimServie.updateClaim(UpdatedClaimFormData).subscribe(res => {
                //console.log(res);
                this.saving = false;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim Updated Succefully. Redirecting To Claim..', life: 2000 });
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
            this.getYPosition();
        }

    }

    onAddNewPart(part: any) {
        // console.log(this.partName, part)

        this.partCategory = { id: part.categoryId, name: part.categoryName };
        this.partSubcategory = { id: part.subcategoryId, name: part.subcategoryName };;

        this.addPartDialog = true;
    }

    onSavePart() {
        this.submittedPart = true;
        this.requestService.part.subscribe(val => {
            let categoryFound: any;
            let partFound: any;

            if (Object.keys(val).length !== 0) {
                //console.log('saving part')
                val.part.categoryId = this.partCategory.id;
                val.part.subCategoryId = this.partSubcategory.id;
                val.part.subCategory = { id: this.partSubcategory.id };

                categoryFound = this.partsList.find(list => {
                    return list.id == val.part.categoryId;
                });

                if (categoryFound) {
                    partFound = categoryFound.list.find(part => {
                        return part.partId == val.part.id;
                    })
                };

                let body = {
                    claim: { id: this.claim.id },
                    part: { id: val.part.id },
                    partOption: val.option
                };

                console.log('in edit claim comp', val.part, body)
                if (!partFound) {
                    if (val.exists) {
                        let updateList = this.partsList.find(part => part.id == val.part.categoryId);
                        val.part.action = val.option;
                        val.part.partName = val.part.name;
                        updateList.list.push(val.part);

                        this.onAction(val.part.action, { partId: val.part.id });

                        this.addPartDialog = false;
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Part Added Succefully' });
                        this.submittedPart = false;
                    } else {
                        this.partservice.add(val.part).subscribe(res => {
                            console.log(res)
                            if (res.id) {
                                body.part.id = res.id;
                            }

                            res.action = body.partOption;
                            res.partName = res.name;
                            delete res.name;
                            console.log('res after:', res)
                            let updateList = this.partsList.find(part => part.id == res.categoryId);
                            updateList.list.push(res);

                            this.onAction(res.action, { partId: res.id });


                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Part Added Succefully' });
                            this.submittedPart = false;
                            this.addPartDialog = false;
                        }, err => {
                            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Something Went Wrong, Please Try Again Later.' });
                            this.submittedPart = false;
                            this.addPartDialog = false;
                        });
                    }
                } else {
                    //console.log(this.partsList, categoryFound, partFound)
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'This part already exists on the list.', life: 3000 });
                    this.addPartDialog = false;
                    this.submittedPart = false;
                }
            } else {
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'please fill out all fields.' });
                this.submittedPart = false;
            }

        }).unsubscribe();
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

    onGetPrinciples() {
        this.principleService.getForTenant().subscribe(res => {
            //console.log(res);
            this.principles = res;
        }, err => {
            console.log(err);
        })
    }

    filterPrinciples(event) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < this.principles.length; i++) {
            let country = this.principles[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredPrinciples = filtered;
    }

    onPrincipleselect(value) {
        console.log(value)
    }
}
