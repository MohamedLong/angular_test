import { AuthService } from '../../../../auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { Status } from 'src/app/xgarage/common/model/status';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { RequestService } from '../../service/request.service';
import { RequestDto } from '../../dto/requestdto';


@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['../../../../demo/view/tabledemo.scss'],

  providers: [MessageService, ConfirmationService, DatePipe]
})
export class RequestComponent extends GenericComponent implements OnInit {

  constructor(public route: ActivatedRoute, private authService: AuthService,
    private router: Router, private requestService: RequestService, private dataService: DataService<Request>,
    public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
    super(route, datePipe, breadcrumbService);
}

selectedStatus: Status;
statuses: Status[];
valid: boolean = false;

  ngOnInit(): void {
    super.callInsideOnInit();
    this.getAllForUser();

  }

  getAllForUser() {
    let user = this.authService.getStoredUser();
    if(JSON.parse(user).tenant){
      this.requestService.getForUser().subscribe({
      next: (data) => {
          this.masterDtos = data;
          console.log('this.masters: ', this.masterDtos);
          this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
  });
    }else{
      this.requestService.getAll().subscribe({
        next: (data) => {
          this.masterDtos = data;
          console.log('this.masters: ', this.masterDtos);
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


goDetails(request: RequestDto) {
  this.requestService.getById(request.id).subscribe(
      {
          next: (data) => {
              this.master = data;
              this.dataService.changeObject(this.master);
              this.router.navigate(['request-details']);
          },
          error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
  });
  }

}
