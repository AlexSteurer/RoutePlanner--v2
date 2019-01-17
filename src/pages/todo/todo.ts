import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

/**
 * Generated class for the TodoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-todo',
    templateUrl: 'todo.html',
})
export class TodoPage {

    @ViewChild('todoD') todoD;
    private todoDate = '';
    @ViewChild('descriptionView') descriptionView;
    private description = '';

    constructor(public navCtrl: NavController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TodoPage');
    }

    private clearUserInput() {

    }

    private saveUserInput() {

    }
}
