import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  providers: [MessageService, DatePipe]
})
export class SuppliersComponent extends GenericComponent implements OnInit {

  constructor(public route: ActivatedRoute, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
    super(route, datePipe, breadcrumbService);
  }

  ngOnInit(): void {
  }

}
