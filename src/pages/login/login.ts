import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  loading: Loading;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, 
    private afAuth: AngularFireAuth, private loadignCtrl: LoadingController, private alertCtrl: AlertController) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  signupUser() {
    this.loading = this.loadignCtrl.create();
    this.loading.present();

    this.afAuth.auth.createUserWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
    .then(data => {
      this.loading.dismiss();
    }, err => {
      this.loading.dismiss().then(() => {
        this.showBasicAlert('Error', err.message);
      })
    });
  }

  loginUser() {
    this.loading = this.loadignCtrl.create();
    this.loading.present();

    this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
    .then(data => {
      this.loading.dismiss();
    }, err => {
      this.loading.dismiss().then(() => {
        this.showBasicAlert('Error', err.message);
      })
    });
  }

  showBasicAlert(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
