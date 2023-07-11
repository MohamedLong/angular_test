import { Component, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { DatePipe } from '@angular/common';
import { User } from '../model/user';
import { Status } from '../model/status';
import { Message } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Tenant } from '../model/tenant';
import { TenantService } from '../service/tenant.service';
import { StatusConstants } from '../../core/model/statusconstatnts';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
    template: ''
})
export class GenericComponent {

    master: any;

    masterDto: any;

    masters: any[];

    masterDtos: any[];

    selectedEntries: any[];

    masterDialog: boolean;

    msgs: Message[] = [];

    amountTotal: number = 0;

    deleteSingleDialog = false;

    deleteSingleDetailsDialog = false;

    deleteMultipleDialog = false;

    submitted: boolean;
    editable: boolean;

    tenant: Tenant;

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
    minDate: any;

    editAuth: boolean;

    deleteAuth: boolean;

    printAuth: boolean;
    approveAuth: boolean;
    cancelAuth: boolean;
    acceptAuth: boolean;
    completeAuth: boolean;
    viewAuth: boolean;

    constructor(public route: ActivatedRoute, public datePipe: DatePipe, public breadcrumbService: AppBreadcrumbService) {
        setTimeout(() => {
            this.extractPermissions();
        }, 500);
    }


    extractPermissions() {
        if (localStorage.getItem('subs')) {
            let subs = JSON.parse(localStorage.getItem('subs'));
            console.log(JSON.parse(localStorage.getItem('subs')))
            console.log(this.route.routeConfig)

            const filtered = subs.filter(sub => this.route.routeConfig.path === sub.subMenu.routerLink);

            if (filtered && filtered.length > 0) {
                //console.log('filtered found', filtered)
                this.route.routeConfig.data = {
                    newAuth: filtered[0].newAuth,
                    printAuth: filtered[0].printAuth,
                    editAuth: filtered[0].editAuth,
                    deleteAuth: filtered[0].deleteAuth,
                    approveAuth: filtered[0].approveAuth,
                    acceptAuth: filtered[0].acceptAuth,
                    cancelAuth: filtered[0].cancelAuth,
                    completeAuth: filtered[0].completeAuth,
                    viewAuth: filtered[0].viewAuth
                }
            } else {
                this.route.routeConfig.data = { newAuth: false, printAuth: false, editAuth: false, deleteAuth: false, approveAuth: false, acceptAuth: false, cancelAuth: false, completeAuth: false, viewAuth: false }
            }


            if(this.route.routeConfig.data) {
                this.editAuth = this.route.routeConfig.data.editAuth;
                this.newAuth = this.route.routeConfig.data.newAuth;
                this.printAuth = this.route.routeConfig.data.printAuth;
                this.deleteAuth = this.route.routeConfig.data.deleteAuth;
                this.approveAuth = this.route.routeConfig.data.approveAuth;
                this.cancelAuth = this.route.routeConfig.data.cancelAuth;
                this.acceptAuth = this.route.routeConfig.data.acceptAuth;
                this.completeAuth = this.route.routeConfig.data.completeAuth;
                this.viewAuth = this.route.routeConfig.data.viewAuth;
            }

            // this.editAuth = this.route.routeConfig.data && this.route.routeConfig.data.editAuth ? !this.route.routeConfig.data.editAuth : true;
            // this.newAuth = this.route.routeConfig.data && this.route.routeConfig.data.newAuth ? !this.route.routeConfig.data.newAuth : true;
            // this.printAuth = this.route.routeConfig.data && this.route.routeConfig.data.printAuth ? !this.route.routeConfig.data.printAuth : true;
            // this.deleteAuth = this.route.routeConfig.data && this.route.routeConfig.data.deleteAuth ? !this.route.routeConfig.data.deleteAuth : true;
            // this.approveAuth = this.route.routeConfig.data && this.route.routeConfig.data.approveAuth ? !this.route.routeConfig.data.approveAuth : true;
            // this.cancelAuth = this.route.routeConfig.data && this.route.routeConfig.data.cancelAuth ? !this.route.routeConfig.data.cancelAuth : true;
            // this.acceptAuth = this.route.routeConfig.data && this.route.routeConfig.data.acceptAuth ? !this.route.routeConfig.data.acceptAuth : true;
            // this.completeAuth = this.route.routeConfig.data && this.route.routeConfig.data.completeAuth ? !this.route.routeConfig.data.completeAuth : true;
            // this.viewAuth = this.route.routeConfig.data && this.route.routeConfig.data.viewAuth ? !this.route.routeConfig.data.viewAuth : true;

            //console.log(this.route.routeConfig.data)
        }
    }

    callInsideOnInit(): void {
        this.editable = false;
    }

    getMinDate() {
        var dtToday = new Date();
        var month: any = dtToday.getMonth() + 1;
        var day: any = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();
        this.minDate = year + '-' + month + '-' + day;
    }


    openNew() {
        this.master = {};
        this.masterDto = {};
        this.editable = true;
        this.submitted = false;
        this.setDefaultParameters();
        this.masterDialog = true;
    }

    editMaster(master: any) {
        this.master = { ...master };
        this.editable = true;
        this.submitted = false;
        this.masterDialog = true;
    }


    deleteSelectedEntries() {
        this.deleteMultipleDialog = true;
    }

    hideDialog() {
        this.masterDialog = false;
        this.submitted = false;
    }

    deleteAction(master: any) {
        this.deleteSingleDialog = true;
        this.master = { ...master };
    }


    setDefaultParameters() {
        var userObject = localStorage.getItem('user');
        var user = JSON.parse(userObject);
        var currentDate = new Date();
        this.master.createdBy = user.id;
        this.master.createdAt = currentDate;
    }


    findIndexById(id: number, list: any[]): number {
        let index = -1;
        for (let element of list) {
            if (element.id === id) {
                index = element.index;
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
        if (filtered.length > 0) {
            list = filtered;
            this.filteredValues = event.filteredValue;
        }
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

