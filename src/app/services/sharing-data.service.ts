import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter();

  private _idUserEventEmitter = new EventEmitter();

  private _findUserByIdEventeEmmiter = new EventEmitter();

  private _selectUserEventeEmmiter = new EventEmitter();

  private _errorsUserFormEventEmmiter = new EventEmitter();

  private _pageUsersEventEmmiter = new EventEmitter();

  private _handlerLoginEventEmmiter = new EventEmitter();

  constructor() { }

  get handlerLoginEventEmmiter(): EventEmitter<any> {
    return this._handlerLoginEventEmmiter;
  }
  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }

  get idUserEventEmitter(): EventEmitter<number> {
    return this._idUserEventEmitter;
  }

  get findUserByIdEventeEmmiter() {
    return this._findUserByIdEventeEmmiter;
  }

  get selectUserEventeEmmiter() {
    return this._selectUserEventeEmmiter;
  }

  get errorsUserFormEventEmmiter() {
    return this._errorsUserFormEventEmmiter;
  }

  get pageUsersEventEmmiter() {
    return this._pageUsersEventEmmiter;
  }
}
