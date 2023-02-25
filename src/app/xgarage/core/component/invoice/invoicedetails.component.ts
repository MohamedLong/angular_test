import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ConfirmationService} from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ItemsService } from 'src/app/erp/common/service/itemservice';
import { MetricService } from 'src/app/erp/common/service/metricservice';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/erp/common/generic/dataservice';
import { StatusService } from 'src/app/erp/common/service/statusservice';
import { StockService } from 'src/app/erp/common/service/stockservice';
import { PartiesService } from 'src/app/erp/common/service/partiesservice';
import { CurrencyService } from 'src/app/erp/common/service/currencyservice';
import { InvSalePerforma } from '../../model/performa';
import { DatePipe } from '@angular/common';
import { InvSaleInvoice } from '../../model/invoice';
import { InvoiceService } from '../../service/invoiceservice';
import { InvoiceDetailService } from '../../service/invoicedetailservice';
import { PerformaDetailsComponent } from '../performa/performadetails.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GenericDetailsComponent } from 'src/app/erp/common/generic/genericdetailscomponent';
import { Observable, Observer, of, Subject } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/unsaved.guard';
import { VatService } from 'src/app/erp/common/service/vatservice';
import { MasterDetailsDto } from 'src/app/erp/common/generic/masterdetailsdto';
import { InvSaleInvoiceDetails } from '../../model/invoicedetails';
import { PaymentType } from 'src/app/erp/common/model/paymenttype';
import { PaymentMethod } from 'src/app/erp/common/model/paymentmethods';
import { PaymentEntry } from 'src/app/erp/common/model/paymententry';
import { PaymentMethodService } from 'src/app/erp/common/service/paymentmethodservice';
import { PaymentEntryService } from 'src/app/erp/common/service/paymententryservice';
import { AccSafes } from 'src/app/erp/common/model/accsafes';
import { AccBanks } from 'src/app/erp/common/model/accbanks';
import { AccSafeService } from 'src/app/erp/common/service/accsafeservice';
import { AccBankService } from 'src/app/erp/common/service/accbankservice';
import { Status } from 'src/app/erp/common/model/status';
import { StockOrderDetailsService } from '../../service/stockorderdetailservice';
import { InvStockOrderDetails } from '../../model/stockorderdetails';
import { InvStockOrder} from '../../model/stockorder';
import { InvSaleRevert } from '../../model/salerevert';
import { InvSaleRevertDetails } from '../../model/salerevertdetails';
import { RevertDetailsService } from '../../service/revertdetailservice';
import { Currency } from 'src/app/erp/common/model/currency';
import { SaleCost } from 'src/app/erp/common/model/salecost';
import { SaleCostService } from 'src/app/erp/common/service/salecostservice';

@Component({
  selector: 'purch-order-child',
  templateUrl: './invoicedetails.component.html',
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
export class InvoiceDetailsComponent extends GenericDetailsComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

    ref: DynamicDialogRef;

    private unsubscribe = new Subject();


    paymentTypes: PaymentType[];

    selectedPaymentType: PaymentType;

    paymentMethods: PaymentMethod[];
    paymentMinDate: any;

    selectedPaymentMethod: PaymentMethod;

    paymentEntry: any;

    hasRef: boolean = false;
    paymentEntries: PaymentEntry[];

    selectedSafe: AccSafes;
    safes: AccSafes[];

    selectedBank: AccBanks;
    banks: AccBanks[];

    paymentEntryDialog: boolean;

    stockOrderDialog: boolean;

    saleRevertDialog: boolean;
    saleRevert: any;
    saleRevertDetails: any[];
    saleRevertSubmitted: boolean;

    paymentSubmitted: boolean;
    stockOrderSubmitted: boolean;
    deleteSinglePaymentDialog: boolean;

    saleAccounts: SaleCost[];
    selectedSaleAccount: SaleCost;

    stockOrder: any;
    stockOrderDetails: any[];

    constructor(public route: ActivatedRoute, private dialogService: DialogService, public router: Router, public invoiceService: InvoiceService, private dataService: DataService<InvSaleInvoice>, private invoiceDetailsService: InvoiceDetailService , public itemService: ItemsService, public metricService: MetricService, public messageService: MessageService, public confirmService: ConfirmationService, private cd: ChangeDetectorRef,
        public breadcrumbService: AppBreadcrumbService, private safeService: AccSafeService, public saleCostService: SaleCostService, private saleRevertDetailsService: RevertDetailsService, private stockOrderDetailsService: StockOrderDetailsService, private bankService: AccBankService, private paymentMethodService: PaymentMethodService, private paymentEntryService: PaymentEntryService, public datePipe: DatePipe, public statusService: StatusService, public stockService: StockService, public partiesService: PartiesService, public currencyService: CurrencyService, public vatService: VatService) {
            super(route, router, invoiceService, datePipe, null, itemService, metricService, statusService, breadcrumbService, stockService,  partiesService, currencyService, vatService);

        this.dataService.name.subscribe({
            next: (data) => {
                this.master = data;
                if(this.master.discountType === 1) {
                    this.selectedDiscountType = this.discountTypeList[0];
                    this.selectedDiscountType.value = 1;
                }else if(this.master.discountType == 2) {
                    this.selectedDiscountType = this.discountTypeList[1];
                    this.selectedDiscountType.value = 2;
                }
                if(this.master.performa) {
                    this.hasRef = true;
                } 
                this.masters.push(this.master);
                this.getMinDate();
            }, 
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        }).unsubscribe();
    }

    ngOnInit(): void {
        if(this.master.id) {
            this.getAllByParent();
            this.getAllPaymentEntries(PaymentType.Receive, this.master.id);
            this.getAllPaymentMethods();
            this.getAllSafes();
            this.getAllBanks();
        }
        this.callInsideOnInit();
        this.getPaymentMinDate();
        this.getAllParties(1);
        this.getAllSaleAccounts();
        this.detailRouter = 'pages/saleInvoice';
    }

    getAllSaleAccounts(){
        this.saleCostService.getAll().subscribe({
            next: (saleAccounts) => {
                this.saleAccounts = saleAccounts;
            }
        });
    }

    initActionMenu() {
        this.menuItems = [
            {
                label: 'Draft', icon: 'pi pi-pencil', visible: (this.master.status.id==3), command: (event: any) => {
                    const newStatus: Status = {
                        id: 1, 
                        nameEn: 'Draft', 
                        nameAr: 'مقتوح'
                    }
                    this.confirmStatus = newStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Confirm', icon: 'pi pi-check', visible: (this.master.status.id!=2), command: (event: any) => {

                    const confirmStatus: Status = {
                        id: 2, 
                        nameEn: 'Confirmed', 
                        nameAr: 'مؤكد'
                    }
                    this.confirmStatus = confirmStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Cancel', icon: 'pi pi-times', visible: (this.master.status.id!=2), command: (event: any) => {
                    const cancelStatus: Status = {
                        id: 3, 
                        nameEn: 'Canceled', 
                        nameAr: 'ملغي'
                    }
                    this.confirmStatus = cancelStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Cancel Confirm', icon: 'pi pi-times-circle', visible: (this.master.status.id!=2), command: (event: any) => {
                    const cancelConfirmStatus: Status = {
                        id: 4, 
                        nameEn: 'Cancel Confirmed', 
                        nameAr: 'ملغي مؤكد'
                    }
                    this.confirmStatus = cancelConfirmStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Issue Stock', icon: 'pi pi-check-square', visible: (this.master.status.id==2), command: (event: any) => {
                    this.stockOrder = {};
                    this.stockOrderDetails = [];
                    this.stockOrderSubmitted = false;
                    var currentDate = new Date();
                    this.stockOrder.orderDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
                    this.stockOrderDialog = true;
                }
            },
            {
                label: 'Sales Return', icon: 'pi pi-replay', visible: (this.master.status.id==2 && this.master.deliveryStatus > 0), command: (event: any) => {
                    this.saleRevert = {};
                    this.saleRevertDetails = [];
                    this.saleRevertSubmitted = false;
                    var currentDate = new Date();
                    this.saleRevert.orderDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
                    this.saleRevertDialog = true;
                }
            },
            {
                label: 'Clone', icon: 'pi pi-clone', command: (event: any) => {
                    this.confirmType = 'cloneConfirm';
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Delete', icon: 'pi pi-trash', visible: (this.master.status.id!=2), command: (event: any) => {
                    const deleteStatus: Status = {
                        id: 6, 
                        nameEn: 'Deleted', 
                        nameAr: 'محذوف'
                    }
                    this.confirmStatus = deleteStatus;
                    this.confirmActionDialog = true;
                }
            }
            
        ];
    }

    private setLookupNames() {
        this.master.customerName = this.parties.find(p => p.id == this.master.customer).partyName;
        this.master.cuCode = this.currencies.find(c => c.id == this.master.cu).currencyCode;
        this.master.saleCostName = this.saleAccounts.find(s => s.id == this.master.saleCost).name;
    }


    showRef(performa: InvSalePerforma) {
        performa.refernceMode = true;
        performa.customerName = this.master.customerName;
        performa.cuCode = this.master.cuCode;
        performa.saleCostName = this.master.saleCostName;
        this.dataService.changeObject(performa);
        this.ref = this.dialogService.open(PerformaDetailsComponent, {
          header: 'Quotation Information',
          width: '70%',
          contentStyle: { "max-height": "500px", "overflow": "auto" },
          baseZIndex: 10000,
        });
      }


    getAllByParent() {
        this.invoiceDetailsService.getByParent(this.master.id).subscribe({
            next: (invoiceDetails) => {
                this.details = invoiceDetails;
                this.loading = false;
                this.updateTotals();
                this.cols = [
                    { field: 'id', header: 'ID' },
                    { field: 'item.itemName', header: 'Item Name' },
                    { field: 'qty', header: 'Quantity'},
                    { field: 'metric.metricName', header: 'Metric' }
                ];
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        });
    }

    getAllPaymentEntries(type: PaymentType, refId: number) {
        this.paymentEntryService.getAllForRefIdAndType(type, refId).subscribe({
            next: (paymentEntries) => {
                // currencies.forEach(currency => this.currencyService.savecurrency(currency).subscribe());
                this.paymentEntries = paymentEntries;
                this.loading = false;

                this.cols = [
                    { field: 'id', header: 'ID' },
                    { field: 'gaidNo', header: 'Item No' },
                    { field: 'gaidDate', header: 'Item Date'},
                    { field: 'paymentType.name', header: 'Payment Type' },
                    { field: 'party.partyName', header: 'Party Name' },
                    { field: 'paymentMethod.name', header: 'Payment Method' },
                    { field: 'famount', header: 'Total Amout' },
                    { field: 'amount', header: 'Amout' },
                    { field: 'cu.currencyName', header: 'Currency' },
                    { field: 'cuRate', header: 'Currency Rate' },
                    { field: 'ref1', header: 'Reference' },
                    { field: 'receiptNo', header: 'Receipt No' },
                    { field: 'receiptDate', header: 'Receipt Date' },
                    { field: 'agentName', header: 'Agent Name' },
                    { field: 'accNo', header: 'Account No' },
                    { field: 'handOn', header: 'Hand On' }
                ];
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            // @ts-ignore
            // this.accents.forEach(accent => accent.date = new Date(customer.date));
        });
    }

    getAllPaymentMethods(){
        this.paymentMethodService.getAll().subscribe({
            next: (paymentMethods) => {
                this.paymentMethods = paymentMethods;
            }
        });
    }

    getAllSafes(){
        this.safeService.getAll().subscribe({
            next: (safes) => {
                this.safes = safes;
            }
        });
    }

    getAllBanks(){
        this.bankService.getAll().subscribe({
            next: (banks) => {
                this.banks = banks;
            }
        });
    }

    getPaymentMinDate(){
        var dtToday = new Date(this.master.orderDate);
        var month:any = dtToday.getMonth() + 1;
        var day:any = dtToday.getDate();
        var year = dtToday.getFullYear();
        if(month < 10)
            month = '0' + month.toString();
        if(day < 10)
            day = '0' + day.toString();
        this.paymentMinDate = year + '-' + month + '-' + day;
    }


    editParentAction() {
        this.originalMaster = { ...this.master};
        this.selectedParty = this.parties.find(p => (p.id == this.master.customer));
        this.selectedCurrency = this.currencies.find(c => (c.id == this.master.cu));
        this.selectedSaleAccount = this.saleAccounts.find(s => (s.id == this.master.saleCost));
        this.masterDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteMultipleDialog = false;
        this.details = this.details.filter(val => !this.details.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invoice Detail Deleted', life: 3000 });
        this.selectedEntries = null;
    }  
    
    save() {
        if (this.detail.qty && this.detail.unitPrice && this.detail.unitPrice > 0) {
            if(this.master.id) {
                this.saveDetailWhenExistingMaster();
                this.selectedItem = null;
                this.selectedMetric = null;    
                this.detailDialog = false;  
                this.detail = {};
                this.submitted = false;
            }else{
                super.save();
            }
        }
    }

    saveAll() {
        this.parentSubmitted = true;
        if(this.master.cuRate && this.master.orderDate && this.master.famount >= 0 && this.master.discount >= 0 && this.master.vat >= 0){
            if(this.selectedParty) {
                this.master.customer = this.selectedParty.id;
            }
            if(this.selectedCurrency) {
                this.master.cu = this.selectedCurrency.id;
            }
            if(this.selectedDiscountType) {
                this.master.discountType = this.selectedDiscountType.value;
            }
            if(this.selectedSaleAccount)  {
                this.master.saleCost = this.selectedSaleAccount.id;
            }
            if(this.master.id) {
                this.updateParent();
            }else{
                const masterDetailsDto: MasterDetailsDto<InvSaleInvoice, InvSaleInvoiceDetails> = {
                    master: this.master,
                    details: this.details
                }
                this.invoiceDetailsService.saveAll(masterDetailsDto).subscribe(
                    {
                        next: (data) => {
                            if(this.master.id) {
                                this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
                                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invoice Updated', life: 3000 });
                            }else{
                                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invoice Created', life: 3000 });
                            }
                            this.editable = false;
                            this.details = data;
                            this.setLookupNames();
                        },
                        error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
                    }
                );
            }
            this.masterDialog = false;
            this.parentSubmitted = false;
            if(this.vatDialog == true) {
                this.vatDialog = false;
            }
        }     
    }

    updateParent() {
        this.invoiceService.update(this.master).subscribe(
            {
                next: (data) => {
                    this.master = data;
                    this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invoice Updated', life: 3000 });
                    this.masterDialog = false;
                    this.updateTotals();
                    this.setLookupNames();
                    if(this.discountDialog == true) {
                        this.discountDialog = false;
                    }
                    if(this.vatDialog == true) {
                        this.vatDialog = false;
                    }
                    },
                        error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
                    }
                );
    }  

    private saveDetailWhenExistingMaster() {
        this.submitted = true;
        this.detail.total = this.detail.qty * this.detail.unitPrice;
        this.detail.item = this.selectedItem;
        this.detail.metric = this.selectedMetric;
        if (this.detail.id > 0) {
            this.invoiceDetailsService.update(this.detail).subscribe(
                {
                    next: (data) => {
                        this.detail = data;
                        this.details[this.findIndexById(this.detail.id, this.details)] = this.detail;
                        this.updateTotals();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
                    },
                    error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
                }
            );
        } else {
            this.detail.parent = this.master;
            this.detail.id = this.index;
            this.invoiceDetailsService.add(this.detail).subscribe(
                {
                    next: (data) => {
                        this.detail = data;
                        this.details.push(this.detail);
                        this.updateTotals();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Created', life: 3000 });
                    },
                    error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
                }
            );
        }
    }

    confirmDelete() {
        if(this.master.id) {
            this.deleteWhenMasterExisting();
        }else{
            super.confirmDelete();
        }
    }


    private deleteWhenMasterExisting() {
        this.deleteSingleDialog = false;
        this.invoiceDetailsService.delete(this.detail.id).subscribe(
            {
                next: (data) => {
                    if (data.statusCode === 200) {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
                        this.details = this.details.filter(val => val.id !== this.detail.id);
                        this.updateTotals();
                        this.detail = {};
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            });
        this.tempOrderTotal = 0;
    }

    addPayment() {
        this.paymentEntry = {};
        this.paymentSubmitted = false;
        var currentDate = new Date();
        this.paymentEntry.orderDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        this.paymentEntry.receiptDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        this.selectedPaymentMethod = this.paymentMethods[0];
        this.paymentEntryDialog = true;
    }

    savePayment() {
        this.paymentSubmitted = true;
        if (this.paymentEntry.famount && this.paymentEntry.orderDate && this.paymentEntry.handOn) {
            if(this.selectedPaymentMethod.id == 1) {
                this.paymentEntry.accNo = this.selectedSafe.accNo;
            }
            if(this.selectedPaymentMethod.id > 1) {
                this.paymentEntry.accNo = this.selectedBank.accNo;
            }
            this.paymentEntry.paymentType = PaymentType.Receive;
            if (this.paymentEntry.id) {
                // @ts-ignore
                this.paymentEntry.cu = this.selectedCurrency;
                if(this.selectedParty) {
                    this.paymentEntry.party = this.selectedParty;
                }else{
                    this.paymentEntry.party = this.parties.find(p => p.id == this.master.customer);
                }
                this.paymentEntry.paymentMethod = this.selectedPaymentMethod;
                this.paymentEntryService.update(this.paymentEntry).subscribe(
                    {
                        next: (data) => {
                            this.paymentEntry = data;
                            this.paymentEntries[this.findIndexById(this.paymentEntry.id, this.paymentEntries)] = this.paymentEntry;
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Entry Updated', life: 3000 });
                        },
                        error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
                    }
                );
            } else {
                this.paymentEntry.cu = this.selectedCurrency;
                if(this.selectedParty) {
                    this.paymentEntry.party = this.selectedParty;
                }else{
                    this.paymentEntry.party = this.parties.find(p => p.id == this.master.customer);
                }
                this.paymentEntry.paymentMethod = this.selectedPaymentMethod;
                this.paymentEntry.refId = this.master.id;
                this.paymentEntryService.add(this.paymentEntry).subscribe(
                    {
                        next: (data) => {
                            this.paymentEntry = data;
                            this.paymentEntries.push(this.paymentEntry);
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Entry Created', life: 3000 });
                        },
                        error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
                    }
                );
            }

            this.paymentEntries = [...this.paymentEntries];
            this.paymentEntryDialog = false;
            this.paymentEntry = {};
        }
    }

    calculatePaymentEntryAmount(famount: number) {
        if(this.paymentEntry.cuRate > 0) {
            this.paymentEntry.amount = famount * this.paymentEntry.cuRate;
            this.paymentEntry.netAmount = this.paymentEntry.amount;
        }
    }

    onPaymentEntrySelectCurrency(currency: Currency) {
        this.paymentEntry.cuRate = currency.cuRate;
        this.calculatePaymentEntryAmount(this.paymentEntry.famount);
    }


    editPayment(paymentEntry: PaymentEntry) {
        this.paymentEntry = { ...paymentEntry};
        this.selectedPaymentMethod = this.paymentEntry.paymentMethod;
        if(this.paymentEntry.paymentMethod.id == 1) {
            this.selectedSafe = this.safes.find(safe => safe.accNo == this.paymentEntry.accNo);
        }else{
            this.selectedBank = this.banks.find(bank => bank.accNo == this.paymentEntry.accNo);
        }
        this.paymentEntryDialog = true;
    }

    deletePayment(paymentEntry: PaymentEntry) {
        this.deleteSinglePaymentDialog = true;
        this.paymentEntry = { ...paymentEntry };
    }

    confirmPaymentDelete() {
        this.deleteSinglePaymentDialog = false;
        this.paymentEntryService.delete(this.paymentEntry.id).subscribe(
            {
                next: (data) => {
                    if (data.statusCode === 200) {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Entry Deleted', life: 3000 });
                        this.paymentEntries = this.paymentEntries.filter(val => val.id !== this.paymentEntry.id);
                        this.paymentEntry = {};
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            });
    }

    hidePaymentDialog() {
        this.paymentEntryDialog = false;
        this.paymentSubmitted = false;
    }

    issueStock() {
        this.stockOrderSubmitted = true;
        if(this.selectedStock && this.stockOrder.receiptName && this.stockOrder.orderDate) {
            this.stockOrder.id = null;
            this.stockOrder.stock = this.selectedStock.id;
            this.stockOrder.customer = this.master.customer;
            this.stockOrder.orderId = Math.floor(Math.random() * 1000).toString();
            this.stockOrder.status = {
                id: 1,
                nameEn: 'Draft',
                nameAr: 'مقتوح'
            };
            this.stockOrder.insertUser = this.master.insertUser;
            this.stockOrder.insertDate = new Date();
            this.stockOrder.saleInvoice = this.master;
            this.stockOrderDetails = this.details;
            this.stockOrderDetails.map(detail => detail.id = -Math.floor(Math.random() * 1000));
            this.saveStockOrder(this.stockOrder, this.stockOrderDetails);
            this.stockOrder = {};
            this.stockOrderDetails = [];
            this.stockOrderSubmitted = false;
            this.stockOrderDialog = false;
        }
    }

    saveStockOrder(stockOrder: InvStockOrder, stockOrderDetails: InvStockOrderDetails[]) {
        const masterDetailsDto: MasterDetailsDto<InvStockOrder, InvStockOrderDetails> = {
            master: stockOrder,
            details: stockOrderDetails
        }
        this.stockOrderDetailsService.saveAll(masterDetailsDto).subscribe(
            {
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Delivery Order Created', life: 3000 });
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            }
        );
    }


    cancelStockOrder() {
        this.stockOrder = {};
        this.stockOrderDetails = [];
        this.stockOrderSubmitted = false;
        this.stockOrderDialog = false;

    }

    issueSaleRevert() {
        this.saleRevertSubmitted = true;
        if(this.selectedStock && this.saleRevert.orderDate) {
            this.saleRevert.id = null;
            this.saleRevert.stock = this.selectedStock.id;
            this.saleRevert.customer = this.master.customer;
            this.saleRevert.cu = this.master.cu;
            this.saleRevert.cuRate = this.master.cuRate;
            this.saleRevert.famount = this.master.famount;
            this.saleRevert.vat = this.master.vat;
            this.saleRevert.orderId = Math.floor(Math.random() * 1000).toString();
            this.saleRevert.status = {
                id: 1,
                nameEn: 'Draft',
                nameAr: 'مقتوح'
            };
            this.saleRevert.insertUser = this.master.insertUser;
            this.saleRevert.insertDate = new Date();
            this.saleRevert.saleInvoice = this.master;
            this.saleRevertDetails = this.details;
            this.saleRevertDetails.map(detail => detail.id = -Math.floor(Math.random() * 1000));
            this.saveSaleRevert(this.saleRevert, this.saleRevertDetails);
            this.saleRevert = {};
            this.saleRevertDetails = [];
            this.saleRevertSubmitted = false;
            this.saleRevertDialog = false;
        }
    }

    saveSaleRevert(saleRevert: InvSaleRevert, saleRevertDetails: InvSaleRevertDetails[]) {
        const masterDetailsDto: MasterDetailsDto<InvSaleRevert, InvSaleRevertDetails> = {
            master: saleRevert,
            details: saleRevertDetails
        }
        this.saleRevertDetailsService.saveAll(masterDetailsDto).subscribe(
            {
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Sales Return Created', life: 3000 });
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
            }
        );
    }


    cancelSaleRevert() {
        this.saleRevert = {};
        this.saleRevertDetails = [];
        this.saleRevertSubmitted = false;
        this.saleRevertDialog = false;

    }

    confirm(event) {
        if(this.confirmType === 'confirm'){
            let statusCode = this.confirmStatus.id;
            this.changeStatusService.changeStatus(this.master.id, this.confirmStatus).subscribe({
                next: (data) => {
                    this.updateCurrentObject(data);
                    if(statusCode == 6) {
                        setTimeout(() => {this.goMaster();}, 1500);
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
            this.confirmActionDialog = false;
        }else if(this.confirmType === 'cloneConfirm'){
            this.cloneObject();
        }
    }


    canDeactivate(): Observable<any> | boolean {
        if (this.editable === true) {
            return new Observable((observer: Observer<any>) => {
                this.confirmService.confirm({
                    message:
                        'You have unsaved changes. Do you want to save and leave this page? ',
                    header: 'Confirmation',
                    key: "cfmdialog",
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: "Save",
                    rejectLabel: "Don't Save",
                    accept: () => {
                        this.saveAll();
                        setTimeout(() => {observer.next(true); observer.complete();}, 1200);
                    },
                    reject: () => {
                        observer.next(true);
                        observer.complete();
                    },
                });
            });
        } else {
            return of(true);
        }
    }

    onCurrencyRateChange(cuRate: number) {
        this.paymentEntry.cuRate = cuRate;
        this.calculatePaymentEntryAmount(this.paymentEntry.famount);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
    }
}

