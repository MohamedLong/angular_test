import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ConfirmationService} from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GenericDetailsComponent } from 'src/app/xgarage/common/generic/genericdetailscomponent';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { RequestService } from '../../service/request.service';
import { JobService } from '../../service/job.service';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { InsuranceType } from '../../model/insurancetyps';

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

    ref: DynamicDialogRef;
    hasRef: boolean = false;
    insuranceTypes = Object.values(InsuranceType);
    selectedInsuranceType: string;

    constructor(public route: ActivatedRoute, private jobService: JobService, private requestService: RequestService, private dataService: DataService<any>, private dialogService: DialogService, public router: Router, public messageService: MessageService, public confirmService: ConfirmationService, private cd: ChangeDetectorRef,
        public breadcrumbService: AppBreadcrumbService, public datePipe: DatePipe, public statusService: StatusService) {
            super(route, router, requestService, datePipe, statusService, breadcrumbService);

        this.dataService.name.subscribe({
            next: (data) => {
                this.master = data;
                this.masters.push(this.master);
                this.getMinDate();
            }, 
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        }).unsubscribe();
    }

    ngOnInit(): void {
        if(this.master.id) {
            this.getAllByParent();
        }
        this.callInsideOnInit();
        this.detailRouter = 'jobs';
    }


    getAllByParent() {
        this.requestService.getByJob(this.master.id).subscribe({
            next: (requests) => {
                this.details = requests;
                this.loading = false;
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        });
    }

    editParentAction() {
        this.originalMaster = { ...this.master};
        this.selectedInsuranceType = this.master.insuranceType;
        this.masterDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteMultipleDialog = false;
        this.details = this.details.filter(val => !this.details.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Request Deleted', life: 3000 });
        this.selectedEntries = null;
    }  
    

    updateParent() {
        this.jobService.update(this.master).subscribe(
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

    getPartTypesAsString(partTypes: PartType[]) {
        let partTypeNames: string = '';
        partTypes.forEach(t => {
            if(partTypeNames == '') {
                partTypeNames = t.partType;
            }else{
                partTypeNames = partTypeNames + ', ' + t.partType;
            }
        })
        if(partTypeNames == '')  {
            partTypeNames = 'None';
        }
        return partTypeNames;
    }


}

