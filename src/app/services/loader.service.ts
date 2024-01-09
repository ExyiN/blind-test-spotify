import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public get isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  public setLoading(loading: boolean) {
    this.isLoading$.next(loading);
  }
}
