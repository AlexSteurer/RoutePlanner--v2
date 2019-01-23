import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ClientsProvider} from "../../providers/clients/clients";
import {AngularFireAuth} from "angularfire2/auth";

/**
 * Generated class for the TasksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-tasks',
    templateUrl: 'tasks.html',
})
export class TasksPage {

    clientList: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private clientsProvider: ClientsProvider,
                private afAuth: AngularFireAuth, public events: Events) {

        this.clientList = this.clientsProvider.getClients();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TasksPage');
    }
}
