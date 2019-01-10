import {StartPage} from './../start/start';
import {AngularFireAuth} from 'angularfire2/auth';
import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {SuperTabs} from 'ionic2-super-tabs';
import firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    userId: any;
    db = firebase.firestore();
    public map: any;
    google: any;

    pages = [
        {pageName: 'RoutingPage', title: 'EasyRoute - RoutePlanner', icon: 'contacts', id: 'routeTab'},
        {pageName: 'StartPage', title: 'Easyroute - Map', icon: 'map', id: 'mapTab'},
        {pageName: 'TasksPage', title: 'EasyRoute - Tasks', icon: 'create', id: 'taskTab'},
    ];

    selectedTab = 1;

    @ViewChild(SuperTabs) superTabs: SuperTabs;

    constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, public geolocation: Geolocation
        , public navParams: NavParams, private alertCtrl: AlertController,) {

    }

    ionViewDidLoad() {


    }

    onTabSelect(ev: any) {
        if (ev.index === 1) {
            () => {
                this.selectedTab = ev.index;
            }
            /* let alert = this.alertCtrl.create({
              title: 'Secret Page',
              message: 'Are you sure you want to access that page?',
              buttons: [
                {
                  text: 'No',
                  handler: () => {
                    this.superTabs.slideTo(this.selectedTab);
                  }
                }, {
                  text: 'Yes',

                  }
                }
              ]
            });
            alert.present(); */
        } else {
            this.selectedTab = ev.index;
            this.superTabs.clearBadge(this.pages[ev.index].id);
        }
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}


