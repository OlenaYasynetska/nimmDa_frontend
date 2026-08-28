export interface ActionCardImageSize {
  readonly wrapClass: string;
  readonly imgClass: string;
}

/** Shared photo size for Kaufen, Services, and Kostenlos cards. */
export function useActionCardImageSize(): ActionCardImageSize {
  return {
    wrapClass: 'flex w-32 shrink-0 items-center justify-center overflow-visible sm:w-36',
    imgClass: 'h-32 w-full object-contain object-center sm:h-36',
  };
}
