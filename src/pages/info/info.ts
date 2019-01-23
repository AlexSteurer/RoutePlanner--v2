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



    ionViewDidLoad() {

    }

    resetTimeStamp() {
        let inter = this.clientsProvider.clientData.interval;
        let half = math.round(this.clientsProvider.clientData.interval / 2);
        let new_full = moment(this.currentDate).add(inter, 'minutes').toDate();
        let new_half = moment(this.currentDate).add(half, 'minutes').toDate();

        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userId = user.uid
            }
            return this.afs
                .doc(user.uid + '/' + this.clientsProvider.clientData.docId)
                .update({
                    time_chosen: new_full,
                    time_half: new_half,
                })
        })
        //this.closeModal();
    }

    timeConvert() {
        this.new_date = moment(this.currentDate)
            .add(this.day_interval, 'minutes')
            .toDate();

        let half_inter = math.round(this.day_interval / 2);

        this.day_interval_half = moment(this.currentDate)
            .add(half_inter, 'minutes')
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
                .doc(user.uid + '/' + this.clientsProvider.clientData.docId)
                .update({
                    extra_info: this.infoText,
                    time_chosen: this.new_date,
                    time_half: this.day_interval_half,
                    interval: this.day_interval,
                })
        });

        this.closeModal();
    }
}
