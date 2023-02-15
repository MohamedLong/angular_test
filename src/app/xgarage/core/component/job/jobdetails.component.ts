import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GenericDetailsComponent } from 'src/app/xgarage/common/generic/genericdetailscomponent';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { RequestService } from '../../service/request.service';
import { JobService } from '../../service/job.service';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { InsuranceType } from '../../model/insurancetype';
import { BidService } from '../../service/bidservice.service';
import { BidDto } from '../../dto/biddto';
import { Request } from '../../model/request';
import { AuthService } from 'src/app/auth/services/auth.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'job-details',
    templateUrl: './jobdetails.component.html',
    styleUrls: ['../../../../demo/view/tabledemo.scss'],
    styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }

        .active {border-bottom: 2px solid #6366F1 !important;border-radius: 0;}

        @media screen and (max-width: 960px) {
            :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
                text-align: center;
            }

            :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
                display: flex;
            }
        }

    `],
    providers: [MessageService, ConfirmationService, DialogService, DatePipe]
})
export class JobDetailsComponent extends GenericDetailsComponent implements OnInit {
    status: any[] = ["All"];
    selectedState = 'All';
    fillteredDetails: any[] = [];
    ref: DynamicDialogRef;
    hasRef: boolean = false;
    bidDtos: BidDto[] = [];
    insuranceTypes = Object.values(InsuranceType);
    selectedInsuranceType: string;
    updateRequest: boolean = false;
    type: string;
    partName: string = null;
    supplierName: string = null;
    bidDetailsDialog: boolean = false;
    originalBidList: BidDto[] = [];
    supplierBids: BidDto[] = [];
    isFetching: boolean = false;
    role: number = JSON.parse(this.authService.getStoredUser()).roles[0].id;
    activeTab: number = 0;

    constructor(public route: ActivatedRoute, private jobService: JobService, private requestService: RequestService, private dataService: DataService<any>, private dialogService: DialogService, public router: Router, public messageService: MessageService, public confirmService: ConfirmationService, private cd: ChangeDetectorRef,
        public breadcrumbService: AppBreadcrumbService, private bidService: BidService, public datePipe: DatePipe, public statusService: StatusService, private authService: AuthService) {
        super(route, router, requestService, datePipe, statusService, breadcrumbService);

        this.dataService.name.subscribe({
            next: (data) => {
                if (typeof data == 'number') {
                    console.log(typeof data)
                    this.jobService.getById(data).subscribe(
                        {
                            next: (data) => {
                                this.master = data;
                                this.masters.push(this.master);
                                this.activeTab = 2;
                                // this.master.claimNo = dto.claimNo;
                            },
                            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
                        });
                } else {
                    this.master = data;
                    this.masters.push(this.master);
                    this.getMinDate();
                }

                this.getRequestsByJob();
                this.getBidsByJob();

                this.callInsideOnInit();
                this.detailRouter = 'jobs';

            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        }).unsubscribe();

    }

    ngOnInit(): void {}


    getRequestsByJob() {
        this.isFetching = true;
        this.requestService.getByJob(this.master.id).subscribe({
            next: (requests) => {
                this.details = requests;
                this.fillteredDetails = requests;
                this.setStatusNames(this.details)
                this.loading = false;
                this.isFetching = false;
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Information', detail: e.error, life: 3000 })
        });
    }

    getBidsByJob() {
        this.bidService.getByJob(this.master.id).subscribe({
            next: (bids) => {
                this.bidDtos = bids;
                this.loading = false;
            },
            error: (e) => this.messageService.add({ severity: 'warn', summary: 'Server Information', detail: e.error, life: 3000 })
        });
    }

    editParentAction() {
        this.originalMaster = { ...this.master };
        this.selectedInsuranceType = this.master.insuranceType;
        this.masterDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteMultipleDialog = false;
        this.details = this.details.filter(val => !this.details.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Request Deleted', life: 3000 });
        this.selectedEntries = null;
    }

    confirmCancel(id: number) {
        console.log(id);
        this.requestService.cancelRequest(id).subscribe(res => {
            if (res.messageCode == 200) {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
            } else {
                this.messageService.add({ severity: 'erorr', summary: 'Erorr', detail: res.message });
            }
        }, err => {
            this.messageService.add({ severity: 'erorr', summary: 'Erorr', detail: err.error.message });
        });

        this.deleteSingleDialog = false;
    }


    updateParent() {
        this.parentSubmitted = true;
        if (this.master.jobNo && this.selectedInsuranceType) {
            this.master.insuranceType = this.selectedInsuranceType;
            this.jobService.partialUpdate(this.master).subscribe(
                {
                    next: (data) => {
                        this.master = data;
                        this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Job Updated', life: 3000 });
                        this.masterDialog = false;
                    },
                    error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
                }
            );
        }
    }

    openNew() {
        this.type = 'new req';
        super.openNew();
    }

    editAction(detail?: any) {
        this.type = 'edit req';
        super.editAction(detail);
    }

    viewBidsByRequest(request: Request) {
        this.originalBidList = this.bidDtos;
        this.partName = request.part.name;
        this.bidDetailsDialog = true;
        this.bidDtos = this.bidDtos.filter(b => b.requestId == request.id);
    }

    viewBidsBySupplier(bid: any) {
        this.originalBidList = this.bidDtos;
        this.bidDetailsDialog = true;
        this.bidDtos = this.bidDtos.filter(b => b.supplierId == bid.supplierId);
        this.supplierName = bid.supplierName;
    }

    handleChange(e) {
        let index = e.index;
        if (index == 1) {
            this.switchToViewBySupplier();
        }
    }
    switchToViewBySupplier() {
        this.supplierBids = this.bidDtos.filter((a, i) => this.bidDtos.findIndex((s) => a.supplierId === s.supplierId) === i);
    }

    cancelViewBids() {
        this.bidDtos = this.originalBidList;
        this.originalBidList = [];
    }

    getTotalPriceForSupplier(id: number) {
        let bidList = this.bidDtos.filter(s => s.supplierId == id);
        return this.calculateDetailsSum(bidList);
    }

    getTotalSubmittedBidsForSupplier(id: number) {
        let bidList = this.bidDtos.filter(s => s.supplierId == id);
        return bidList.length;
    }

    closeBidDialog() {
        this.partName = null;
        this.supplierName = null;
        this.bidDtos = this.originalBidList;
    }

    getPartTypesAsString(partTypes: PartType[]) {
        let partTypeNames: string = '';
        partTypes.forEach(t => {
            if (partTypeNames == '') {
                partTypeNames = t.partType;
            } else {
                partTypeNames = partTypeNames + ', ' + t.partType;
            }
        })
        if (partTypeNames == '') {
            partTypeNames = 'None';
        }
        return partTypeNames;
    }

    setStatusNames(arr) {
        //console.log(arr)
        let names = [];
        arr.forEach(element => {
            names.push(element.status.nameEn);
        });

        if (names.length > 0) {
            names.forEach((name, index) => {
                if (!this.status.includes(name)) {
                    this.status.push(name);
                }
            });
        }

        //console.log(names)

        // names.forEach(name => {
        //     console.log(name, this.status.includes(name))
        //     if(this.status.includes(name)) {

        //     } else {
        //         this.status.push(name)
        //     }
        // })

        // console.log(this.status)

        // if (names.length > 0) {
        //     names.forEach((name, index) => {
        //         //console.log(this.status.includes(name, 0), name.state)
        //         if (this.status.includes(name)) {
        //             console.log('includes')
        //             this.status[index].count = this.status[index].count + 1;
        //         } else {
        //             console.log('not includes')
        //             console.log(name)
        //             this.status.push(name);
        //             console.log(this.status)
        //         }
        //     });
        // }
    }

    filterByStatus(state: any) {
        this.selectedState = state;
        if (state == 'All') {
            this.fillteredDetails = this.details;
        } else {
            this.fillteredDetails = this.details.filter(detail => {
                return detail.status.nameEn == state;
            });
        }
    }

}

