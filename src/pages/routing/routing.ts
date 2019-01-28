import {Observable} from 'rxjs';
import {InfoPage} from './../info/info';
import {AngularFireAuth} from 'angularfire2/auth';
import {ClientsProvider} from './../../providers/clients/clients';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {Events} from 'ionic-angular';
import firebase from 'firebase';
import 'rxjs/add/operator/filter'
import {LaunchNavigator, LaunchNavigatorOptions} from "@ionic-native/launch-navigator";


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
    start: string;
    destination: string;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private clientsProvider: ClientsProvider,
                private afAuth: AngularFireAuth, public events: Events,
                public modalCtrl: ModalController,
                public launchNavigator: LaunchNavigator) {

        this.clientList = this.clientsProvider.getClients();
        this.start = "";
        this.destination = "Westminster, London, UK";
    }

    ionViewDidLoad() {
        this.clientList = this.clientsProvider.getClients();
    }

    /**
     * Takes the clients id to search for the address from the corresponding document.
     * After then starts launchNavigator for navigation.
     * @param docId
     */
    navMe(docId) {
        let launchNav = this.launchNavigator;
        let options: LaunchNavigatorOptions = {start: this.start};
        let db = firebase.firestore();
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userId = user.uid;
            }
            db.collection(user.uid).doc(docId)
                .get()
                .then(function (doc) {
                    if (doc.exists) {
                        let destination = doc.data().address;
                        launchNav.navigate(destination, options)
                            .then(
                                success => alert('Launched navigator'),
                                error => alert('Error launching navigator: ' + error)
                            );
                    }
                })
        })
    }

    /**
     * Iterates for markers when user types letters in search field.
     * @param event enables to search for saved marker in Cloud Firestore
     */
    getItems(event: any) {
        this.clientsProvider.getClients();
        const val = event.target.value;

        this.clientsProvider.getClients().subscribe(client => {
            this.clientList = client;
            this.clientList = this.clientsProvider.getClients()
                .filter((function (client) {
                    if (val && val.trim() !== '') {
                        return client.title
                            .toLowerCase().indexOf(val.toLowerCase()) > -1;
                    }
                }))
        })
    }

    /**
     * Sets values for the attributes of a marker on the map.
     * @param docId specific document (marker on map) from a user collection
     */
    edit(docId) {
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
                        clientsProvider.clientData.title = doc.data().title;
                        clientsProvider.clientData.address = doc.data().address;
                        clientsProvider.clientData.id = doc.data().placeId;
                        clientsProvider.clientData.info = doc.data().extra_info;
                        clientsProvider.clientData.timestamp = doc.data().timestamp;
                        clientsProvider.clientData.docId = docId;
                        clientsProvider.clientData.interval = doc.data().interval;
                    }
                })
        });
        let modal = this.modalCtrl.create(InfoPage);
        modal.present();
    }

    delete(client) {
        this.clientsProvider.removeClient(client.id);
        this.events.publish('client:deleted', client);
    };
}
