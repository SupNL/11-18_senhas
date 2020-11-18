import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service'

interface Account {
  name : string;
  login : string;
  password : string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public currentAccount : Account = {
    name : "",
    login: "",
    password : "",
  }
  public errorList : string[] = [];
  public accountList : Account[] = [];

  constructor(private alertController : AlertController, private storage : StorageService) {
    this.storage.load("accounts").then(accounts => {
      if(accounts !== null) this.accountList = accounts;
    })
  }

  public async showError(message : string) {
    const alert = await this.alertController.create({
      header : "Erro",
      message: `${message}`, 
      buttons: ["Fechar"],
    })
    await alert.present();
  }

  public async confirmDelete(name : string) {
    const alert = await this.alertController.create({
      header : "Confirme a exclusão",
      message: `Tem certeza que deseja remover a conta "${name}"?`, 
      buttons: [{
        text: "Sim",
        handler: () => {
          this.remove(name);
        }
      }, {
        text: "Não",
      }],
    })
    await alert.present();
  }

  public async showData(name : string) {
    const selectedAccount = this.accountList.find(account => {
      return account.name === name;
    })
    if(selectedAccount) {
      const alert = await this.alertController.create({
        header : selectedAccount.name,
        message: `Login ${selectedAccount.login}<br />Senha ${selectedAccount.password}`, 
        buttons: ["Fechar"],
      })
      await alert.present();
    }
  }

  public validate() : boolean {
    this.errorList = Object.keys(this.currentAccount).filter(key => {
      return this.currentAccount[key] === "";
    })
    return !(this.errorList.length > 0);
  }

  public add() {
    if(this.validate()){
      if (!!this.accountList.find(account => {
        return account.name === this.currentAccount.name
      })){
        this.showError("Conta com nome já registrado")
      } else {
        this.accountList.push(this.currentAccount);
        this.currentAccount = {
          name : "",
          login: "",
          password : "",
        }
        this.storage.save("accounts", this.accountList);
      }
    }
  }

  public remove(name : string) {
    this.accountList = this.accountList.filter((account) => {
      return account.name !== name;
    })
    this.storage.save("accounts", this.accountList);
  }

}
