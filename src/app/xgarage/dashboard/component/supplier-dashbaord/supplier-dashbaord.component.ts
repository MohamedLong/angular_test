import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Job } from 'src/app/xgarage/core/model/job';
import { JobService } from 'src/app/xgarage/core/service/job.service';
import { DialogService } from 'primeng/dynamicdialog';


@Component({
    selector: 'app-supplier-dashbaord',
    templateUrl: './supplier-dashbaord.component.html',
    styleUrls: ['./supplier-dashbaord.component.scss'],
    providers: [MessageService]
})
export class SupplierDashbaordComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService, private jobService: JobService,
        private messageService: MessageService, private breadcrumbService: AppBreadcrumbService,
        private dialogService: DialogService) { }
    requests = [];
    latestRequest = [];
    master: Job;
    job: Job;
    role: number = JSON.parse(this.authService.getStoredUser()).roles[0].id;
    searchResults: any[];

    ngOnInit(): void {
        this.getAllForTenant();

        this.breadcrumbService.setItems([]);
    }

    search(event) {
        const searchTerm = event.query;
        this.jobService.searchlJob(searchTerm).subscribe(jobs => {
            this.searchResults = jobs;
        });
    }

    onSelect(event: any) {
        localStorage.setItem('jobId', event.id);
        this.router.navigate(['job-details']);
    }

    getAllForTenant() {
        let user = this.authService.getStoredUser();
        if (JSON.parse(user).tenant) {
            this.jobService.getForTenant().subscribe({
                next: (data) => {
                    if (data.length > 0) {
                        this.requests = data;
                        this.requests = this.requests.filter(job => job.id != null);

                        //console.log(this.requests)
                        this.requests.forEach((req, i) => {
                            if (i <= 2) {
                                if (req.partNames) {
                                    let parts = req.partNames.split(',');
                                    req.parts = parts;
                                    this.latestRequest.push(req)
                                }
                            }
                        })
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            });
        } else {
            this.jobService.getAll().subscribe({
                next: (data) => {
                    this.requests = data;
                    this.requests = this.requests.filter(job => job.id != null);
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            });
        }
    }

    onBid(dto: any) {
        localStorage.setItem('jobId', JSON.stringify(dto.id));
        localStorage.setItem('bidView', 'true');
        this.router.navigate(['job-details']);
        // this.jobService.getById(dto.id).subscribe(
        //     {
        //         next: (data) => {
        //             this.master = data;
        //             this.master.claimNo = dto.claimNo;
        //             localStorage.setItem('job', JSON.stringify(this.master));
        //             localStorage.setItem('bidView', 'true');
        //             this.router.navigate(['job-details']);
        //         },
        //         error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
        //     });
    }

}
