import { InfoPage } from './../pages/info/info';
import {HomePage} from './../pages/home/home'
import { LoginPage } from './../pages/login/login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFirestoreModule} from 'angularfire2/firestore';

import { Geolocation } from '@ionic-native/geolocation';
import { ClientsProvider } from '../providers/clients/clients';
import { SuperTabsModule } from 'ionic2-super-tabs';



const environment = {
    apiKey: "AIzaSyB4gHXhzyZffzAYe9u0rbY5Ix31HY-IUxk",
    authDomain: "routingplanner-7db49.firebaseapp.com",
    databaseURL: "https://routingplanner-7db49.firebaseio.com",
    projectId: "routingplanner-7db49",
    storageBucket: "routingplanner-7db49.appspot.com",
    messagingSenderId: "936066364251"

};


@NgModule({
  declarations: [
    MyApp,
    InfoPage,
    
    
    
    
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment),
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InfoPage,
    
  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ClientsProvider
  ]
})
export class AppModule {}
