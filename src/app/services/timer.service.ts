import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timer$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public get timer(): Observable<number> {
    return this.timer$.asObservable();
  }

  public start(start: number) {
    this.timer$.next(start);
    const interval$ = interval(1000);
    interval$.pipe(takeWhile(() => this.timer$.getValue() > 0)).subscribe({
      next: () => {
        this.timer$.next(this.timer$.getValue() - 1);
      },
    });
  }

  public stop() {
    this.timer$.next(0);
  }

  public setTime(time: number) {
    this.timer$.next(time);
  }
}
