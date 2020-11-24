import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicTemplateService {

  private events: EventsHashTable<Subject<any>> = {};
  constructor() { }

  public Broadcast(eventName: string, payload?: any): void {
    const event: Subject<any> = this.events[eventName];
    if (event !== null && typeof event !== 'undefined')  {
      event.next(payload);
    }
  }

  public ListenFor(eventName: string): Observable<any> {
    let event: Subject<any> = this.events[eventName];
    if (event === null || typeof event === 'undefined')  {
      event = new Subject<any>();
      this.events[eventName] = event;
    }
    return event.asObservable();
  }

  public ClearEvent(eventName: string): void {
    delete this.events[eventName];
  }

  public ClearAllEvents(): void {
    for (const name in this.events) {
      this.events[name].unsubscribe();
      delete this.events[name];
    }
  }

  getPointerPos(e: any, preventTouch): any {
        let x = 0;
        let y = 0;
        if (e.clientX !== undefined && e.clientY !== undefined) {
            x = e.clientX;
            y = e.clientY;
        } else if (e.taretTouches) {
            if (preventTouch) {
                e.preventDefault();
            }
            x = e.taretTouches[0].clientX;
            y = e.taretTouches[0].clientY;
        } else if (e.touches) {
            if (preventTouch) {
                e.preventDefault();
            }
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        return {
            x: x,
            y: y
        };
    }
}

interface EventsHashTable<T> {
  [key: string]: T;
}
