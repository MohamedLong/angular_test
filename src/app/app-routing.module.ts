import {Router, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AuthService } from './auth/services/auth.service';

const routes: Routes = [];

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', loadChildren: () => import('./xgarage/xgarage.module').then(m => m.XgarageModule)},
            { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
            {path: '**', redirectTo: ''},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
