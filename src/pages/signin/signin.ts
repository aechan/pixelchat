import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RoomPage } from  '../room/room';
import * as firebase from 'firebase';
import * as $ from 'jquery';
/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  data = { 
    email:"",
    password: "",
    user: null
  };

  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  onSignInSubmit() {
    firebase.auth().signInWithEmailAndPassword(this.data.email, this.data.password).then((user: any) => {
      // empty nav stack and switch to homepage view.
      // pass our user info to the homepage
      this.navCtrl.setRoot(RoomPage);
      
    }).catch(err => {
      // catch any errors, display them to user and reset form for them to try loggin in again.
      console.log(err);
      this.sendAlert(err.message, "Error️");
      var form = <HTMLFormElement>$("#form")[0];
      form.reset();
    });
  }

  // pop up alert helper func
  sendAlert(message: string, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
