
import { StartPage } from './../../pages/start/start';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { identifierModuleUrl } from '@angular/compiler';
import { map } from 'rxjs/operators';

/*
  Generated class for the ClientsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClientsProvider {

  private clientCollection: AngularFirestoreCollection <any>;
  //private userDoc: AngularFirestoreDocument <any>;
  userId: String;
  clientList: Observable<any>;
  
  
  clientdata = {
    title: null,
    address: null,
    location: null,
    id: null,
    info: null,
    timestamp: null,
    bool:false,
    docId: null,
    intervall: null,
  }


  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
      this.clientCollection = this.afs.collection(user.uid);
      /* this.clientList = this.clientCollection.valueChanges(); */
      this.clientList = this.clientCollection.snapshotChanges().pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};

        
      })))
    })
    
    
    
  }


 

  add(client){
    
    
    return this.clientCollection.add(client);
    
    
  }
  getCLients(){
   return this.clientList;
  }



  removeClient(id){
    
    this.afAuth.authState.subscribe(user =>{
      if(user) this.userId = user.uid
      console.log(this.afs.doc(user.uid+'/'+id));
      return this.afs.doc(user.uid+'/'+id).delete();
      
    })
    
  }

  updateClient(client,id){
    var uid: String;
    this.afAuth.authState.subscribe(user =>{
      if(user) this.userId = user.uid
      console.log(this.afs.doc(user.uid+'/'+client.id))
      return this.afs.doc(user.uid+'/'+client.id).update(
        {
        docId: id  }
        );
    })
  }

}
