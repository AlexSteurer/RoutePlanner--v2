import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ClientsProvider} from "../../providers/clients/clients";
import {AngularFireAuth} from "angularfire2/auth";
import firebase from 'firebase';

/**
 * Generated class for the TodoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-todo',
    templateUrl: 'todo.html',
})
export class TodoPage {

    @ViewChild('titleView') titleView;
    private title = '';
    @ViewChild('todoDateView') todoDateView;
    private todoDate = '';
    @ViewChild('descriptionView') descriptionView;
    private description = '';

    clientList: any;
    db = firebase.firestore();
    myDoc: any;
    private theDocId = '';


    constructor(public navCtrl: NavController, public navParams: NavParams,
                private afAuth: AngularFireAuth,
                private clientsProvider: ClientsProvider) {

        this.clientList = this.clientsProvider.getClients();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TodoPage');
        this.theDocId = this.navParams.get('theDocId');
        console.log('ionViewDidLoad TodoPage docId:', this.theDocId);
        this.clientList = this.clientsProvider.getClients();
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.db.collection(user.uid).get().then(snapshot => {
                    snapshot.docs.forEach(document => {
                        if (document.id === '2zrMlA6kryUSVj9a10Bs') {
                            console.log("the document: ", document.data());
                            this.title = document.data().todo.title;
                            this.todoDate = document.data().todo.date;
                            this.description = document.data().todo.descrition;
                        }
                    })
                })
                //this.myDoc = this.db.collection(user.uid).doc("2zrMlA6kryUSVj9a10Bs");
                //this.myDoc = this.db.collection(user.uid).get();
                //console.log("myDoc: ", this.myDoc["2zrMlA6kryUSVj9a10Bs"]);
            }
        });
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

    private clearUserInput() {

    }

    private saveUserInput() {

    }
}
