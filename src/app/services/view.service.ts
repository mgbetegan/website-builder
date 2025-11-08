import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ViewMode {
  BUILDER = 'builder',
  GUESTBOOK = 'guestbook'
}

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private currentView$ = new BehaviorSubject<ViewMode>(ViewMode.BUILDER);

  getCurrentView(): Observable<ViewMode> {
    return this.currentView$.asObservable();
  }

  setView(view: ViewMode): void {
    this.currentView$.next(view);
  }

  toggleView(): void {
    const current = this.currentView$.value;
    this.setView(current === ViewMode.BUILDER ? ViewMode.GUESTBOOK : ViewMode.BUILDER);
  }
}
