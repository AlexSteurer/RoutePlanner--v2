import {ClientsProvider} from './../../providers/clients/clients';
import {ViewController} from 'ionic-angular/navigation/view-controller';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import moment from 'moment';
import * as math from 'mathjs'


/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
    selector: 'page-info',
    templateUrl: 'info.html',
})
export class InfoPage {

    private clientCollection: AngularFirestoreCollection<any>;
    clientList: Observable<any[]>;
    userId: String;
    updateId = null;
    public infoText: String;
    public day_interval: number;
    public new_date: Date;
    public day_interval_half: Date;
    public currentDate: Date;

    clientData = {
        title: null,
        address: null,
        location: null,
        id: null,
        info: null,
        timestamp: null,
        bool: false,
        docId: String,
    };

    constructor(private afs: AngularFirestore, public navCtrl: NavController,
                public navParams: NavParams, public viewCtrl: ViewController,
                public clientsProvider: ClientsProvider,
                public modalController: ModalController,
                private afAuth: AngularFireAuth) {

        this.currentDate = new Date();
    }

    ionViewWillLoad() {

    }

    ionViewDidLoad() {

    }

    resetTimeStamp() {
        let inter = this.clientsProvider.clientdata.intervall;
        let half = math.round(this.clientsProvider.clientdata.intervall / 2);
        let new_full = moment(this.currentDate).add(inter, 'days').toDate();
        let new_half = moment(this.currentDate).add(half, 'days').toDate();

        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userId = user.uid
            }
            return this.afs
                .doc(user.uid + '/' + this.clientsProvider.clientdata.docId)
                .update({
                    time_chosen: new_full,
                    time_half: new_half,
                })
        })
    }

    timeConvert() {
        this.new_date = moment(this.currentDate)
            .add(this.day_interval, 'days')
            .toDate();

        let half_inter = math.round(this.day_interval / 2);

        this.day_interval_half = moment(this.currentDate)
            .add(half_inter, 'days')
            .toDate();
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

    updateInformation() {
        this.timeConvert();

        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userId = user.uid;
            }
            return this.afs
                .doc(user.uid + '/' + this.clientsProvider.clientdata.docId)
                .update({
                    extra_info: this.infoText,
                    time_chosen: this.new_date,
                    time_half: this.day_interval_half,
                    intervall: this.day_interval,
                })
        });

        this.closeModal();
    }
}
