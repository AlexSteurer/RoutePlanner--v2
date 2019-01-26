import {ClientsProvider} from './../../providers/clients/clients';
import {AngularFireAuth} from 'angularfire2/auth';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {
    AlertController,
    Events,
    IonicPage,
    ModalController,
    NavController,
    NavParams,
    ToastController
} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import firebase from 'firebase';
import moment from 'moment';
import {CustomAlertMessage} from "../../model/customAlertMessage";
import {StyledMap} from "../../model/styledMap";
import {TodoPage} from "../todo/todo";
import {ModalinfoPage} from "../modalinfo/modalinfo";

//interface to Google Maps API
declare let google;


@IonicPage()
@Component({
    selector: 'start-home',
    templateUrl: 'start.html',
})
export class StartPage {

    public client = {
        title: '',
        location: null,
        address: null,
        placeId: null,
        extra_info: null,
        timestamp: undefined,
        docId: null,
        time_chosen: null,
        time_half: null,
        interval: null,
        todo: {
            title: '',
            date: '',
            description: '',
            showTodo: false
        }
    };

    userId: any;
    geocoder = new google.maps.Geocoder();
    db = firebase.firestore();

    @ViewChild('map') mapElement: ElementRef;
    public map: any;
    autocomplete: { input: string; };
    GoogleAutocomplete: any;
    autocompleteItems: any[];
    zone: any;
    markers: any[];
    todayDateObj: Date;
    private customAlertMsg: CustomAlertMessage;
    static theDocId = '';


    constructor(public navCtrl: NavController, private afAuth: AngularFireAuth,
                public geolocation: Geolocation, public navParams: NavParams,
                private alertCtrl: AlertController,
                public clientsProvider: ClientsProvider,
                private toastCtrl: ToastController,
                public events: Events, public modalCtrl: ModalController) {

        this.todayDateObj = new Date();
        this.navCtrl = navCtrl;
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
        this.geocoder = new google.maps.Geocoder;
        this.markers = [];
        this.customAlertMsg = new CustomAlertMessage(this.alertCtrl);
    }

    ionViewDidLoad() {
        this.loadMap();
    }

    //Saves the client as document in Cloud Firestore and refresh of the map.
    saveClient() {
        this.clientsProvider.add(this.client).then(res => {
            let toast = this.toastCtrl.create({
                message: 'Client added !',
                duration: 2000
            });
            toast.present();
            this.loadMap();
        })
    }

    checkInputForSearchField() {
        if (this.autocomplete.input === '') {
            this.autocompleteItems = [];
            return;
        }
        this.showUserPlacePrediction();
    }

    /**
     * Sets a marker on maps when user clicks on 'Add Client'.
     * @param item suggested address from search bar
     */
    selectSearchResult(item) {
        let icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        this.markers = [];
        this.autocompleteItems = [];
        this.geocoder
            .geocode({'placeId': item.place_id}, (results, status) => {
                if (status === 'OK' && results[0]) {
                    let address = this.setClientAttributes(results, item);
                    let marker = this.createMarkerOnGoogleMaps(results, item.description, icon);
                    this.saveClient();
                    let infoWindow = this.createClientInfoWindow(address, this.client.title);
                    this.addListenerOnGoogleMaps(infoWindow, marker, this.client.placeId, item.id);
                    this.markers.push(marker);
                    this.map.setCenter(results[0].geometry.location);
                    this.loadMap();
                }
            });
    }

    redirectToTasks() {
        this.navCtrl.push(TodoPage, {
            theDocId: StartPage.theDocId
        });
    }

    /**
     * Loads all markers (documents) from Cloud Firestore
     * @param placeId unique string to coordination
     */
    markerLoad(placeId) {
        let lat;
        let lng;
        let clientsProvider = this.clientsProvider;
        this.afAuth.authState.subscribe(user => {
                if (user) {
                    this.userId = user.uid;
                    this.db.collection(user.uid)
                        .where("placeId", "==", placeId)
                        .get()
                        .then(querySnapshot => {
                            querySnapshot
                                .forEach(doc => this.setClientData(doc, lat, lng, clientsProvider));
                        })
                        .catch(err => console.log("markerLoad error: " + err.error))
                }
            }
        );
        this.redirectToInfoModal();
    }

    //Here all markers on the maps gets created.
    createListMarkers() {
        let colorMapsMarker: string;
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userId = user.uid;
                this.db.collection(user.uid).get().then(docs => {
                    docs.forEach(coordinate => {
                        this.fillMarkerWithData(coordinate, colorMapsMarker);
                    })
                })
            }
        });
    }

    /**
     * All necessary data like title or address, placeID, position gets set
     * @param coordinate is the document from Cloud Firestore
     * @param colorMapsMarker color of the marker can only be blue, yellow or red
     */
    private fillMarkerWithData(coordinate, colorMapsMarker: string) {
        const time_chosen = coordinate.data().time_chosen;
        const time_half = coordinate.data().time_half;
        if (time_chosen == null && time_half == null) {
            colorMapsMarker = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        } else {
            colorMapsMarker = this.changeMarkerColor(time_chosen, time_half);
        }

        const title = coordinate.data().title;
        const address = coordinate.data().adress;
        const placeId = coordinate.data().placeId;
        const position = new google.maps.LatLng(coordinate.data().location._lat, coordinate.data().location._long);
        const marker = this.createMarkerOnGoogleMaps(position, title, colorMapsMarker);
        const infoWindow = this.createClientInfoWindow(address, title);
        this.addListenerOnGoogleMaps(infoWindow, marker, placeId, coordinate.id);
    }

    /**
     * After half of the set interval has passed the marker turns yellow.
     * After the complete interval has passed the marker turns red
     * @param time_chosen the complete interval given time (in minutes)
     * @param time_half half of the complete interval given time (in minutes)
     */
    changeMarkerColor(time_chosen, time_half) {

        let icon: string;
        const chosen = time_chosen;
        const half = time_half;
        const now = moment();

        if (now.isAfter(moment.unix(chosen.seconds))) {
            icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            return icon;
        }
        if (now.isAfter(moment.unix(half.seconds)) && now.isBefore(moment.unix(chosen.seconds))) {
            icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            return icon;

        } else {
            icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            return icon;
        }
    }


    /**
     * Sets a default blue marker on the map.
     * @param position contains the Lat & Long value of the coordinate
     * @param title of the position
     * @param marker by default it is a blue marker
     */
    private createMarkerOnGoogleMaps(position, title, marker) {

        return new google.maps.Marker({
            position,
            map: this.map,
            icon: marker,
            title: title,
            animation: google.maps.Animation.DROP,
        });
    }

    //Shows the Google Map plus all the set markers on it
    loadMap() {
        this.geolocation.getCurrentPosition().then(position => {
            let mapOptions = this.createMapOptions(position);
            let styledMapType = StyledMap.createStyledMap();
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.map.mapTypes.set('styled_map', styledMapType);
            this.map.setMapTypeId('styled_map');
            this.createListMarkers();
        }, err => this.customAlertMsg.errorAlert(err.error));
    }

    // When user types a place in the search field, Google's autocomplete shows suggestion.
    private showUserPlacePrediction() {
        this.GoogleAutocomplete
            .getPlacePredictions({
                input: this.autocomplete.input
            }, (predictions, status) => {
                this.autocompleteItems = [];
                if (predictions !== null) {
                    predictions.forEach(
                        prediction => this.autocompleteItems.push(prediction)
                    )
                }
            });
    }

    /**
     * Sets a click listener for the markers and shows the info window.
     * @param infoWindow shows the title, address of the marker
     * and contains two links for todos and modalinfos
     * @param marker contains Lat & Long from the place
     * @param placeId required id to identify place could look like this 'ChIJ_d7vP2UHbUcRElip0qAzmR4'
     * @param documentId every marker on the map is a document in Cloud Firestore
     */
    private addListenerOnGoogleMaps(infoWindow, marker, placeId, documentId) {
        google.maps.event
            .addListenerOnce(infoWindow, 'domready', () => {
                document.getElementById('myid')
                    .addEventListener('click', () => {
                        this.redirectToTasks();
                    });
                document.getElementById('modalid')
                    .addEventListener('click', () => {
                        this.markerLoad(placeId);
                    });
            });

        google.maps.event
            .addListener(marker, 'click', function () {
                infoWindow.open(this.map, this);
                StartPage.theDocId = documentId;
            });
    }

    /**
     * Shows the title, address of the marker and contains two links for todos and modalinfos
     * @param address is set if a building like FH Technikum was entered,
     * so address would be Höchstädtplatz Höchstädtpl. 6, 1200 Wien, otherwise address is empty
     * @param title can be the name of a building or street with number
     * @return google.maps.InfoWindow
     */
    private createClientInfoWindow(address, title) {
        return new google.maps.InfoWindow({
            content: '<div><strong>' + title + '</strong><br/>'
                + 'Address: ' + address + '<br/>'
                + '</div>' + '<a id="myid"><strong>Show Client Task </strong></a>'
                + '<hr/>' + '</div>' + '<a id="modalid"><strong>Show Client Info </strong></a>',
            maxWidth: 300
        });
    }

    /**
     * All the attributes for the client object get set.
     * Every client ist marker on the map.
     * @param results are Google's suggestions from the search input
     * @param item
     * @return address
     */
    private setClientAttributes(results, item) {

        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        this.client.location = new firebase.firestore.GeoPoint(lat, lng);
        this.client.title = item.description;
        this.client.timestamp = moment(this.todayDateObj).toDate();
        let address;
        let id;

        for (let i = 0; i < results.length; i++) {
            address = results[i].formatted_address;
            id = results[i].place_id;
        }

        this.client.address = address;
        this.client.placeId = id;
        return address;
    }

    private setClientData(doc, lat, lng, clientsProvider) {
        doc.data().location._lat = lat;
        doc.data().location._lng = lng;
        clientsProvider.clientData.info = doc.data().extra_info;
        clientsProvider.clientData.title = doc.data().title;
        clientsProvider.clientData.address = doc.data().address;
        clientsProvider.clientData.id = doc.data().placeId;
        clientsProvider.clientData.timestamp = doc.data().timestamp;
        clientsProvider.clientData.interval = doc.data().interval;
        clientsProvider.clientData.bool = true;
    }

    /**
     *
     * @param position
     * @return mapOptions
     */
    private createMapOptions(position) {

        let latLng = new google.maps
            .LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
            center: latLng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            clickableIcons: false,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        };
        return mapOptions
    }


    redirectToInfoModal() {

        //this.navCtrl.push(ModalinfoPage);
        let modal = this.modalCtrl.create(ModalinfoPage);
        modal.present()
            .then(val => console.log("ModalInfoWindow success"))
            .catch(err => console.log("ModalInfoWindow error: ", err.error));

    }
}
