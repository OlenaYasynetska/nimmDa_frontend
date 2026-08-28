import { Component, input } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { useAuthModal } from '../../../../shared/hooks/use-auth-modal.hook';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CardComponent],
  host: {
    class: 'contents',
  },
  template: `
    <div
      [class]="modal.overlayClass"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="titleId()"
    >
      <button
        type="button"
        [class]="modal.backdropClass"
        [attr.aria-label]="closeLabel()"
        (click)="modal.close()"
      ></button>
      <div [class]="modal.panelClass" (click)="$event.stopPropagation()">
        <app-card>
          <div class="w-full">
            <ng-content />
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class AuthModalComponent {
  readonly modal = useAuthModal();
  readonly titleId = input.required<string>();
  readonly closeLabel = input('Close');
}
