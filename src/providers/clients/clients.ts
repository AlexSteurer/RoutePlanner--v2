import {StartPage} from './../../pages/start/start';
import {AngularFireAuth} from 'angularfire2/auth';
import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {identifierModuleUrl} from '@angular/compiler';
import {map} from 'rxjs/operators';

/*
  Generated class for the ClientsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClientsProvider {

    private clientCollection: AngularFirestoreCollection<any>;
    //private userDoc: AngularFirestoreDocument <any>;
    userId: String;
    clientList: Observable<any>;

    clientData = {
        title: null,
        address: null,
        location: null,
        id: null,
        info: null,
        timestamp: null,
        bool: false,
        docId: null,
        interval: null,
        todo: {
            title: '',
            date: '',
            descrition: ''
        }
    };

    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {

        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userId = user.uid;
            }
            this.clientCollection = this.afs.collection(user.uid);
            /* this.clientList = this.clientCollection.valueChanges(); */
            this.clientList = this.clientCollection
                .snapshotChanges()
                .pipe(map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                })))
        })
    }

    //what to add and where?
    add(client) {
        return this.clientCollection.add(client);
    }

    getClients() {
        return this.clientList;
    }

    getSpecificClient(clientId){
        //return this.clientList
    }

    //what to remove and where?
    removeClient(id) {

        this.afAuth.authState.subscribe(user => {
            if (user) this.userId = user.uid;
            console.log(this.afs.doc(user.uid + '/' + id));
            return this.afs.doc(user.uid + '/' + id).delete();
        })
    }

    //what to update and where?
    updateClient(client, id) {

        this.afAuth.authState.subscribe(user => {
            if (user) this.userId = user.uid;
            console.log(this.afs.doc(user.uid + '/' + client.id))
            return this.afs.doc(user.uid + '/' + client.id).update(
                {
                    docId: id
                }
            );
        })
    }

}
