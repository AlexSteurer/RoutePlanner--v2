import { Observable } from 'rxjs';
import { InfoPage } from './../info/info';
import { StartPage } from './../start/start';
import { AngularFireAuth } from 'angularfire2/auth';
import { ClientsProvider } from './../../providers/clients/clients';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import firebase from 'firebase';

import { FormControl } from '@angular/forms';
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
  clients :Observable<any>;
  clientList: any;
  
  
  private userId: String;

   
  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private clientsprovider: ClientsProvider, private afAuth: AngularFireAuth, public events: Events,public modalCtrl: ModalController) {
    this.clientList = this.clientsprovider.getCLients();

  
 
   
  }

  
  // Liste wird nicht geupdatet.. .warum auch immer....
  getItems(ev: any) {
      this.clientsprovider.getCLients();
    
      const val = ev.target.value;
      this.clientsprovider.getCLients().subscribe(client =>{
        this.clientList =client;
        console.log(client.title);
        this.clientList = this.clientsprovider.getCLients().filter((function(client) {
          if (val && val.trim() !== '') {
            return  client.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
          
          
        }
      }))
    })
    }
      
      
    
    

     
  
      
  
      // set val to the value of the searchbar
      
      //if the value is an empty string don't filter the items
     
    
    
  


  
  edit(docId){
    console.log(docId)
    var clientsProvider = this.clientsprovider
    var db = firebase.firestore();
    this.afAuth.authState.subscribe(user =>{
      if(user) this.userId =  user.uid
    
          
          db.collection(user.uid).doc(docId)
          .get()
          .then(function(doc) {
            if(doc.exists) {
            clientsProvider.clientdata.title = doc.data().title; 
            console.log(clientsProvider.clientdata.title);
            clientsProvider.clientdata.address = doc.data().adress;
            console.log(clientsProvider.clientdata.address);
            clientsProvider.clientdata.id = doc.data().placeId;
            console.log(clientsProvider.clientdata.id);
           clientsProvider.clientdata.info = doc.data().extra_info;
           console.log(clientsProvider.clientdata.info) 
           clientsProvider.clientdata.timestamp = doc.data().timestamp;
           clientsProvider.clientdata.docId = docId;
           clientsProvider.clientdata.intervall = doc.data().intervall;
           console.log(clientsProvider.clientdata.docId);
    
   
            }
          })
          })
          let modal = this.modalCtrl.create(InfoPage);
          modal.present();    
        };
  

  delete(client){
    this.clientsprovider.removeClient(client.id);
    console.log('Client deleted!')
    this.events.publish('client:deleted', client, );
  };

  ionViewDidLoad() {
    this.clientList = this.clientsprovider.getCLients()
    console.log(this.clientList);
    console.log('ionViewDidLoad RoutingPage');
  }

  

}
