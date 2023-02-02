import { StatusConstants } from '../../model/statusconstatnts';
import { AuthService } from '../../../../auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { ClaimService } from '../../service/claimservice';
import { Status } from 'src/app/xgarage/common/model/status';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import { JobService } from '../../service/job.service';
import { Job } from '../../model/job';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';


@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['../../../../demo/view/tabledemo.scss'],

  providers: [MessageService, ConfirmationService, DatePipe]
})
export class JobComponent extends GenericComponent implements OnInit {

  constructor(public route: ActivatedRoute, private authService: AuthService, private claimService: ClaimService,
    private router: Router, private jobService: JobService, private dataService: DataService<Job>,
    public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
    super(route, datePipe, breadcrumbService);
}

selectedStatus: Status;
statuses: Status[];
valid: boolean = false;

  ngOnInit(): void {
    super.callInsideOnInit();
    this.getAllForTenant();

  }

  getAllForTenant() {
    let user = this.authService.getStoredUser();
    if(JSON.parse(user).tenant){
      this.jobService.getForTenant().subscribe({
      next: (data) => {
          this.masterDtos = data;
          this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
  });
    }else{
      this.jobService.getAll().subscribe({
        next: (data) => {
          this.masterDtos = data;
          this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
  });
    }
 }

  getAllForUser() {
    let user = this.authService.getStoredUser();
    if(JSON.parse(user).tenant){
      this.jobService.getForUser().subscribe({
      next: (masters) => {
          this.masters = masters;
          this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
  });
    }else{
      this.jobService.getAll().subscribe({
        next: (masters) => {
          this.masters = masters;
          this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
  });
    }
 }
 
// We need to confirm the cancellation / deletion method

confirmDelete() {
  // this.jobService.delete(this.master.id).subscribe(res => {
  //   if(res.messageCode == 200){
  //     this.messageService.add({ severity: 'success', summary: 'Job cancelled successfully' });
  //     this.deleteSingleDialog = false;
  //     this.getAllForUser();
  //   }
  //   else{
  //     this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Could Not Cancel Job', life: 3000 });     
  //   }
  // }, err => {
  //     this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err.Message, life: 3000 });
  // })
}


goDetails(dto: any) {
  this.jobService.getById(dto.id).subscribe(
    {
        next: (data) => {
            this.master = data;
            this.dataService.changeObject(this.master);
            this.router.navigate(['job-details']);
        },
        error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
});
}

}
