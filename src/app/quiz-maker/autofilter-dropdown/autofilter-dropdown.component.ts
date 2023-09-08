import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DropdownOption } from '../types';

@Component({
  selector: 'app-autofilter-dropdown',
  templateUrl: './autofilter-dropdown.component.html',
  styleUrls: ['./autofilter-dropdown.component.css']
})
export class AutofilterDropdownComponent<T extends DropdownOption> implements OnInit {
  @Input() entries$: Observable<T[]> = new Observable();
  @Input() placeholder: string = '';
  @Input()
  set selection(entry: T) {
    if (entry) this.entryControl.setValue(entry.name);
    else this.entryControl.setValue('');
  }

  @Output()
  selectionChange = new EventEmitter<T>();

  filteredEntries$: Observable<T[]> = new Observable();
  entryControl: FormControl = new FormControl<string>('');

  ngOnInit() {
    this.filteredEntries$ = combineLatest([this.entryControl.valueChanges, this.entries$]).pipe(
      map(([userInput, entries]) =>
        entries.filter(c =>
          c.name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1
        )
      )
    );
  }

  newSelection(entry: T) {
    this.entryControl.setValue(entry.name);
    this.selectionChange.emit(entry);
  }
}
