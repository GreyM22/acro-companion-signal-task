import { Injectable } from '@angular/core';
import { BOXES_KEY_LOCALSTORAGE, BOX_OPTIONS } from '../configs';
import { Observable, of, throwError } from 'rxjs';
import { Box, Boxes, BoxOption } from '../types';

@Injectable({
  providedIn: 'root',
})
export class BoxesDataFetchService {
  // get all
  getAll(): Observable<Boxes> {
    try {
      const value = localStorage.getItem(BOXES_KEY_LOCALSTORAGE);
      return of(value ? JSON.parse(value) : {});
    } catch (e) {
      return throwError(() => e);
    }
  }

  // set the value for a specific box
  setBoxValue(boxId: number, value: BoxOption): Observable<Boxes> {
    try {
      const boxes = localStorage.getItem(BOXES_KEY_LOCALSTORAGE);
      let newBoxes: Boxes;

      if (!boxes) {
        newBoxes = { [boxId]: { ...value, id: boxId } };
      } else {
        newBoxes = { ...JSON.parse(boxes), [boxId]: { ...value, id: boxId } };
      }

      localStorage.setItem(BOXES_KEY_LOCALSTORAGE, JSON.stringify(newBoxes));

      return of(newBoxes);
    } catch (e) {
      return throwError(() => e);
    }
  }

  deleteBoxes(): Observable<Boxes> {
    try {
      localStorage.removeItem(BOXES_KEY_LOCALSTORAGE);
      return of({});
    } catch (e) {
      return throwError(() => e);
    }
  }

  getBoxOptions(): Observable<BoxOption[]> {
    return of(BOX_OPTIONS);
  }
}
