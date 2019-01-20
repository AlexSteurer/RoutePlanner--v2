import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import {ClientsProvider} from './../../providers/clients/clients';
import {ViewController} from 'ionic-angular/navigation/view-controller';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';

/**
 * Generated class for the ModalinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalinfo',
  templateUrl: 'modalinfo.html',
})
export class ModalinfoPage {

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
    console.log('ionViewDidLoad ModalinfoPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
