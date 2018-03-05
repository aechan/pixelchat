import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { RoomPage } from '../room/room';
import * as $ from 'jquery';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  data = {
    username: "",
    emailAddress: "",
    password: ""
  };

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  onFormSubmit() {
    let page: SignupPage = this;

    firebase.auth().createUserWithEmailAndPassword(this.data.emailAddress, this.data.password).then((user: any) => {
      console.log("Account created successfully!");
      user.updateProfile({
        displayName: this.data.username
      }).then(() => {
        user.sendEmailVerification().then(() => {
          this.sendAlert("We've sent you a verification email. Please check your inbox.", "Notice");
          this.navCtrl.setRoot(RoomPage);
        }).catch((err) => {
          this.sendAlert(err.message, "Error️");
        });
      });
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + " " + errorMessage);
      page.sendAlert(errorMessage, "Error️");
      var form = <HTMLFormElement>$("#form")[0];
      form.reset();
    });
  }

  sendAlert(message: string, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
