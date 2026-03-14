import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {Boxes, BoxOption} from '../types';
import {BoxesDataFetchService} from '../api';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BOXES_NUMBER, MAT_SNACK_BAR_CONFIG} from '../configs';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {EMPTY, pipe, switchMap} from "rxjs";
import {tapResponse} from '@ngrx/operators';

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

            setBoxValue: rxMethod<BoxOption>(pipe(
                switchMap((boxOption, i) => {
                    const selectedBox = store.selectedBox_();
                    const boxesValues = store.boxesValues_();
                    /**
                     * In case there is no box selected to assign it a value
                     * we show a message to the user
                     */
                    if (selectedBox == null) {
                        matSnackBar.open(
                            'You need to select a box to change its value!',
                            undefined,
                            MAT_SNACK_BAR_CONFIG
                        );
                        return EMPTY;
                    }

                    /**
                     * Generate the new state with the new value for
                     * the new value of the selected box
                     */
                    let newBoxes: Boxes;

                    if (!boxesValues) {
                        newBoxes = { [selectedBox]: { ...boxOption, id: selectedBox } };
                    } else {
                        newBoxes = {
                            ...boxesValues,
                            [selectedBox]: { ...boxOption, id: selectedBox },
                        };
                    }

                    // update the value of the boxes in the server/database
                    return boxesDataFetchService.updateBoxes(newBoxes).pipe(
                        tapResponse({
                            next: (r) => {
                                /**
                                 * If the update was successful
                                 * we update the state value
                                 * and move selection to the next available box
                                 * unless we are at the last box
                                 */
                                patchState( store, {
                                    boxesValues_: r,
                                    selectedBox_:
                                        (selectedBox === BOXES_NUMBER - 1
                                            ? selectedBox
                                            : (selectedBox || 0) + 1) % BOXES_NUMBER,
                                } );
                            },
                            error: (e) => {
                                console.error( e );
                                matSnackBar.open(
                                    'Error changing box value',
                                    undefined,
                                    MAT_SNACK_BAR_CONFIG
                                );
                            }
                        })
                    );
                })
            )),

            deleteAll(): void {
                boxesDataFetchService.deleteBoxes().subscribe( {
                    next: (r) => patchState( store, {boxesValues_: r} ),
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
