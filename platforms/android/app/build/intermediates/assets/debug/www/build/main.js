webpackJsonp([6],{

/***/ 1185:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(556);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(555);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__ = __webpack_require__(130);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, afAuth) {
        var _this = this;
        this.afAuth = afAuth;
        this.rootPage = 'LoginPage';
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            _this.afAuth.authState.subscribe(function (state) {
                if (state) {
                    _this.rootPage = 'HomePage';
                }
                else {
                    _this.rootPage = 'LoginPage';
                }
            });
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/alexandersteurer/Routeplanner/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/alexandersteurer/Routeplanner/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__["a" /* AngularFireAuth */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClientsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angularfire2_auth__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operators__ = __webpack_require__(46);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*
  Generated class for the ClientsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var ClientsProvider = /** @class */ (function () {
    function ClientsProvider(afs, afAuth) {
        var _this = this;
        this.afs = afs;
        this.afAuth = afAuth;
        this.clientdata = {
            title: null,
            address: null,
            location: null,
            id: null,
            info: null,
            timestamp: null,
            bool: false,
            docId: null,
            intervall: null,
        };
        this.afAuth.authState.subscribe(function (user) {
            if (user)
                _this.userId = user.uid;
            _this.clientCollection = _this.afs.collection(user.uid);
            /* this.clientList = this.clientCollection.valueChanges(); */
            _this.clientList = _this.clientCollection.snapshotChanges().pipe(Object(__WEBPACK_IMPORTED_MODULE_3_rxjs_operators__["map"])(function (actions) { return actions.map(function (a) {
                var data = a.payload.doc.data();
                var id = a.payload.doc.id;
                return __assign({ id: id }, data);
            }); }));
        });
    }
    ClientsProvider.prototype.add = function (client) {
        return this.clientCollection.add(client);
    };
    ClientsProvider.prototype.getCLients = function () {
        return this.clientList;
    };
    ClientsProvider.prototype.removeClient = function (id) {
        var _this = this;
        this.afAuth.authState.subscribe(function (user) {
            if (user)
                _this.userId = user.uid;
            console.log(_this.afs.doc(user.uid + '/' + id));
            return _this.afs.doc(user.uid + '/' + id).delete();
        });
    };
    ClientsProvider.prototype.updateClient = function (client, id) {
        var _this = this;
        var uid;
        this.afAuth.authState.subscribe(function (user) {
            if (user)
                _this.userId = user.uid;
            console.log(_this.afs.doc(user.uid + '/' + client.id));
            return _this.afs.doc(user.uid + '/' + client.id).update({
                docId: id
            });
        });
    };
    ClientsProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__["a" /* AngularFirestore */], __WEBPACK_IMPORTED_MODULE_0_angularfire2_auth__["a" /* AngularFireAuth */]])
    ], ClientsProvider);
    return ClientsProvider;
}());

//# sourceMappingURL=clients.js.map

/***/ }),

/***/ 287:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 287;

/***/ }),

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/home/home.module": [
		1186,
		2
	],
	"../pages/info/info.module": [
		1187,
		5
	],
	"../pages/login/login.module": [
		1188,
		4
	],
	"../pages/routing/routing.module": [
		1189,
		0
	],
	"../pages/start/start.module": [
		1190,
		1
	],
	"../pages/tasks/tasks.module": [
		1191,
		3
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 330;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 558:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_clients_clients__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular_navigation_view_controller__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_firestore__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_mathjs__ = __webpack_require__(762);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_mathjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_mathjs__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var InfoPage = /** @class */ (function () {
    function InfoPage(afs, navCtrl, navParams, viewCtrl, clientsProvider, modalController, afAuth) {
        this.afs = afs;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.clientsProvider = clientsProvider;
        this.modalController = modalController;
        this.afAuth = afAuth;
        this.updateId = null;
        this.clientdata = {
            title: null,
            address: null,
            location: null,
            id: null,
            info: null,
            timestamp: null,
            bool: false,
            docId: String,
        };
        this.currentDate = new Date();
    }
    InfoPage.prototype.resetTimeStamp = function () {
        var _this = this;
        var inter = this.clientsProvider.clientdata.intervall;
        var half = __WEBPACK_IMPORTED_MODULE_7_mathjs__["round"](this.clientsProvider.clientdata.intervall / 2);
        var new_full = __WEBPACK_IMPORTED_MODULE_6_moment___default()(this.currentDate).add(inter, 'minutes').toDate();
        var new_half = __WEBPACK_IMPORTED_MODULE_6_moment___default()(this.currentDate).add(half, 'minutes').toDate();
        this.afAuth.authState.subscribe(function (user) {
            if (user)
                _this.userId = user.uid;
            return _this.afs.doc(user.uid + '/' + _this.clientsProvider.clientdata.docId).update({
                time_chosen: new_full,
                time_half: new_half,
            });
        });
    };
    InfoPage.prototype.timeConvert = function () {
        this.new_date = __WEBPACK_IMPORTED_MODULE_6_moment___default()(this.currentDate).add(this.day_intervall, 'days').toDate();
        var half_inter = __WEBPACK_IMPORTED_MODULE_7_mathjs__["round"](this.day_intervall / 2);
        this.day_intervall_half = __WEBPACK_IMPORTED_MODULE_6_moment___default()(this.currentDate).add(half_inter, 'days').toDate();
    };
    InfoPage.prototype.closeModal = function () {
        this.viewCtrl.dismiss();
    };
    InfoPage.prototype.updateInformation = function () {
        var _this = this;
        this.timeConvert();
        this.afAuth.authState.subscribe(function (user) {
            if (user)
                _this.userId = user.uid;
            return _this.afs.doc(user.uid + '/' + _this.clientsProvider.clientdata.docId).update({
                extra_info: _this.infoText,
                time_chosen: _this.new_date,
                time_half: _this.day_intervall_half,
                intervall: _this.day_intervall,
            });
        });
        this.closeModal();
    };
    ;
    InfoPage.prototype.ionViewWillLoad = function () {
    };
    InfoPage.prototype.ionViewDidLoad = function () {
    };
    InfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["m" /* Component */])({
            selector: 'page-info',template:/*ion-inline-start:"/Users/alexandersteurer/Routeplanner/src/pages/info/info.html"*/'<!--\n  Generated template for the InfoPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>Client´s Page</ion-title>\n    <ion-buttons end>\n      <button ion-button icon-only (click)="closeModal()"><ion-icon name="close"></ion-icon></button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content >\n\n    <ion-card #textblock tappable>\n        <ion-item-sliding >\n        <ion-item>\n          \n          <h2>{{this.clientsProvider.clientdata.title}}</h2>\n          <p>{{this.clientsProvider.clientdata.address}}</p>\n        </ion-item>\n      \n      </ion-item-sliding>\n          </ion-card>\n        \n         \n        <ion-list>\n          <ion-list-header>\n            Choose an intervall in days:\n              \n           </ion-list-header>\n           <ion-badge item-start> {{this.clientsProvider.clientdata.intervall}}</ion-badge>\n        <ion-item>\n          <ion-range min="0" max="365" pin = "true" [(ngModel)]="day_intervall" color="primary">\n              <ion-label range-left>No intervall</ion-label>\n              <ion-label range-right>Day´s</ion-label>\n            </ion-range>\n                \n        </ion-item>\n        <button ion-button (click)="resetTimeStamp()">Reset intervall</button>\n        </ion-list>\n            \n          \n       \n       \n\n    \n    <ion-item  tappable>\n     \n          \n      </ion-item>\n   \n    <h2>Additional Client Information:</h2>\n    <p>{{this.clientsProvider.clientdata.info}}</p> \n    <ion-textarea [(ngModel)]="infoText"> {{infoText}} </ion-textarea>\n        <button ion-button small (click)="updateInformation(this.clientsProvider.clientdata.docId)">Update Client</button>  \n        <p>{{this.clientsProvider.clientdata.id}}</p>\n      \n    \n   \n      \n        \n          \n            \n           \n     \n  \n   \n   \n   <!--  (click)="edit(client)"  -->\n  </ion-content>'/*ion-inline-end:"/Users/alexandersteurer/Routeplanner/src/pages/info/info.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5_angularfire2_firestore__["a" /* AngularFirestore */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["n" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["p" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular_navigation_view_controller__["a" /* ViewController */], __WEBPACK_IMPORTED_MODULE_0__providers_clients_clients__["a" /* ClientsProvider */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["m" /* ModalController */], __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__["a" /* AngularFireAuth */]])
    ], InfoPage);
    return InfoPage;
}());

//# sourceMappingURL=info.js.map

/***/ }),

/***/ 565:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(566);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(688);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 688:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_info_info__ = __webpack_require__(558);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_splash_screen__ = __webpack_require__(555);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__ = __webpack_require__(556);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(1185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_angularfire2__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angularfire2_auth__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angularfire2_firestore__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_geolocation__ = __webpack_require__(563);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_clients_clients__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ionic2_super_tabs__ = __webpack_require__(564);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













var environment = {
    apiKey: "AIzaSyB4gHXhzyZffzAYe9u0rbY5Ix31HY-IUxk",
    authDomain: "routingplanner-7db49.firebaseapp.com",
    databaseURL: "https://routingplanner-7db49.firebaseio.com",
    projectId: "routingplanner-7db49",
    storageBucket: "routingplanner-7db49.appspot.com",
    messagingSenderId: "936066364251"
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_0__pages_info_info__["a" /* InfoPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_7_angularfire2__["a" /* AngularFireModule */].initializeApp(environment),
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/home/home.module#HomePageModule', name: 'HomePage', segment: 'home', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/info/info.module#InfoPageModule', name: 'InfoPage', segment: 'info', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/routing/routing.module#RoutingPageModule', name: 'RoutingPage', segment: 'routing', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/start/start.module#StartPageModule', name: 'StartPage', segment: 'start', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/tasks/tasks.module#TasksPageModule', name: 'TasksPage', segment: 'tasks', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_12_ionic2_super_tabs__["b" /* SuperTabsModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_9_angularfire2_firestore__["b" /* AngularFirestoreModule */],
                __WEBPACK_IMPORTED_MODULE_8_angularfire2_auth__["b" /* AngularFireAuthModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_0__pages_info_info__["a" /* InfoPage */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_geolocation__["a" /* Geolocation */],
                { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_11__providers_clients_clients__["a" /* ClientsProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 744:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 337,
	"./af.js": 337,
	"./ar": 338,
	"./ar-dz": 339,
	"./ar-dz.js": 339,
	"./ar-kw": 340,
	"./ar-kw.js": 340,
	"./ar-ly": 341,
	"./ar-ly.js": 341,
	"./ar-ma": 342,
	"./ar-ma.js": 342,
	"./ar-sa": 343,
	"./ar-sa.js": 343,
	"./ar-tn": 344,
	"./ar-tn.js": 344,
	"./ar.js": 338,
	"./az": 345,
	"./az.js": 345,
	"./be": 346,
	"./be.js": 346,
	"./bg": 347,
	"./bg.js": 347,
	"./bm": 348,
	"./bm.js": 348,
	"./bn": 349,
	"./bn.js": 349,
	"./bo": 350,
	"./bo.js": 350,
	"./br": 351,
	"./br.js": 351,
	"./bs": 352,
	"./bs.js": 352,
	"./ca": 353,
	"./ca.js": 353,
	"./cs": 354,
	"./cs.js": 354,
	"./cv": 355,
	"./cv.js": 355,
	"./cy": 356,
	"./cy.js": 356,
	"./da": 357,
	"./da.js": 357,
	"./de": 358,
	"./de-at": 359,
	"./de-at.js": 359,
	"./de-ch": 360,
	"./de-ch.js": 360,
	"./de.js": 358,
	"./dv": 361,
	"./dv.js": 361,
	"./el": 362,
	"./el.js": 362,
	"./en-au": 363,
	"./en-au.js": 363,
	"./en-ca": 364,
	"./en-ca.js": 364,
	"./en-gb": 365,
	"./en-gb.js": 365,
	"./en-ie": 366,
	"./en-ie.js": 366,
	"./en-il": 367,
	"./en-il.js": 367,
	"./en-nz": 368,
	"./en-nz.js": 368,
	"./eo": 369,
	"./eo.js": 369,
	"./es": 370,
	"./es-do": 371,
	"./es-do.js": 371,
	"./es-us": 372,
	"./es-us.js": 372,
	"./es.js": 370,
	"./et": 373,
	"./et.js": 373,
	"./eu": 374,
	"./eu.js": 374,
	"./fa": 375,
	"./fa.js": 375,
	"./fi": 376,
	"./fi.js": 376,
	"./fo": 377,
	"./fo.js": 377,
	"./fr": 378,
	"./fr-ca": 379,
	"./fr-ca.js": 379,
	"./fr-ch": 380,
	"./fr-ch.js": 380,
	"./fr.js": 378,
	"./fy": 381,
	"./fy.js": 381,
	"./gd": 382,
	"./gd.js": 382,
	"./gl": 383,
	"./gl.js": 383,
	"./gom-latn": 384,
	"./gom-latn.js": 384,
	"./gu": 385,
	"./gu.js": 385,
	"./he": 386,
	"./he.js": 386,
	"./hi": 387,
	"./hi.js": 387,
	"./hr": 388,
	"./hr.js": 388,
	"./hu": 389,
	"./hu.js": 389,
	"./hy-am": 390,
	"./hy-am.js": 390,
	"./id": 391,
	"./id.js": 391,
	"./is": 392,
	"./is.js": 392,
	"./it": 393,
	"./it.js": 393,
	"./ja": 394,
	"./ja.js": 394,
	"./jv": 395,
	"./jv.js": 395,
	"./ka": 396,
	"./ka.js": 396,
	"./kk": 397,
	"./kk.js": 397,
	"./km": 398,
	"./km.js": 398,
	"./kn": 399,
	"./kn.js": 399,
	"./ko": 400,
	"./ko.js": 400,
	"./ky": 401,
	"./ky.js": 401,
	"./lb": 402,
	"./lb.js": 402,
	"./lo": 403,
	"./lo.js": 403,
	"./lt": 404,
	"./lt.js": 404,
	"./lv": 405,
	"./lv.js": 405,
	"./me": 406,
	"./me.js": 406,
	"./mi": 407,
	"./mi.js": 407,
	"./mk": 408,
	"./mk.js": 408,
	"./ml": 409,
	"./ml.js": 409,
	"./mn": 410,
	"./mn.js": 410,
	"./mr": 411,
	"./mr.js": 411,
	"./ms": 412,
	"./ms-my": 413,
	"./ms-my.js": 413,
	"./ms.js": 412,
	"./mt": 414,
	"./mt.js": 414,
	"./my": 415,
	"./my.js": 415,
	"./nb": 416,
	"./nb.js": 416,
	"./ne": 417,
	"./ne.js": 417,
	"./nl": 418,
	"./nl-be": 419,
	"./nl-be.js": 419,
	"./nl.js": 418,
	"./nn": 420,
	"./nn.js": 420,
	"./pa-in": 421,
	"./pa-in.js": 421,
	"./pl": 422,
	"./pl.js": 422,
	"./pt": 423,
	"./pt-br": 424,
	"./pt-br.js": 424,
	"./pt.js": 423,
	"./ro": 425,
	"./ro.js": 425,
	"./ru": 426,
	"./ru.js": 426,
	"./sd": 427,
	"./sd.js": 427,
	"./se": 428,
	"./se.js": 428,
	"./si": 429,
	"./si.js": 429,
	"./sk": 430,
	"./sk.js": 430,
	"./sl": 431,
	"./sl.js": 431,
	"./sq": 432,
	"./sq.js": 432,
	"./sr": 433,
	"./sr-cyrl": 434,
	"./sr-cyrl.js": 434,
	"./sr.js": 433,
	"./ss": 435,
	"./ss.js": 435,
	"./sv": 436,
	"./sv.js": 436,
	"./sw": 437,
	"./sw.js": 437,
	"./ta": 438,
	"./ta.js": 438,
	"./te": 439,
	"./te.js": 439,
	"./tet": 440,
	"./tet.js": 440,
	"./tg": 441,
	"./tg.js": 441,
	"./th": 442,
	"./th.js": 442,
	"./tl-ph": 443,
	"./tl-ph.js": 443,
	"./tlh": 444,
	"./tlh.js": 444,
	"./tr": 445,
	"./tr.js": 445,
	"./tzl": 446,
	"./tzl.js": 446,
	"./tzm": 447,
	"./tzm-latn": 448,
	"./tzm-latn.js": 448,
	"./tzm.js": 447,
	"./ug-cn": 449,
	"./ug-cn.js": 449,
	"./uk": 450,
	"./uk.js": 450,
	"./ur": 451,
	"./ur.js": 451,
	"./uz": 452,
	"./uz-latn": 453,
	"./uz-latn.js": 453,
	"./uz.js": 452,
	"./vi": 454,
	"./vi.js": 454,
	"./x-pseudo": 455,
	"./x-pseudo.js": 455,
	"./yo": 456,
	"./yo.js": 456,
	"./zh-cn": 457,
	"./zh-cn.js": 457,
	"./zh-hk": 458,
	"./zh-hk.js": 458,
	"./zh-tw": 459,
	"./zh-tw.js": 459
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 744;

/***/ })

},[565]);
//# sourceMappingURL=main.js.map