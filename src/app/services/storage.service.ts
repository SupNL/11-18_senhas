import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  save(key : string, value : any) : Promise<void> {
    return new Promise((resolve) => {
      Storage.set({key, value : JSON.stringify(value)});
    })
  }

  load(key : string) : Promise<any> {
    return new Promise((resolve) => {
      Storage.get({ key }).then(res => {
        const object = JSON.parse(res.value);
        resolve(object);
      })
    })
  }
}
