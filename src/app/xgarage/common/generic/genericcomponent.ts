import { Component, ViewChild, ElementRef} from '@angular/core';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { DatePipe } from '@angular/common';
import { User } from '../model/user';
import { Status } from '../model/status';
import { Message } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Tenant } from '../model/tenant';
import { TenantService } from '../service/tenantservice.service';

@Component({
    template: ''
})
export class GenericComponent{

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

    constructor(public route: ActivatedRoute, public datePipe: DatePipe, private breadcrumbService: AppBreadcrumbService) {
                    this.extractPermissions();
    }


    extractPermissions() {
        this.editAuth = this.route.routeConfig.data && this.route.routeConfig.data.editAuth ? this.route.routeConfig.data.editAuth : false;
        this.newAuth = this.route.routeConfig.data && this.route.routeConfig.data.newAuth ? this.route.routeConfig.data.newAuth : false;
        this.printAuth = this.route.routeConfig.data && this.route.routeConfig.data.printAuth ? this.route.routeConfig.data.printAuth : false;
        this.deleteAuth = this.route.routeConfig.data && this.route.routeConfig.data.deleteAuth ? this.route.routeConfig.data.deleteAuth : false;
    }

    callInsideOnInit(): void {
        this.editable = false;
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
        const insertUser: User = {
            id: 1,
            userId: user.userId
        };
        const newStatus: Status = {
            id: 1,
            nameEn: 'Draft',
            nameAr: 'مقتوح'
        };
        var currentDate = new Date();
        this.master.createdBy = insertUser;
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
        if(filtered.length > 0) {
            list = filtered;
            this.filteredValues = event.filteredValue;
        }
    }


}

