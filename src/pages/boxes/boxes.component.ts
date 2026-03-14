import { Component, inject } from '@angular/core';
import { BoxesListComponent } from './components/boxes-list/boxes-list.component';
import { BoxesOptionsComponent } from './components/boxes-options/boxes-options.component';
import { BoxesStore } from '@shared';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  imports: [BoxesListComponent, BoxesOptionsComponent, DecimalPipe, MatButtonModule, MatIconModule],
})
export class BoxesComponent {
  private readonly store = inject(BoxesStore);

  readonly sum_ = this.store.sum_;

  deleteData() {
    this.store.deleteAll();
  }
}