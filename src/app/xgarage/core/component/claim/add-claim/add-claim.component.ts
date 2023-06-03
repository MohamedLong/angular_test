import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ClaimService } from '../../../service/claim.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Claim } from '../../../model/claim';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import domtoimage from 'dom-to-image';

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

    constructor(private router: Router, private route: ActivatedRoute,
        private messageService: MessageService,
        private breadcrumbService: AppBreadcrumbService,
        private claimService: ClaimService,
        private formBuilder: FormBuilder,
        private statusService: StatusService) { }

    activeTab = 'car-info';

    car: any;
    ticks: { id: number, name: string }[] = [];
    selectedTicks: { id: number, name: string }[] = [];
    claimForm: FormGroup = this.formBuilder.group({
        id: [''],
        excDeliveryDate: ['', Validators.required],
        breakDown: [''],
        km: ['', Validators.required],
        claimDate: [''],
        claimTicks: [[]]
    });
    saving: boolean = false;
    saved: boolean = false;
    isBreakdown: boolean = false;
    submitted: boolean = false;
    minExcDeliveryDate: Date;
    claim: Claim;
    count: number = 0;
    undo = true;
    carsheetDoc: File;
    carImageSrc: any = 'assets/layout/images/car.jpg'
    @ViewChild('secondCar', { read: ElementRef }) secondCar: ElementRef;
    ngOnInit(): void {
        this.onGetJobTicks();
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Claim Details', routerLink: ['claim-details'] }, { 'label': 'Add Claim', routerLink: ['add-claim'] }]);


        this.route.queryParamMap.subscribe(params => {
            if (params.has('update')) {
                if (localStorage.getItem('claim')) {
                    this.activeTab = 'create-claim';
                    this.claim = JSON.parse(localStorage.getItem('claim'));

                    this.claimForm.patchValue({
                        id: this.claim.id,
                        excDeliveryDate: this.claim.excDeliveryDate ? new Date(this.claim.excDeliveryDate) : '',
                        breakDown: this.claim.breakDown ? new Date(this.claim.breakDown) : '',
                        km: this.claim.km,
                        claimDate: this.claim.claimDate ? new Date(this.claim.claimDate) : '',
                        //to do 28/5
                        //claimTicks: [[]]
                    });

                    // check if breakdown is null or not
                    if (this.claim.breakDown) {
                        this.isBreakdown = true;
                    }

                    this.carImageSrc = "http://letsgo-oman.com:6060/api/v1/document/" + this.claim.documents[1].name;
                }
            }
        })
    }

    onCheckedChanged(e) {
        this.isBreakdown = e.checked;
    }

    onGetJobTicks() {
        this.claimService.getClaimTicks().subscribe(res => {
            //console.log(res)
            this.ticks = res;
            if (this.claim && this.claim.claimTicks.length > 0 && this.ticks.length > 0) {
                console.log('ticks')
                this.claim.claimTicks.forEach(claimTick => {
                    let foundTick = this.ticks.find(tick => {
                        return tick.id == claimTick.id
                    });

                    this.selectedTicks.push(foundTick);

                });
            }


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

    onUpdateCalim() {
        console.log('updating claim>>>')


        if (this.claimForm.valid) {
            //this.saving = true;

            this.claimForm.get('id').setValue(this.claim.id);
            let datetime = new Date(this.claimForm.get('claimDate').value).toISOString();
            let updatedClaimForm = this.claimForm.value;
            updatedClaimForm.claimDate = datetime;

            //check if status is already updated & update status if not
            if (this.claim.status.id == 1) {
                updatedClaimForm.status = this.statusService.statuses.find(status => { return status.id == 13 });
            }


            let claimBody = {
                claim: updatedClaimForm,
                claimPartsDtoList: []
            }

            //console.log(updatedClaimForm)

            let stringUpdatedClaimBody = JSON.stringify(claimBody);
            let UpdatedClaimFormData = new FormData();

            UpdatedClaimFormData.append('claimBody', stringUpdatedClaimBody);
            UpdatedClaimFormData.append('claimDocument', this.carsheetDoc ? this.carsheetDoc : null);

            this.claimService.updateClaim(UpdatedClaimFormData).subscribe(res => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim Updated Succefully. Redirecting To Claim..', life: 2000 });
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
            this.saving = false;
        }
    }

    goToClaimDetails(id: number) {
        localStorage.setItem('claimId', JSON.stringify(id));
        this.router.navigate(['claim-details']);
    }

    onRecievedDateSelect(val: any) {
        this.claimForm.get('excDeliveryDate').setValue('');
        this.minExcDeliveryDate = new Date(val);
        this.minExcDeliveryDate.setDate(this.minExcDeliveryDate.getDate() + 1);
    }

    printMousePos(event) {
        //console.log(event)
        this.count++;


        var zone = document.createElement('span');
        zone.innerText = String(this.count);
        zone.className = `zone-circle zone-${this.count}`;

        //console.log(zone)

        this.secondCar.nativeElement.appendChild(zone);
        this.secondCar.nativeElement.querySelector(`.zone-${this.count}`).style.left = (event.layerX - 3) + 'px';
        this.secondCar.nativeElement.querySelector(`.zone-${this.count}`).style.top = event.layerY + 'px';

        this.undo = false;
    }

    undoMousePos(event) {
        if (this.secondCar.nativeElement.querySelector(`.zone-${this.count}`)) {
            this.secondCar.nativeElement.querySelector(`.zone-${this.count}`).remove();
            this.count--;

            if (this.count == 0) {
                this.undo = true;
            }

        }
    }

    convertToImage() {
        console.log('converting img>>>')
        this.saving = true;
        this.submitted = true;
        var node = this.secondCar.nativeElement;
        var img;

        domtoimage.toPng(node, { bgcolor: '#fff' }).then(
            (dataUrl: string) => {
                img = new Image();
                img.src = dataUrl;

                console.log(dataUrl)

                var arr = dataUrl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[arr.length - 1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }

                // this.carImageSrc = dataUrl;
                this.carsheetDoc = new File([u8arr], 'carsheet.png');
                this.onUpdateCalim();
            }
        )
    }

}
