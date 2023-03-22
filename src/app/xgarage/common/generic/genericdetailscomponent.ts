import { Component, ViewChild, ElementRef} from '@angular/core';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MenuItem, Message} from 'primeng/api';
import { DatePipe } from '@angular/common';
import { User } from '../model/user';
import { Status } from '../model/status';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from './genericservice';
import { StatusService } from '../service/status.service';
import { StatusConstants } from '../model/statusconstatnts';

@Component({
    template: ''
})
export class GenericDetailsComponent{

    master: any;
    masterDto: any;
    masters: any[] = [];
    masterDtos: any[];
    detailRouter: string;
    detail: any;
    details: any[] = [];
    minDate: any;
    selectedEntries: any[];
    discountDialog: boolean;
    originalMaster: any;
    originalDetail: any;
    detailDialog: boolean;
    masterDialog: boolean;
    msgs: Message[] = [];
    index: number;
    parentSubmitted: boolean;
    printingMode: boolean = false;
    detailsSubmitted: boolean;
    statusList: Status[];
    selectedStatus: Status;
    menuItems: MenuItem[] = [];
    menu: MenuItem;
    amountTotal: number;
    confirmType: string = 'confirm';
    confirmActionDialog: boolean;
    confirmStatus: Status;
    deleteSingleDialog = false;
    deleteSingleDetailsDialog = false;
    deleteMultipleDialog = false;
    submitted: boolean;
    editable: boolean;
    cols: any[];
    selectedMonth: string;
    rowsPerPageOptions = [5, 10, 20];
    loading = true;
    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    confirmationService: any;
    filteredValues: any;
    messageService: any;

    newAuth: boolean;

    editAuth: boolean;

    deleteAuth: boolean;

    printAuth: boolean;

    constructor(public route: ActivatedRoute, public router: Router, public changeStatusService: GenericService<any>, public datePipe: DatePipe,
                public statusService: StatusService, public breadcrumbService: AppBreadcrumbService) {
                    this.breadcrumbService.setItems([
                        { label: 'Pages' },
                        { label: 'Crud', routerLink: ['/pages/crud'] }
                    ]);

                    this.extractPermissions();
        }

        extractPermissions() {
            this.editAuth = this.route.routeConfig.data && this.route.routeConfig.data.editAuth ? !this.route.routeConfig.data.editAuth : true;
            this.newAuth = this.route.routeConfig.data && this.route.routeConfig.data.newAuth ? !this.route.routeConfig.data.newAuth : true;
            this.printAuth = this.route.routeConfig.data && this.route.routeConfig.data.printAuth ? !this.route.routeConfig.data.printAuth : true;
            this.deleteAuth = this.route.routeConfig.data && this.route.routeConfig.data.deleteAuth ? !this.route.routeConfig.data.deleteAuth : true;
        }

    callInsideOnInit(): void {
        this.getAllStatus();
        this.editable = false;
        this.index = -1;
        this.printingMode = false;
    }




    getMinDate(){
        var dtToday = new Date();
        var month:any = dtToday.getMonth() + 1;
        var day:any = dtToday.getDate();
        var year = dtToday.getFullYear();
        if(month < 10)
            month = '0' + month.toString();
        if(day < 10)
            day = '0' + day.toString();
        this.minDate = year + '-' + month + '-' + day;
    }

    getAllStatus() {
        this.statusService.getAll().subscribe({
            next: (statusList) => {
                this.statusList = statusList;
            }
        })
    }


    openNew() {
        this.submitted = false;
        this.detailDialog = true;
        this.index = this.index - 1;
        this.detail = {};
    }

    editAction(detail?: any) {
        this.detail = { ...detail};
        this.originalDetail = { ...this.detail};
        this.detail.total = this.detail.unitPrice * this.detail.qty;
        this.detailDialog = true;
    }

    deleteAction(detail: any) {
        this.deleteSingleDialog = true;
        this.detail = { ...detail };
    }

    confirmDelete() {
        this.deleteSingleDialog = false;
        this.master.famount = this.master.famount - this.detail.total;
        this.master.amount = this.master.famount * this.master.cuRate;
        if(this.detail.id > 0) {
            this.detail.needDeletion = true;
            this.details[this.findIndexById(this.detail.id, this.details)] = this.detail;
        }else{
            this.details = this.details.filter(val => val.id !== this.detail.id);
        }
        this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
        this.editable = true;
    }


    deleteSelectedEntries() {
        this.deleteMultipleDialog = true;
    }

    hideDialog() {
        this.detailDialog = false;
        this.submitted = false;
        this.resetDetail();
    }

    resetDetail() {
        this.detail = this.originalDetail;
    }

    resetMaster() {
        this.master = this.originalMaster;
        this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
    }


    hideParentDialog() {
        this.resetMaster();
        this.masterDialog = false;
        this.parentSubmitted = false;
        this.editable = false;
    }

    save() {
        this.submitted = true;
        if (this.detail.qty && this.detail.unitPrice && this.detail.qty >= 0 && this.detail.unitPrice > 0) {
            this.detail.total = this.detail.qty * this.detail.unitPrice;
            if (this.detail.id > 0) {
                this.master.amount = this.master.famount * this.master.cuRate;
                this.details[this.findIndexById(this.detail.id, this.details)] = this.detail;
            } else {
                this.detail.id = this.index;
                this.master.famount = this.master.famount + this.detail.total;
                this.master.amount = this.master.famount * this.master.cuRate;
                this.details.push(this.detail);
            }
            this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
            this.editable = true;
            this.details = [...this.details];
            this.detailDialog = false;
            this.detail = {};
            this.submitted = false;
        }
    }

    setDefaultParameters() {
        var userObject = localStorage.getItem('user');
        var user = JSON.parse(userObject);
        var currentDate = new Date();
        this.master.createdBy = user.id;
        this.master.createdAt = currentDate;
        const newStatus: Status = {
            id: 1,
            nameEn: 'Draft',
            nameAr: 'مقتوح'
        };
        this.master.status = newStatus;
        this.editable = false;
    }

    setOtherDefaultParameters() {
        this.setCurrentDate();
        this.master.discount = 0;
        this.master.tax = 0;
        this.master.vat = 0;
        if(this.master.amount > 0) {
            this.master.netAmount = this.master.amount;
        }else{
            this.master.netAmount = 0;
        }
    }

    setCurrentDate() {
        var currentDate = new Date();
        this.master.orderDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    }


    findIndexById(id: Number, myList: any[]): number {
        let index = -1;
        for (let i = 0; i < myList.length; i++) {
            if (myList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): number {
        return Math.floor(Math.random() * 1000);
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }


    onFilter(event, dt) {
        this.filteredValues = event.filteredValue;
      }

    filterByMonth(event, dt, list: any) {
        const filtered: any[] = [];
        for (let element of list) {
            const dto = element;
            if (this.datePipe.transform(dto.orderDate, 'MM/yyyy') === this.datePipe.transform(this.selectedMonth, 'MM/yyyy')) {
                filtered.push(dto);
            }
        }
        if(filtered.length > 0) {
            list = filtered;
            this.filteredValues = event.filteredValue;
        }
    }

    calculateDetailsSum(myList: any[]): number {
        let sum = 0;
        for (let detail of myList) {
            sum = sum + detail.price;
        }
        return sum;
    }

    print() {
        this.printingMode = true;
        setTimeout(function(){
            window.print();
        },10);
        window.onafterprint = () => this.disablePrintingMode();
    }

    disablePrintingMode() {
        this.printingMode = false;
    }


    cloneObject() {
        var newMaster = this.master;
        newMaster.id = null;
        newMaster.orderId = Math.floor(Math.random() * 1000).toString();
        newMaster.orderDate = new Date();
        newMaster.status = {
            id: 1,
            nameEn: 'Draft',
            nameAr: 'مقتوح'
        };
        newMaster.insertDate = new Date();
        this.master = newMaster;
        this.details.map(detail => detail.id = -Math.floor(Math.random() * 1000));
        this.editable = true;
        this.confirmActionDialog = false;
        this.confirmType = 'confirm';
    }

    updateCurrentObject(data: any) {
        console.log('new status:', this.confirmStatus.id);
        this.master.status.id = this.confirmStatus.id;
        this.master.status.nameEn = this.confirmStatus.nameEn;
        this.master.status.nameAr = this.confirmStatus.nameAr;
        this.messageService.add({ severity: 'success', summary: this.confirmStatus.nameEn, detail: data.statusMsg, life: 3000 });
    }

    goMaster() {
        this.router.navigate([this.detailRouter]);
    }

    getStatusName(statusId: number) {
        switch (statusId) {
          case StatusConstants.OPEN_STATUS:
            return 'Open';
          case StatusConstants.INPROGRESS_STATUS:
            return 'Initial Approval';
          case StatusConstants.ONHOLD_STATUS:
            return 'On Hold';
          case StatusConstants.COMPLETED_STATUS:
            return 'Completed';
          case StatusConstants.REJECTED_STATUS:
            return 'Rejected';
          case StatusConstants.APPROVED_STATUS:
            return 'Approved';
          case StatusConstants.CANCELED_STATUS:
            return 'Canceled';
          case StatusConstants.REVISION_STATUS:
            return 'Revision';
          case StatusConstants.LOST_STATUS:
            return 'Lost';
          case StatusConstants.REVISED_STATUS:
            return 'Revised';
          default:
            return 'Unknown';
        }
      }

}

