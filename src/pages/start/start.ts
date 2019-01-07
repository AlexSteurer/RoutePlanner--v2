import { ClientsProvider } from './../../providers/clients/clients';
import { InfoPage } from './../info/info';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Events, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';
import *as geofirex from 'geofirex';
import { GeoPoint, FieldPath } from '@firebase/firestore-types';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import moment from 'moment';



declare var google;
let infowindow: any;
let service: any;




@IonicPage()
@Component({
  selector: 'start-home',
  templateUrl: 'start.html',
})
export class StartPage {

  

  

 public client = {
    title: '',
    location:  null,
    adress: null,
    placeId: null,
    extra_info: null,
    timestamp:  null,
    docId: null,
    time_chosen: 1515283200,
    time_half: null,
    intervall: null,
  };


 
  userId : any;
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

  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth,
     public geolocation: Geolocation, public navParams: NavParams, private alertCtrl: AlertController,
     public clientsProvider: ClientsProvider,private toastCtrl: ToastController, public events: Events,public modalCtrl: ModalController) {

      this.todayDateObj = new Date();  
      
      this.navCtrl = navCtrl;
      events.subscribe('client:deleted', (client) => {
        this.loadMap(); 
        console.log('Welcome Markers' );
        
      });
     
    
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
    

    
  }

  saveClient(){
    this.clientsProvider.add(this.client).then(res=> {
      let toast = this.toastCtrl.create({
        message: 'Client added !',
        duration: 2000
      });
      toast.present();
    })
  };
  
 
  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      if(predictions != null){
      predictions.forEach((prediction) => {
      this.autocompleteItems.push(prediction);
        })};
      
      
      
    });
  }

  


  
  selectSearchResult(item){
  
    this.markers = [];
    var lat = 0;
    var lng = 0;

    this.autocompleteItems = [];

  
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng(); 
        
        this.client.location = new firebase.firestore.GeoPoint(lat,lng);
        this.client.title = item.description;
        this.client.timestamp = moment(this.todayDateObj).toDate();
        for(var i=0; i<results.length;i++){
          var adress = results[i].formatted_address;
          var id = results[i].place_id;
          
        }
        
        this.client.adress = adress;
        this.client.placeId = id;
        /* console.log(this.client.title);
        console.log(this.client.adress); */
        console.log(this.client);
        this.saveClient();
        var image = { 
          //url: item.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        
    
        
        var marker = new google.maps.Marker({
         
          map: this.map,
          position: results[0].geometry.location,
          animation: google.maps.Animation.DROP,
          title: item.description, 
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
      
        var infowindow = new google.maps.InfoWindow({
          content : '<div><strong>' +this.client.title+ '</strong><br>' +
          'Adress: ' + adress + '<br>' + '</div>'+'<button id="myid"><strong>Show Client Info !</strong></button>',
          maxWidth: 300
          });
          google.maps.event.addListenerOnce(infowindow, 'domready', () => {
          document.getElementById('myid').addEventListener('click', () => {
            this.markerLoad(this.client.placeId);
     
          });
          });

         google.maps.event.addListener(marker,'click',function(){
          
          
          infowindow.open(this.map, this);
         })
      
        
        this.markers.push(marker); 
        this.map.setCenter(results[0].geometry.location);
      }
    })
  };

  pushButton(){
    
    
    var modalCtrl = this.modalCtrl;
    let modal = modalCtrl.create(InfoPage);
   
     
      modal.present();
      this.loadMap();
   
        };


markerLoad(placeId){
  var lat;
  var lng;
  var clientsProvider = this.clientsProvider;
  

  this.afAuth.authState.subscribe(user =>{
    if(user) this.userId =  user.uid
  
        
        this.db.collection(user.uid).where("placeId","==",placeId)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.data().location._lat = lat;
            doc.data().location._lng = lng;
            clientsProvider.clientdata.info = doc.data().extra_info; 
            //location = new firebase.firestore.GeoPoint(lat,lng);
            clientsProvider.clientdata.title = doc.data().title; 
            console.log(clientsProvider.clientdata.title);
            clientsProvider.clientdata.address = doc.data().adress;
            console.log(clientsProvider.clientdata.address);
            clientsProvider.clientdata.id = doc.data().placeId;
            console.log(clientsProvider.clientdata.id);
           clientsProvider.clientdata.timestamp = doc.data().timestamp; 
           clientsProvider.clientdata.bool = true;
           
          })
          
        
            
        })

}
      
  )
 this.pushButton();
  
}



  /*createListMarkers(){
   
    this.afAuth.authState.subscribe(user =>{
      if(user) this.userId =  user.uid
    
          
          this.db.collection(user.uid).get().then(docs => {
            docs.forEach((coord) => {
            const title = coord.data().title;
            const adress = coord.data().adress;
            const placeId = coord.data().placeId;
            const time_one = coord.data().time_chosen.seconds; // Unix seconds notwendig ??? - macht nur fehler
            const time_half = coord.data().time_half.seconds;
            console.log(moment());
            console.log(moment.unix(time_one));
            console.log(moment.unix(time_half))

            const time_stamp = coord.data().timestamp;
            const extrainfo = '';
            var marker_color = '';
            
            if (moment().isAfter(moment.unix(time_one))){
              marker_color = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
              

            }
             if(moment().isAfter(moment.unix(time_half))){
               marker_color =  'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
              
            }
             if(moment().isBefore(moment.unix(time_half))){
              marker_color =  'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
             
           }
            const position = new google.maps.LatLng(coord.data().location._lat,coord.data().location._long);
            const marker = new google.maps.Marker({
                position,
                map: this.map,
                icon: marker_color,
                title: title,
                animation: google.maps.Animation.DROP,
               });
           
               
               
               var infowindow = new google.maps.InfoWindow({
                content : '<div><strong>' + title + '</strong><br>' +
                'Adress: ' + adress + '<br>' + '</div>'+'<button id="myid"><strong>Show Client Info !</strong></button>',
                maxWidth: 300
                });
                google.maps.event.addListenerOnce(infowindow, 'domready', () => {
                document.getElementById('myid').addEventListener('click', () => {
                  this.markerLoad(placeId);
                 
                
                });
                
                });

               google.maps.event.addListener(marker,'click',function(){
                
                infowindow.open(this.map, this);
               })
 
           
              })
            }) 
            


            
        });
 
  
  }*/
 

  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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
  }
  var styledMapType = new google.maps.StyledMapType(
    [
      {
          "featureType": "administrative",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "water",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "transit",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "landscape",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road.local",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "water",
          "stylers": [
              {
                  "color": "#84afa3"
              },
              {
                  "lightness": 52
              }
          ]
      },
      {
          "stylers": [
              {
                  "saturation": -77
              }
          ]
      },
      {
          "featureType": "road"
      }
  ]
  
    ,
    {name: 'Styled Map'});




      this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
      this.map.mapTypes.set('styled_map', styledMapType);
      this.map.setMapTypeId('styled_map');
     // this.createListMarkers();


    }, (err) => {
      console.log(err);
    });

    

  }

  

  



  


  ionViewDidLoad(){
   
   
    
    this.loadMap();
    
    //Alternative Searchbox von Google - aktuell nicht verwendet !
   /*  let elem = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
    this.autocomplete = new google.maps.places.SearchBox(elem); */
  }


  
}

 // Nearby Search - Currently not used in App !!!
/* 
  searchMarker() {
    

   
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(this.map);
    
    this.geolocation.getCurrentPosition().then((position) => {
    service.nearbySearch({
      
      location: {lat: position.coords.latitude, lng: position.coords.longitude}, 
      radius: 1000,
      type: ['store']
    }, (results,status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarker(results[i]);
        }
      }
    });})
  }  */

  

  /*  createMarker(client) {
    
    var image = { 
      url: client.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var placeLoc = this.client.location;
    var marker = new google.maps.Marker({
      map: this.map,
      position: placeLoc,
      title: this.client.title
    });
  
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(this.client.title);
      infowindow.open(this.map, this);
      infowindow.setContent('<div><strong>' + this.client.title + '</strong><br>' );
    infowindow.open(this.map, this);

    });
  }   */


 







