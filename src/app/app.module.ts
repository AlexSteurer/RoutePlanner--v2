import {InfoPage} from './../pages/info/info';
import {HomePage} from './../pages/home/home'
import {LoginPage} from './../pages/login/login';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule, ModalController} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from './app.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {Geolocation} from '@ionic-native/geolocation';
import {ClientsProvider} from '../providers/clients/clients';
import {SuperTabsModule} from 'ionic2-super-tabs';
import {FIREBASE_CONFIG} from "./app.firebase.config";
import {TodoPage} from "../pages/todo/todo";
import {ModalinfoPage} from "../pages/modalinfo/modalinfo";


@NgModule({
    declarations: [
        MyApp,
        InfoPage,
        TodoPage,
        ModalinfoPage,
    ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        IonicModule.forRoot(MyApp),
        SuperTabsModule.forRoot(),
        AngularFirestoreModule,
        AngularFireAuthModule,



    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        InfoPage,
        TodoPage,
        ModalinfoPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ClientsProvider,

    ]
})
export class AppModule {
}
