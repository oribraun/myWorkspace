import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertService} from './alert.service';

declare var $: any;
@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {

    @ViewChild('alertModal') alertModal;
    private alertService: AlertService;
    public message: string;
    public title: string;
    public type: string;
    constructor(alertService: AlertService) {
        this.alertService = alertService;
    }

    ngOnInit(): void {
        this.alertService.emitter.subscribe((data) => {
            this.type = data.type;
            this.title = data.title;
            this.message = data.message;
            $(this.alertModal.nativeElement).modal('show');
        });
    }

}
