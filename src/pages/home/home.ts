import {StartPage} from './../start/start';
import {AngularFireAuth} from 'angularfire2/auth';
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {SuperTabs} from 'ionic2-super-tabs';
import firebase from 'firebase';
import {CustomAlertMessage} from "../../model/customAlertMessage";
import {LoginPage} from "../login/login";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    userId: any;
    db = firebase.firestore();
    public map: any;
    //what does google do?
    google: any;
    private customAlertMessage: CustomAlertMessage;

    pages = [
        {pageName: 'RoutingPage', title: 'EasyRoute - RoutePlanner', icon: 'contacts', id: 'routeTab'},
        {pageName: 'StartPage', title: 'Easyroute - Map', icon: 'map', id: 'mapTab'},
        {pageName: 'TasksPage', title: 'EasyRoute - Tasks', icon: 'create', id: 'taskTab'},
    ];

    //When user opens the app, Google Map should always be the entry point.
    selectedTab = 1;

    @ViewChild(SuperTabs) superTabs: SuperTabs;

    constructor(public navCtrl: NavController, private afAuth: AngularFireAuth,
                public geolocation: Geolocation, public navParams: NavParams,
                private alertController: AlertController) {

        this.customAlertMessage = new CustomAlertMessage(this.alertController);
    }

    ionViewDidLoad() {
    }

    //clear badge when user not on Google Maps
    onTabSelect(tab: any) {
        if (tab.index !== 1) {
            this.superTabs.clearBadge(this.pages[tab.index].id);
        }
        this.selectedTab = tab.index;
    }

    logout() {
        this.afAuth.auth.signOut()
            .then(() => this.navCtrl.setRoot(LoginPage))
            .catch(failure => console.log("Logout fail", failure.error)); /*this.customAlertMessage.errorAlert(failure.error))*/
    }
}


