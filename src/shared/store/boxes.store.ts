import {computed, inject} from '@angular/core';
import {signalStore, withState, withMethods, withComputed, withHooks, patchState} from '@ngrx/signals';
import {Boxes, BoxOption} from '../types';
import {BoxesDataFetchService} from '../api';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BOXES_NUMBER, MAT_SNACK_BAR_CONFIG} from '../configs';

type BoxesState = {
    selectedBox_: number | undefined;
    boxOptions_: BoxOption[];
    boxesValues_: Boxes;
};

const initialState: BoxesState = {
    selectedBox_: undefined,
    boxOptions_: [],
    boxesValues_: {},
};

export const BoxesStore = signalStore(
    {providedIn: 'root'},
    withState( initialState ),
    withComputed( ( {boxesValues_} ) => ({
        sum_: computed( () =>
            Object.values( boxesValues_() ).filter( b => !!b ).reduce( ( sum, box ) => sum + box.value, 0 )
        ),
    }) ),
    withMethods( ( store ) => {
        const boxesDataFetchService = inject( BoxesDataFetchService );
        const matSnackBar = inject( MatSnackBar );

        return {
            getBoxOptions(): void {
                boxesDataFetchService
                    .getBoxOptions()
                    .subscribe( ( res ) => patchState( store, {boxOptions_: res} ) );
            },

            getBoxValues(): void {
                boxesDataFetchService.getAll().subscribe( {
                    next: ( r ) => patchState( store, {boxesValues_: r} ),
                    error: ( e ) => {
                        console.error( e );
                        matSnackBar.open( 'Error getting data', undefined, MAT_SNACK_BAR_CONFIG );
                    },
                } );
            },

            changeSelectedBox( index: number ): void {
                patchState( store, {selectedBox_: index} );
            },

            setBoxValue( value: BoxOption ): void {
                const selectedBox = store.selectedBox_();
                if ( selectedBox === undefined ) {
                    matSnackBar.open(
                        'You need to select a box to change its value!',
                        undefined,
                        MAT_SNACK_BAR_CONFIG
                    );
                    return;
                }
                boxesDataFetchService.setBoxValue( selectedBox, value ).subscribe( {
                    next: ( r ) => {
                        patchState( store, {
                            boxesValues_: r,
                            selectedBox_:
                                (selectedBox === BOXES_NUMBER - 1
                                    ? selectedBox
                                    : (selectedBox || 0) + 1) % BOXES_NUMBER,
                        } );
                    },
                    error: ( e ) => {
                        console.error( e );
                        matSnackBar.open(
                            'Error changing box value',
                            undefined,
                            MAT_SNACK_BAR_CONFIG
                        );
                    },
                } );
            },

            deleteAll(): void {
                boxesDataFetchService.deleteBoxes().subscribe( {
                    next: () => patchState( store, {boxesValues_: {}} ),
                    error: ( e ) => {
                        console.error( e );
                        matSnackBar.open(
                            'Error deleting values',
                            undefined,
                            MAT_SNACK_BAR_CONFIG
                        );
                    },
                } );
            },
        };
    } ),
    withHooks( {
        onInit( store ) {
            store.getBoxOptions();
            store.getBoxValues();
        },
    } )
);
