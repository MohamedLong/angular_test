import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GenericDetailsComponent } from 'src/app/xgarage/common/generic/genericdetailscomponent';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import { RequestService } from '../../service/request.service';
import { JobService } from '../../service/job.service';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { InsuranceType } from '../../model/insurancetype';
import { BidService } from '../../service/bidservice.service';
import { BidDto } from '../../dto/biddto';
import { Request } from '../../model/request';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Status } from 'src/app/xgarage/common/model/status';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
export class JobDetailsComponent extends GenericDetailsComponent implements OnInit, AfterViewInit {
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
    queryRead = false;
    suppliersBidToCompare = [];
    isSupplierChecked: boolean = false;
    displayCompareBids: boolean = false;
    groupedBypart: any[] = [];
    supplierNames: any[] = [];
    approveMultipleBidDialog: boolean = false;
    rejectMultipleBidDialog: boolean = false;
    @ViewChild('toggleBid', { static: true }) input: ElementRef;

    constructor(public route: ActivatedRoute, private jobService: JobService, private requestService: RequestService, public router: Router, public messageService: MessageService, public confirmService: ConfirmationService, private cd: ChangeDetectorRef,
        public breadcrumbService: AppBreadcrumbService, private bidService: BidService, public datePipe: DatePipe, public statusService: StatusService, private authService: AuthService) {
        super(route, router, requestService, datePipe, statusService, breadcrumbService);
    }

    ngOnInit() {
        if (localStorage.getItem('job')) {
            let data = JSON.parse(localStorage.getItem('job'));
            this.master = data;
            //console.log(this.master)
            this.master.claimNo = data.claimNo;
            this.masters.push(this.master);
            this.getRequestsByJob();
            this.getBidsByJob();
            this.detailRouter = 'jobs';
            this.selectedEntries = [];
            this.callInsideOnInit();
            this.initActionMenu();
            // this.activeTab = 1;
        }

    }

    initActionMenu() {
        this.menuItems = [
            {
                label: 'Draft', icon: 'pi pi-pencil', visible: (this.master.status.id!=1), command: (event: any) => {
                    const newStatus: Status = {
                        id: 1,
                        nameEn: 'Draft',
                        nameAr: 'مقتوح'
                    }
                    this.confirmStatus = newStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Confirm', icon: 'pi pi-check', visible: (this.master.status.id!=2), command: (event: any) => {

                    const confirmStatus: Status = {
                        id: 2,
                        nameEn: 'Confirm',
                        nameAr: 'مؤكد'
                    }
                    this.confirmStatus = confirmStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Cancel', icon: 'pi pi-times', visible: (this.master.status.id!=2), command: (event: any) => {
                    const cancelStatus: Status = {
                        id: 3,
                        nameEn: 'Canceled',
                        nameAr: 'ملغي'
                    }
                    this.confirmStatus = cancelStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Print', icon: 'pi pi-print', command: (event: any) => {
                    // this.confirmType = 'cloneConfirm';
                    // this.confirmActionDialog = true;
                    // visible: (this.master.status.id==2)
                    this.print();
                }
            },
            {
                label: 'Clone', icon: 'pi pi-clone', command: (event: any) => {
                    this.confirmType = 'cloneConfirm';
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Delete', icon: 'pi pi-trash', visible: (this.master.status.id!=2), command: (event: any) => {
                    const deleteStatus: Status = {
                        id: 6,
                        nameEn: 'Deleted',
                        nameAr: 'محذوف'
                    }
                    this.confirmStatus = deleteStatus;
                    this.confirmActionDialog = true;
                }
            }

        ];
    }

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

    designCompareBids(bids: any[]) {

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
        this.bidDetailsDialog = false;
        this.selectedEntries = [];
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

    onToggleBid(supplierBid) {
        if (supplierBid.add) {
            if (supplierBid.add == true) {
                supplierBid.add = false;
                this.suppliersBidToCompare = this.suppliersBidToCompare.filter(bid => {
                    return bid.bidId !== supplierBid.bidId
                });
            } else {
                this.suppliersBidToCompare.push(supplierBid);
            }
        } else {
            supplierBid.add = true;
            this.suppliersBidToCompare.push(supplierBid);

        }
        //console.log(this.suppliersBidToCompare);
    }

    onCompareBids() {
        //console.log(this.bidDtos)
        let bids = this.bidDtos;
        let bidsToCompare = [];
        let partNames = [];


        //compare selected suppliers with all suppliers
        if (this.suppliersBidToCompare.length >= 2) {
            this.suppliersBidToCompare.forEach(supp => {
                bids.forEach(bid => {
                    //5 //4 //5 //6
                    if (bid.supplierId == supp.supplierId) {
                        bidsToCompare.push(bid)
                    }
                })
            });
            //console.log(bidsToCompare)

            //get part names
            bidsToCompare.forEach(bid => {
                if (partNames.length > 0) {
                    let name = partNames.find(part => part == bid.partName);
                    if (name) {
                        console.log(name)
                    } else {
                        console.log(name + " not found")
                        partNames.push(bid.partName)
                    }
                } else {
                    partNames.push(bid.partName)
                }
            })

            bidsToCompare.forEach(bid => {
                if (this.supplierNames.length > 0) {
                    let name = this.supplierNames.find(supp => supp == bid.supplierName);
                    if (name) {
                        console.log(name)
                    } else {
                        console.log(name + " not found")
                        this.supplierNames.push(bid.supplierName)
                    }
                } else {
                    this.supplierNames.push(bid.supplierName)
                }
            })

            //console.log(this.supplierNames)
            //group bids by part name
            partNames.forEach(name => {
                bidsToCompare.forEach(bid => {
                    if (bid.partName == name) {
                        if (this.groupedBypart.length > 0) {
                            let existingPart = this.groupedBypart.find(part => part.partName == bid.partName);
                            if (existingPart) {
                                existingPart.bids.push(bid)
                            } else {
                                this.groupedBypart.push({ partName: name, bids: [bid] })
                            }
                        } else {
                            this.groupedBypart.push({ partName: name, bids: [bid] })
                        }
                    }
                })
            });

            //console.log(this.groupedBypart)
            this.displayCompareBids = true

        } else {
            this.messageService.add({ severity: 'error', summary: 'please select 2 or more bids to comapre' })
        }
    }

    ngAfterViewInit() {
        // console.log(this.input)
      }

    onHideCompareBids() {
        console.log('hide')
        this.groupedBypart = [];
        this.suppliersBidToCompare = [];

        // console.log(this.input)
    }

    downloadPdf() {
        const doc = new jsPDF();
        autoTable(doc, { html: '#bids-table' });
        doc.save('bids.pdf')
    }


    confirm(event) {
        if(this.confirmType === 'confirm'){
            let statusCode = this.confirmStatus.id;
            this.changeStatusService.changeStatus(this.master.id, this.confirmStatus).subscribe({
                next: (data) => {
                    this.updateCurrentObject(data);
                    if(statusCode == 6) {
                        setTimeout(() => {this.goMaster();}, 1500);
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
            this.confirmActionDialog = false;
        }else if(this.confirmType === 'cloneConfirm'){
            this.cloneObject();
        }
    }

}

