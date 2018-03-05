import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { SigninPage } from '../signin/signin';
import { SignupPage } from '../signup/signup';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
    setTimeout(() => {if($('.pictobutton').is(':hidden')){
      $('.pictobutton').slideDown('slow');
    }}, 500);
  }

  goToSignin() {
    this.navCtrl.push(SigninPage);
  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }

}
