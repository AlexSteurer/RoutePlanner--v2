import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ClientsProvider} from "../../providers/clients/clients";
import {AngularFireAuth} from "angularfire2/auth";
import firebase from 'firebase';
import {StartPage} from "../start/start";
import {CustomAlertMessage} from "../../model/customAlertMessage";
import {StorageKeys} from "../../key/storageKeys";

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
    private customAlertMessage: CustomAlertMessage;


    constructor(public navCtrl: NavController, public navParams: NavParams,
                private afAuth: AngularFireAuth,
                private clientsProvider: ClientsProvider,
                private alertController: AlertController) {

        this.clientList = this.clientsProvider.getClients();
        this.customAlertMessage = new CustomAlertMessage(this.alertController);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TodoPage');
        this.theDocId = this.navParams.get(StorageKeys.THE_DOCUMENT_ID);
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
            .catch(error => this.customAlertMessage.errorAlert(error.error));
        //redirect then to Google Maps
        this.navCtrl.setRoot(StartPage)
    }
}
