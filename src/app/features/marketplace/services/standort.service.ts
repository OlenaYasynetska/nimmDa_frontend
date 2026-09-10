import { Injectable, computed, signal } from '@angular/core';
import {
  parseStandort,
  standortLabel,
  type StandortValue,
} from '../data/standort';

const STORAGE_KEY = 'nimmda.standort';

@Injectable({ providedIn: 'root' })
export class StandortService {
  private readonly selectedSignal = signal<StandortValue>(readStored());

  readonly selected = this.selectedSignal.asReadonly();
  readonly label = computed(() => standortLabel(this.selectedSignal()));

  set(value: StandortValue): void {
    this.selectedSignal.set(value);
    if (typeof localStorage === 'undefined') {
      return;
    }
    if (value) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  queryParams(): Record<string, string> {
    const value = this.selectedSignal();
    return value ? { ort: value } : {};
  }
}

function readStored(): StandortValue {
  if (typeof localStorage === 'undefined') {
    return '';
  }
  return parseStandort(localStorage.getItem(STORAGE_KEY));
}
