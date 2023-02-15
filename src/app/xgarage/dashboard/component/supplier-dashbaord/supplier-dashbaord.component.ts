import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { JobService } from 'src/app/xgarage/core/service/job.service';

@Component({
    selector: 'app-supplier-dashbaord',
    templateUrl: './supplier-dashbaord.component.html',
    styleUrls: ['./supplier-dashbaord.component.scss'],
    providers: [MessageService]
})
export class SupplierDashbaordComponent implements OnInit {
    constructor(private dataService: DataService<number>, private router: Router, private authService: AuthService, private jobService: JobService, private messageService: MessageService) { }
    requests = [];
    latestRequest= [];
    ngOnInit(): void {
        this.getAllForTenant();
    }

    getAllForTenant() {
        let user = this.authService.getStoredUser();
        if (JSON.parse(user).tenant) {
            this.jobService.getForTenant().subscribe({
                next: (data) => {
                    this.requests = data;
                    this.requests = this.requests.filter(job => job.id != null);

                    this.requests.forEach((req, i) => {
                        if(i <= 2) {
                            let parts = req.partNames.split(',')
                            req.parts = parts;
                            this.latestRequest.push(req)
                        }
                    })
                    //console.log(this.requests)
                    //console.log(this.latestRequest)
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

    onBid(id: number) {
        // let jobid  = encodeURIComponent(JSON.stringify({ jobId: id }));
        // this.router.navigate(['job-details'], { queryParams: { key: jobid } });
        // this.router.navigate(['job-details'], {state: {data: { key: id } }});
        this.dataService.changeObject(id);
        this.router.navigate(['job-details']);
    }

}
