import { AuthService } from '../../../../auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { Status } from 'src/app/xgarage/common/model/status';
import { JobService } from '../../service/job.service';
import { InsuranceType } from '../../model/insurancetype';
import { UpdateJobDto } from '../../dto/updatedjobdto';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';


@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['../../../../demo/view/tabledemo.scss'],
    styles: ['.active {border-bottom: 2px solid #6366F1 !important;border-radius: 0;}'],
    providers: [MessageService, ConfirmationService, DatePipe]
})
export class JobComponent extends GenericComponent implements OnInit {

    constructor(public route: ActivatedRoute, private authService: AuthService,
        private router: Router, private jobService: JobService,
        public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
        super(route, datePipe, breadcrumbService);
    }

    role: number = this.authService.isLoggedIn()? JSON.parse(this.authService.getStoredUser()).roles[0].id : 0;
    selectedStatus: Status;
    statuses: Status[];
    valid: boolean = false;
    insuranceTypes = Object.values(InsuranceType);
    selectedInsuranceType: string;
    jobDto: UpdateJobDto = {};
    fillteredDto: any[] = [];
    status: any[] = ["All"];
    selectedState = 'All';
    pageNo: number = 0;
    ngOnInit(): void {
        if(localStorage.getItem('job')) {
            localStorage.removeItem('job');
        }

        super.callInsideOnInit();
        this.getAllForTenant(this.pageNo);
        console.log(this.role)
        this.breadcrumbService.setItems([{ 'label': 'Requests', routerLink: ['jobs'] }]);
    }

    getAllForTenant(page: number) {
        let user = this.authService.getStoredUser();
        if (JSON.parse(user).tenant) {
            this.jobService.getForTenant(page).subscribe({
                next: (data) => {
                    this.masterDtos = data;
                    this.masterDtos = this.masterDtos.filter(job => job.id != null);
                    this.loading = false;
                    this.fillteredDto = this.masterDtos;
                    this.setStatusNames(this.masterDtos)
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            });
        } else {
            this.jobService.getAll().subscribe({
                next: (data) => {
                    this.masterDtos = data;
                    this.masterDtos = this.masterDtos.filter(job => job.id != null);
                    this.loading = false;
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            });
        }
    }

    getAllForUser() {
        let user = this.authService.getStoredUser();
        if (JSON.parse(user).tenant) {
            this.jobService.getForUser().subscribe({
                next: (masters) => {
                    this.masters = masters;
                    this.loading = false;
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            });
        } else {
            this.jobService.getAll().subscribe({
                next: (masters) => {
                    this.masters = masters;
                    this.loading = false;
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            });
        }
    }

    confirmDelete() {
        this.jobService.delete(this.masterDto.id).subscribe(res => {
            if (res.messageCode == 200) {
                this.masterDtos = this.masterDtos.filter(val => val.id != this.masterDto.id);
                this.messageService.add({ severity: 'success', summary: 'Request Deleted successfully' });
                this.deleteSingleDialog = false;
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Could Not Delete Request', life: 3000 });
            }
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err.Message, life: 3000 });
        })
    }

    editParentAction(dto: any) {
        this.jobDto.id = dto.id;
        this.jobDto.jobNumber = dto.jobNo;
        this.jobDto.status = dto.status;
        this.masterDialog = true;
    }

    updateParent() {
        this.submitted = true;
        if (this.jobDto.jobNumber) {
            this.jobService.partialUpdate(this.jobDto).subscribe(
                {
                    next: (data) => {
                        if (data.messageCode == 200) {
                            this.masterDtos.find(job => job.id == this.jobDto.id).jobNo = this.jobDto.jobNumber;
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

    hideParentDialog() {
        this.masterDialog = false;
        this.submitted = false;
        this.editable = false;
    }

    deleteJob(dto: any) {
        this.deleteSingleDialog = true;
        this.masterDto = { ...dto };
    }


    goDetails(dto: any) {
        this.jobService.getById(dto.id).subscribe(
            {
                next: (data) => {
                    this.master = data;
                    this.master.claimNo = dto.claimNo;
                    localStorage.setItem('job', JSON.stringify(this.master));
                    this.router.navigate(['job-details']);

                    // this.router.navigate(['job-details'], {
                    //     queryParams: {
                    //       id: this.master.id
                    //     }});
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
    }

    loadRequests(e) {
        //console.log(e);
        if (this.masterDtos.length == 100) {
            if ((this.masterDtos.length - e.first) <= 10) {
                this.pageNo++;
                this.getAllForTenant(this.pageNo);
            }
        }
    }

    setStatusNames(arr) {
        let names = [];

        arr.forEach(element => {
            names.push(element.jobStatus);
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
            this.fillteredDto = this.masterDtos;
        } else {
            this.fillteredDto = this.masterDtos.filter(master => {
                return master.jobStatus == state;
            });
        }
    }

}
