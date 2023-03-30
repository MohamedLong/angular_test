import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {BrowserModule} from '@angular/platform-browser';
import { LoginComponent } from './auth/containers/login/login.component';
import { TokenInterceptor } from './auth/token.interceptor';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpClientModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [],
    providers: [ {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    },],
    bootstrap: [AppComponent]
})
export class AppModule {
}
