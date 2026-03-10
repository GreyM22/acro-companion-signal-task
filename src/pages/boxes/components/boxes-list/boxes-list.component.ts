import { Component, inject } from '@angular/core';
import {
  MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { BOXES_NUMBER, BoxesStore } from '@shared';

@Component({
  selector: 'app-boxes-list',
  templateUrl: './boxes-list.component.html',
  styleUrl: './boxes-list.component.css',
  imports: [MatButtonToggleModule],
  providers: [
    {
      provide: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,
      useValue: {
        hideSingleSelectionIndicator: true,
        hideMultipleSelectionIndicator: true,
      },
    },
  ],
})
export class BoxesListComponent {
  private readonly store = inject(BoxesStore);

  readonly nrOfBoxes: number[] = Array.from(
    { length: BOXES_NUMBER },
    (_, i) => i
  );
  readonly boxesValues_ = this.store.boxesValues_;
  readonly selectedBox_ = this.store.selectedBox_;

  selectBox(index: number) {
    this.store.changeSelectedBox(index);
  }
}