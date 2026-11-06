import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export function useAuthPlaceholderForm() {
  const fb = inject(FormBuilder);

  return fb.nonNullable.group({
    name: ['', [Validators.maxLength(64)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
}
