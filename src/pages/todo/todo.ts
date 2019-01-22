import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ClientsProvider} from "../../providers/clients/clients";
import {AngularFireAuth} from "angularfire2/auth";
import firebase from 'firebase';
import {TasksPage} from "../tasks/tasks";
import {StartPage} from "../start/start";

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
    private theDocId = '';
    private userUID = '';

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
        //Fetching the clientTodo attribute from Firestore Document
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userUID = user.uid;
                this.db.collection(user.uid).get().then(snapshot => {
                    snapshot.docs.forEach(document => {
                        if (document.id === this.theDocId) {
                            this.title = document.data().todo.title;
                            this.todoDate = document.data().todo.date;
                            this.description = document.data().todo.description;
                        }
                    })
                });
            }
        });
    }

    private clearUserInput() {
        this.titleView.value = '';
        this.todoDateView.value = '';
        this.descriptionView.value = '';
    }

    private saveUserInput() {
        this.db.collection(this.userUID).doc(this.theDocId).update({
            todo: {
                title: this.titleView.value,
                date: this.todoDateView.value,
                description: this.descriptionView.value
            }
        }).then(() => console.log('todo success!!'))
            .catch(error => console.log('error todo: ', error.err));
        //redirect then to Google Maps
        this.navCtrl.setRoot(StartPage)
    }
}
