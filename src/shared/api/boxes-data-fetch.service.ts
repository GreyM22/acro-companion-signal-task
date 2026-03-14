import {Injectable} from '@angular/core';
import {BOX_OPTIONS, BOXES_KEY_LOCALSTORAGE} from '../configs';
import {Observable, of, throwError} from 'rxjs';
import {Boxes, BoxOption} from '../types';

@Injectable( {
    providedIn: 'root',
} )
export class BoxesDataFetchService {
    // get all
    getAll(): Observable<Boxes> {
        try {
            const value = localStorage.getItem( BOXES_KEY_LOCALSTORAGE );
            return of( value ? JSON.parse( value ) : {} );
        } catch ( e ) {
            return throwError( () => e );
        }
    }

    deleteBoxes(): Observable<Boxes> {
        try {
            localStorage.removeItem( BOXES_KEY_LOCALSTORAGE );
            return of( {} );
        } catch ( e ) {
            return throwError( () => e );
        }
    }

    getBoxOptions(): Observable<BoxOption[]> {
        return of( BOX_OPTIONS );
    }

    updateBoxes( boxes: Boxes ): Observable<Boxes> {
        try {
            localStorage.setItem( BOXES_KEY_LOCALSTORAGE, JSON.stringify( boxes ) );
            return of( boxes );
        } catch ( e ) {
            return throwError( () => e );
        }
    }
}
