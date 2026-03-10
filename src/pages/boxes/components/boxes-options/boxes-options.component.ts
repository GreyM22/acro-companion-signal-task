import { Component, inject, computed } from '@angular/core';
import { BoxesStore, BoxOption } from '@shared';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-boxes-options',
  imports: [MatTooltipModule],
  templateUrl: './boxes-options.component.html',
  styleUrl: './boxes-options.component.css',
})
export class BoxesOptionsComponent {
  private readonly store = inject(BoxesStore);

  readonly boxOptions_ = this.store.boxOptions_;

  readonly selectedOptionValue_ = computed(() => {
    const selectedBox = this.store.selectedBox_();
    const boxesValues = this.store.boxesValues_();
    return selectedBox !== undefined
      ? boxesValues[selectedBox]?.value
      : undefined;
  });

  selectOption(value: BoxOption) {
    this.store.setBoxValue(value);
  }
}