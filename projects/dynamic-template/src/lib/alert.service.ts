import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    public emitter: EventEmitter<any> = new EventEmitter();
    constructor() {}

    public error(message: string) {
        // do something, then...
        this.emitter.emit({type: 'danger', title: 'error', message: message});
    }

    public success(message: string) {
        // do something, then...
        this.emitter.emit({type: 'success', title: 'success', message: message});
    }

     public warning(message: string) {
        // do something, then...
        this.emitter.emit({type: 'warning', title: 'warning', message: message});
    }

     public info(message: string) {
        // do something, then...
        this.emitter.emit({type: 'info', title: 'info', message: message});
    }
}
