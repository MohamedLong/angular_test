import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import { DialogService } from 'primeng/dynamicdialog';
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {BadgeModule} from 'primeng/badge';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipModule} from 'primeng/chip';
import {ChipsModule} from 'primeng/chips';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {FullCalendarModule} from '@fullcalendar/angular';
import {GalleriaModule} from 'primeng/galleria';
import {ImageModule} from 'primeng/image';
import {InplaceModule} from 'primeng/inplace';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {KnobModule} from 'primeng/knob';
import {LightboxModule} from 'primeng/lightbox';
import {ListboxModule} from 'primeng/listbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {PanelMenuModule} from 'primeng/panelmenu';
import {PasswordModule} from 'primeng/password';
import {PickListModule} from 'primeng/picklist';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ScrollTopModule} from 'primeng/scrolltop';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {SkeletonModule} from 'primeng/skeleton';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SliderModule} from 'primeng/slider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SplitterModule} from 'primeng/splitter';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TimelineModule} from 'primeng/timeline';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';
import {VirtualScrollerModule} from 'primeng/virtualscroller';

import {AppCodeModule} from './app.code.component';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppConfigComponent} from './app.config.component';
import {AppMenuComponent} from './app.menu.component';
import {AppMenuitemComponent} from './app.menuitem.component';
import {AppInlineMenuComponent} from './app.inlinemenu.component';
import {AppRightMenuComponent} from './app.rightmenu.component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {DashboardComponent} from './demo/view/dashboard.component';
import {DashboardAnalyticsComponent} from './demo/view/dashboardanalytics.component';
import {FormLayoutDemoComponent} from './demo/view/formlayoutdemo.component';
import {FloatLabelDemoComponent} from './demo/view/floatlabeldemo.component';
import {InvalidStateDemoComponent} from './demo/view/invalidstatedemo.component';
import {InputDemoComponent} from './demo/view/inputdemo.component';
import {ButtonDemoComponent} from './demo/view/buttondemo.component';
import {TableDemoComponent} from './demo/view/tabledemo.component';
import {ListDemoComponent} from './demo/view/listdemo.component';
import {TreeDemoComponent} from './demo/view/treedemo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MediaDemoComponent} from './demo/view/mediademo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';
import {DisplayComponent} from './utilities/display.component';
import {ElevationComponent} from './utilities/elevation.component';
import {FlexboxComponent} from './utilities/flexbox.component';
import {GridComponent} from './utilities/grid.component';
import {IconsComponent} from './utilities/icons.component';
import {WidgetsComponent} from './utilities/widgets.component';
import {SpacingComponent} from './utilities/spacing.component';
import {TypographyComponent} from './utilities/typography.component';
import {TextComponent} from './utilities/text.component';
import {AppCrudComponent} from './pages/app.crud.component';
import {AppCalendarComponent} from './pages/app.calendar.component';
import {AppInvoiceComponent} from './pages/app.invoice.component';
import {AppHelpComponent} from './pages/app.help.component';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
// import {AppLoginComponent} from './pages/app.login.component';
import { LoginComponent } from './auth/containers/login/login.component';
import { AuthModule } from './auth/auth.module';
import {AppTimelineDemoComponent} from './pages/app.timelinedemo.component';
import {AppWizardComponent} from './pages/app.wizard.component';
import {AppLandingComponent} from './pages/app.landing.component';

import {CountryService} from './demo/service/countryservice';
import {CustomerService} from './demo/service/customerservice';
import {EventService} from './demo/service/eventservice';
import {IconService} from './demo/service/iconservice';
import {NodeService} from './demo/service/nodeservice';
import {PhotoService} from './demo/service/photoservice';
import {ProductService} from './demo/service/productservice';
import { UserService } from '../app/xgarage/common/service/userservice';

import {MenuService} from './app.menu.service';
import {AppBreadcrumbService} from './app.breadcrumb.service';
import {AppContactusComponent} from './pages/app.contactus.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
import {CurrencyComponent} from './xgarage/common/component/currency/currency.component';
import { CurrencyService } from './xgarage/common/service/currencyservice';
import {MetricService} from './xgarage/common/service/metricservice';
import {MetricComponent} from './xgarage/common/component/metric/metric.component';
import { StatusService } from './xgarage/common/service/statusservice';
import { StatusComponent } from './xgarage/common/component/status/status.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DataService } from './xgarage/common/generic/dataservice';
import { AddRowDirective } from './add-row.directive';
import { UnsavedChangesGaurd } from './unsaved.guard';
import { UserSubMenuService } from './xgarage/dashboard/service/usersubmenuservice';
import { MainMenuService } from './xgarage/dashboard/service/mainmenuservice';
import { SubMenuService } from './xgarage/dashboard/service/submenuservice';
import { UserMainMenuService } from './xgarage/dashboard/service/usermainmenuservice';
import { TenantService } from './xgarage/common/service/tenantservice';
import { UsersComponent } from './xgarage/dashboard/component/users/users.component';
import { UserRolesComponent } from './xgarage/dashboard/component/user-roles/user-roles.component';
import { UserMainMenuComponent } from './xgarage/dashboard/component/user-main-menu/user-main-menu.component';
import { UserSubMenuComponent } from './xgarage/dashboard/component/user-sub-menu/user-sub-menu.component';
import { ChangepasswordComponent } from './xgarage/dashboard/component/changepassword/changepassword.component';
import { PermissionsComponent } from './xgarage/dashboard/component/persmissions/permissions.component';
import { RolesComponent } from './xgarage/dashboard/component/roles/roles.component';
import { RolePermissionsComponent } from './xgarage/dashboard/component/role-permissions/role-permissions.component';
import { PermissionService } from './xgarage/dashboard/service/permissionservice';
import { RoleService } from './xgarage/dashboard/service/roleservice';
import { RolePermissionService } from './xgarage/dashboard/service/rolepermissionservice';
import { TenantComponent } from './xgarage/common/component/tenant/tenantcomponent';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

// FullCalendarModule.registerPlugins([
//     // dayGridPlugin,
//     timeGridPlugin,
//     interactionPlugin
// ]);

@NgModule({
    imports: [
        AuthModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TagModule,
        TerminalModule,
        TimelineModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    // exports: [AppLoginComponent],
    declarations: [
        AddRowDirective,
        AppComponent,
        AppMainComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppInlineMenuComponent,
        AppRightMenuComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppFooterComponent,
        DashboardComponent,
        DashboardAnalyticsComponent,
        FormLayoutDemoComponent,
        FloatLabelDemoComponent,
        InvalidStateDemoComponent,
        InputDemoComponent,
        ButtonDemoComponent,
        TableDemoComponent,
        ListDemoComponent,
        TreeDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MediaDemoComponent,
        MenusDemoComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        DocumentationComponent,
        DisplayComponent,
        ElevationComponent,
        FlexboxComponent,
        GridComponent,
        IconsComponent,
        WidgetsComponent,
        SpacingComponent,
        TypographyComponent,
        TextComponent,
        AppCrudComponent,
        AppCalendarComponent,
        // AppLoginComponent,
        // LoginComponent,
        AppLandingComponent,
        AppInvoiceComponent,
        AppHelpComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        AppTimelineDemoComponent,
        AppWizardComponent,
        AppContactusComponent,
        CurrencyComponent,
        MetricComponent,
        StatusComponent,
        UsersComponent,
        UserRolesComponent,
        UserMainMenuComponent,
        UserSubMenuComponent,
        ChangepasswordComponent,
        PermissionsComponent,
        RolesComponent,
        RolePermissionsComponent,
        TenantComponent

    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},UnsavedChangesGaurd, UserService, TenantService,
        CountryService, CustomerService, EventService, UserService, IconService, NodeService, SubMenuService,
        PhotoService, ProductService, MenuService, AppBreadcrumbService, MetricService, StatusService, TenantService, CurrencyService,
        DialogService, UserSubMenuService, UserMainMenuService, MainMenuService, SubMenuService, PermissionService, RoleService, RolePermissionService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
