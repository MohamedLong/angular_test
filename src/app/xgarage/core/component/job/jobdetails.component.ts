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
import { MultipleBids } from '../../dto/multiplebids';
import { BidOrderDto } from '../../dto/bidorderdto';
import { OrderType } from '../../dto/ordertype';
import { StatusConstants } from '../../model/statusconstatnts';
import { UpdateJobDto } from '../../dto/updatedjobdto';
import html2canvas from 'html2canvas';

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

        .nis {
            font-size: 10px
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
    queryRead = false;
    suppliersBidToCompare = [];
    isSupplierChecked: boolean = false;
    displayCompareBids: boolean = false;
    groupedBypart: any[] = [];
    supplierNames: any[] = [];
    approveMultipleBidDialog: boolean = false;
    rejectMultipleBidDialog: boolean = false;
    @ViewChild('bidsTable', { read: ElementRef }) bidsTable: ElementRef;
    visible: boolean = true;
    selection: string = 'single';
    jobDto: UpdateJobDto = {};
    modalPart: any = [];
    displayModal: boolean = false;
    displayNotIntrestedSuppliers: boolean = false;
    NotIntrestedSuppliers: any[] = [];

    constructor(public route: ActivatedRoute, private jobService: JobService, private requestService: RequestService, public router: Router, public messageService: MessageService, public confirmService: ConfirmationService, private cd: ChangeDetectorRef,
        public breadcrumbService: AppBreadcrumbService, private bidService: BidService, public datePipe: DatePipe, public statusService: StatusService, private authService: AuthService) {
        super(route, router, requestService, datePipe, statusService, breadcrumbService);
    }

    ngOnInit() {
        //console.log('init')
        console.log(localStorage.getItem('jobId'));
        if (this.route.snapshot.queryParams['id']) {
            this.getJobObject(this.route.snapshot.queryParams['id']);
        } else if (localStorage.getItem('jobId')) {
            this.getJobObject(JSON.parse(localStorage.getItem('jobId')));
        }

        if (localStorage.getItem('bidView')) {
            this.activeTab = 1;
        }

        this.breadcrumbService.setItems([{ 'label': 'Requests', routerLink: ['jobs'] }, { 'label': 'Request Details', routerLink: ['job-details'] }]);
    }

    getJobObject(id: number) {
        this.jobService.getById(id).subscribe(
            {
                next: (data) => {
                    console.log(data)
                    this.master = data;
                    this.master.claimNo = data.claimNo;
                    this.masters.push(this.master);
                    this.getRequestsByJob();
                    this.getBidsByJob();
                    this.detailRouter = 'jobs';
                    this.selectedEntries = [];
                    this.callInsideOnInit();
                    this.initActionMenu();

                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
    }

    initActionMenu() {
        this.menuItems = [
            // {
            //     label: 'Draft', icon: 'pi pi-pencil', visible: (this.master.status.id != 1), command: () => {
            //         const newStatus: Status = {
            //             id: 1,
            //             nameEn: 'Draft',
            //             nameAr: 'مسودة'
            //         }
            //         this.confirmStatus = newStatus;
            //         this.confirmActionDialog = true;
            //     }
            // },
            {
                label: 'Confirm', icon: 'pi pi-check', visible: (this.master.status.id == 1), command: () => {
                    const confirmStatus: Status = {
                        id: 6,
                        nameEn: 'Confirm',
                        nameAr: 'مؤكد'
                    }
                    this.confirmStatus = confirmStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Cancel', icon: 'pi pi-times', visible: (this.master.status.id == 1), command: () => {
                    const cancelStatus: Status = {
                        id: 7,
                        nameEn: 'Canceled',
                        nameAr: 'ملغي'
                    }
                    this.confirmStatus = cancelStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Print', icon: 'pi pi-print', command: () => {
                    // this.confirmType = 'cloneConfirm';
                    // this.confirmActionDialog = true;
                    // visible: (this.master.status.id==2)
                    this.print();
                }
            },
            // {
            //     label: 'Clone', icon: 'pi pi-clone', command: (event: any) => {
            //         this.confirmType = 'cloneConfirm';
            //         this.confirmActionDialog = true;
            //     }
            // },
            // {
            //     label: 'Delete', icon: 'pi pi-trash', visible: (this.master.status.id != 2), command: (event: any) => {
            //         const deleteStatus: Status = {
            //             id: 6,
            //             nameEn: 'Deleted',
            //             nameAr: 'محذوف'
            //         }
            //         this.confirmStatus = deleteStatus;
            //         this.confirmActionDialog = true;
            //     }
            // }

        ];
    }

    confirm() {
        if (this.confirmType === 'confirm') {
            this.jobService.changeStatus(this.master.id, this.confirmStatus).subscribe({
                next: (data) => {
                    this.updateCurrentObject(data);
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
            this.confirmActionDialog = false;
        }
    }

    // confirm(event) {
    //     if (this.confirmType === 'confirm') {
    //         let statusCode = this.confirmStatus.id;
    //         this.changeStatusService.changeStatus(this.master.id, this.confirmStatus).subscribe({
    //             next: (data) => {
    //                 this.updateCurrentObject(data);
    //                 if (statusCode == 6) {
    //                     setTimeout(() => { this.goMaster(); }, 1500);
    //                 }
    //             },
    //             error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
    //         });
    //         this.confirmActionDialog = false;
    //     } else if (this.confirmType === 'cloneConfirm') {
    //         this.cloneObject();
    //     }
    // }

    getRequestsByJob() {
        this.isFetching = true;
        this.requestService.getByJob(this.master.id).subscribe({
            next: (requests) => {
                // console.log(requests)
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
    //console.log('request:',this.bidDtos)
        this.originalBidList = this.bidDtos;
        this.partName = request.part.name;
        this.selection = 'single';
        this.bidDetailsDialog = true;
        this.selectedEntries = [];
        this.bidDtos = this.bidDtos.filter(b => b.requestId == request.id);

        //console.log('bids:',this.bidDtos)
    }

    viewBidsBySupplier(bid: any) {
        //console.log(bid)
        this.originalBidList = this.bidDtos;
        this.selection = 'multiple';
        this.bidDetailsDialog = true;
        this.bidDtos = this.bidDtos.filter(b => b.supplierId == bid.supplierId);
        this.supplierName = bid.supplierName;
    }

    viewNotInterestedSuppliers(id: number) {
        this.requestService.getNotInterestedSuppliers(id).subscribe(res => {
            console.log(res)
            if(res.length > 0) {
                this.NotIntrestedSuppliers = res;
                this.displayNotIntrestedSuppliers = true;
            } else {
                this.messageService.add({ severity: 'info', summary: 'Not Interested Suppliers Are Empty' });
            }
        }, err => console.log(err))
    }

    onHideNotIntrestedSupplier() {
        this.displayNotIntrestedSuppliers = false;
        this.NotIntrestedSuppliers = [];
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

        this.getBidsByJob();
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
        //console.log(supplierBid)
        if (supplierBid.added) {
            if (supplierBid.added == true) {
                supplierBid.added = false;
                this.suppliersBidToCompare = this.suppliersBidToCompare.filter(bid => {
                    return bid.bidId !== supplierBid.bidId
                });
            } else {
                this.suppliersBidToCompare.push(supplierBid);
            }
        } else {
            supplierBid.added = true;
            this.suppliersBidToCompare.push(supplierBid);
        }
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
                        //console.log(name)
                    } else {
                        //console.log(name + " not found")
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
                        //console.log(name)
                    } else {
                        //console.log(name + " not found")
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

    onHideCompareBids() {
        //console.log('hide')
        this.suppliersBidToCompare.forEach(bid => {
            delete bid.added;
        });

        this.suppliersBidToCompare = [];
        this.groupedBypart = [];
        this.visible = false;
        setTimeout(() => this.visible = true, 0);
    }

    downloadPdf() {
        let DATA: any = this.bidsTable.nativeElement;
        html2canvas(DATA).then((canvas) => {
          let fileWidth = 208;
          let fileHeight = (canvas.height * fileWidth) / canvas.width;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
          PDF.save('bids.pdf');
        });
    }

    approveMultipleBids() {
        if (this.selectedEntries.length > 0) {
            let bidOrder: BidOrderDto = this.prepareBidOrderObject();
            this.bidService.approveMultipleBids(bidOrder).subscribe({
                next: (data) => {
                    if (data == true) {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bids Approved Successfully', life: 3000 });
                        this.selectedEntries.map(bid => bid.statusId = StatusConstants.INPROGRESS_STATUS);
                        for (let i = 0; i < this.selectedEntries.length; i++) {
                            this.bidDtos[this.findIndexById(this.selectedEntries[i].bidId, this.bidDtos)] = this.selectedEntries[i];
                        }
                        this.selectedEntries = [];
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Bids Approved Failed', life: 3000 });
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.message, life: 3000 })
            });
            this.approveMultipleBidDialog = false;
            this.closeBidDialog();
        }
    }


    prepareBidOrderObject() {
        let approvedBids: number[] = [];
        let totalVat = 0;
        let totalDiscount = 0;
        let totalOrderAmount = 0;
        let totalTotalAmount = 0;

        for (let i = 0; i < this.selectedEntries.length; i++) {
            approvedBids[i] = this.selectedEntries[i].bidId;
            totalOrderAmount = totalOrderAmount + this.selectedEntries[i].originalPrice;
            totalDiscount = totalDiscount + this.selectedEntries[i].discount;
            totalVat = totalVat + this.getValueAfterVat(this.selectedEntries[i].originalPrice, this.selectedEntries[i].discount, this.selectedEntries[i].vat);
            totalTotalAmount = totalTotalAmount + this.selectedEntries[i].price;
        }

        let bidOrder: BidOrderDto = {
            bids: approvedBids,
            shippingAddress: 1,
            shippingMethod: 1,
            paymentMethod: 1,
            orderType: OrderType.Bid,
            customer: JSON.parse(this.authService.getStoredUser()).id,
            phone: JSON.parse(this.authService.getStoredUser()).phone,
            supplier: this.selectedEntries.map(bid => bid.supplierId)[0],
            deliveryFees: 0,
            orderDate: new Date(),
            orderAmount: totalOrderAmount,
            vat: totalVat,
            discount: totalDiscount,
            totalAmount: totalTotalAmount
        };

        return bidOrder;

    }

    getValueAfterVat(price: number, vat: number, discount: number) {
        return price + ((price - discount) * vat)/100;
    }

    rejectMultipleBids() {
        if (this.selectedEntries.length > 0) {
            let rejectMultipleBids: MultipleBids = {
                processOrder: true
            };
            let rejectedBids: number[] = [];
            for (let i = 0; i < this.selectedEntries.length; i++) {
                rejectedBids[i] = this.selectedEntries[i].bidId;
            }
            rejectMultipleBids.bids = rejectedBids;
            rejectMultipleBids.processOrder = true;
            this.bidService.rejectMutltipleBids(rejectMultipleBids).subscribe({
                next: (data) => {
                    if (data == true) {
                        this.selectedEntries.map(bid => bid.statusId = StatusConstants.REJECTED_STATUS);
                        for (let i = 0; i < this.selectedEntries.length; i++) {
                            this.bidDtos[this.findIndexById(this.selectedEntries[i].bidId, this.bidDtos)] = this.selectedEntries[i];
                        }
                        this.selectedEntries = [];
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bids Rejection Successfully', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Bids Rejection Failed', life: 3000 });
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.message, life: 3000 })
            });
            this.rejectMultipleBidDialog = false;
            this.closeBidDialog();

        }
    }

    disabledRequest(request: Request) {
        return (request.status.id == StatusConstants.COMPLETED_STATUS || request.status.id == StatusConstants.CANCELED_STATUS)
    }

    onReq(event) {
        console.log(event)
        this.hideDialog();
        if (event.error) {
            this.messageService.add({ severity: 'erorr', summary: 'Error', detail: event.error.message });
        } else {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: event.message });
            let index = this.fillteredDetails.findIndex((el) => el.id === event.id);
            this.fillteredDetails[index] = event;
        }
    }


    editJobNumber(dto: any) {
        console.log(dto)
        this.jobDto.id = dto.id;
        this.jobDto.jobNumber = dto.jobNo;
        this.jobDto.status = dto.status;
        this.masterDialog = true;
    }

    updateJobNumber() {
        this.submitted = true;
        if (this.jobDto.jobNumber) {
            this.jobService.partialUpdate(this.jobDto).subscribe(
                {
                    next: (data) => {
                        if (data.messageCode == 200) {
                            this.master.jobNo = this.jobDto.jobNumber;
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Job Updated', life: 3000 });
                            this.masterDialog = false;
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Server Error', detail: data.message, life: 3000 })
                        }
                    },
                    error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
                }
            );
        }
    }

    hideJobNoDialog(): void {
        this.masterDialog = false;
    }

    showModal(part) {
        this.modalPart = part;
        this.modalPart.bidImages = this.modalPart.bidImages !== null ? this.modalPart.bidImages.split(',') : null;
        this.displayModal = true;
    }
}

