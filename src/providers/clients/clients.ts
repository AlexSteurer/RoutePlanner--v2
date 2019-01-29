import {AngularFireAuth} from 'angularfire2/auth';
import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/*
  Generated class for the ClientsProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClientsProvider {

    private clientCollection: AngularFirestoreCollection<any>;
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
            description: '',
            showTodo: false
        }
    };

    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {

        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userId = user.uid;
            }
            this.clientCollection = this.afs.collection(user.uid);
            this.clientList = this.clientCollection
                .snapshotChanges()
                .pipe(map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                })))
        })
    }

    add(client) {
        return this.clientCollection.add(client);
    }

    getClients() {
        return this.clientList;
    }

    removeClient(id) {
        this.afAuth.authState.subscribe(user => {
            if (user) this.userId = user.uid;
            return this.afs.doc(user.uid + '/' + id).delete();
        })
    }

    updateClient(client, id) {
        this.afAuth.authState.subscribe(user => {
            if (user) this.userId = user.uid;
            return this.afs
                .doc(user.uid + '/' + client.id)
                .update({docId: id});
        })
    }
}
