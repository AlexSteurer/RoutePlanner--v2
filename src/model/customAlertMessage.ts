import {AlertController} from 'ionic-angular';

export class CustomAlertMessage {

    constructor(private alertController: AlertController) {

    }

    quickInfoAlert(message: string) {

        this.alertController.create({
            title: 'Quick info.',
            subTitle: message,
            buttons: ['OK']
        }).present();
    }

    errorAlert(message: string) {

        this.alertController.create({
            title: 'ERROR Occurred!',
            subTitle: message,
            buttons: ['OK']
        }).present();
    }

    presentEmptyAlert() {

        this.alertController.create({
            title: 'Field is empty!',
            subTitle: 'Every field needs a input!!!',
            buttons: ['OK']
        }).present();
    }


}