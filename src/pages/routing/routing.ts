import {Observable} from 'rxjs';
import {InfoPage} from './../info/info';
import {StartPage} from './../start/start';
import {AngularFireAuth} from 'angularfire2/auth';
import {ClientsProvider} from './../../providers/clients/clients';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {Events} from 'ionic-angular';
import firebase from 'firebase';

import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/filter'


/**
 * Generated class for the RoutingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-routing',
    templateUrl: 'routing.html',
})
export class RoutingPage {

    searchQuery: string = '';
    clients: Observable<any>;
    clientList: any;
    private userId: String;


    constructor(public navCtrl: NavController, public navParams: NavParams,
                private clientsProvider: ClientsProvider,
                private afAuth: AngularFireAuth, public events: Events,
                public modalCtrl: ModalController) {

        this.clientList = this.clientsProvider.getClients();
    }

    ionViewDidLoad() {
        this.clientList = this.clientsProvider.getClients();
        console.log(this.clientList);
        console.log('ionViewDidLoad RoutingPage');
    }

    // Liste wird nicht geupdatet.. .warum auch immer....
    getItems(event: any) {
        this.clientsProvider.getClients();
        const val = event.target.value;

        this.clientsProvider.getClients().subscribe(client => {
            this.clientList = client;
            console.log(client.title);
            this.clientList = this.clientsProvider.getClients()
                .filter((function (client) {
                    if (val && val.trim() !== '') {
                        return client.title
                            .toLowerCase().indexOf(val.toLowerCase()) > -1;
                    }
                }))
        })
    }

    // set val to the value of the search bar

    //if the value is an empty string don't filter the items

    edit(docId) {
        console.log(docId);
        let clientsProvider = this.clientsProvider;
        let db = firebase.firestore();
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userId = user.uid;
            }
            db.collection(user.uid).doc(docId)
                .get()
                .then(function (doc) {
                    if (doc.exists) {
                        this.setClientDataAttributes(clientsProvider, doc, docId);
                    }
                })
        });
        let modal = this.modalCtrl.create(InfoPage);
        modal.present();
    }

    private setClientDataAttributes(clientsProvider, doc, docId) {
        clientsProvider.clientData.title = doc.data().title;
        console.log(clientsProvider.clientData.title);
        clientsProvider.clientData.address = doc.data().address;
        console.log(clientsProvider.clientData.address);
        clientsProvider.clientData.id = doc.data().placeId;
        console.log(clientsProvider.clientData.id);
        clientsProvider.clientData.info = doc.data().extra_info;
        console.log(clientsProvider.clientData.info);
        clientsProvider.clientData.timestamp = doc.data().timestamp;
        clientsProvider.clientData.docId = docId;
        clientsProvider.clientData.interval = doc.data().interval;
        console.log(clientsProvider.clientData.docId);
    }

    delete(client) {
        this.clientsProvider.removeClient(client.id);
        console.log('Client deleted!');
        this.events.publish('client:deleted', client);
    };
}
