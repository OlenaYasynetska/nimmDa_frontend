import { Component, input } from '@angular/core';

@Component({
  selector: 'app-landing-icon',
  standalone: true,
  template: `
    @switch (name()) {
      @case ('bag') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 12H7L6 8z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 8V7a3 3 0 016 0v1" />
        </svg>
      }
      @case ('tag') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 12l8-8h6v6l-8 8-6-6z" />
          <circle cx="15.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      }
      @case ('wrench') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.5 6.5a4 4 0 00-5.6 5.6L4 17v3h3l4.9-4.9a4 4 0 005.6-5.6L15 12l-2.5-2.5 2-3z" />
        </svg>
      }
      @case ('user') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <circle cx="12" cy="8" r="3.2" />
          <path stroke-linecap="round" d="M5.5 19.5a6.5 6.5 0 0113 0" />
        </svg>
      }
      @case ('gift') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <rect x="4" y="10" width="16" height="10" rx="1" />
          <path d="M4 14h16M12 10v10" />
          <path stroke-linecap="round" d="M12 10c-2-3-5-3-5-1.5S9 10 12 10c2-3 5-3 5-1.5S15 10 12 10z" />
        </svg>
      }
      @case ('plus') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M12 5v14M5 12h14" />
        </svg>
      }
      @case ('search') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <circle cx="11" cy="11" r="6" />
          <path stroke-linecap="round" d="M16 16l4 4" />
        </svg>
      }
      @case ('pin') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      }
      @case ('shield') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      }
      @case ('chat') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 16.5A7.5 7.5 0 1112 20H6l-1 2.5V16.5z" />
        </svg>
      }
      @case ('heart') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.8C19 15.6 12 20 12 20z" />
        </svg>
      }
      @case ('handshake') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 13l2 2 3-3 2 2 3-3M7 11L4 8l3-3 4 4M17 11l3-3-3-3-4 4" />
        </svg>
      }
      @case ('sofa') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 10V8a3 3 0 013-3h6a3 3 0 013 3v2" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 13a2 2 0 012-2h12a2 2 0 012 2v3H4v-3z" />
          <path stroke-linecap="round" d="M6 16v3M18 16v3M8 19h8" />
        </svg>
      }
      @case ('monitor') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path stroke-linecap="round" d="M8 20h8M12 16v4" />
        </svg>
      }
      @case ('shirt') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7l-4 2 2 4h2v8h8v-8h2l2-4-4-2s-1 3-4 3-4-3-4-3z" />
        </svg>
      }
      @case ('car') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 16V12l2.2-4.2A2 2 0 019 6.8h6a2 2 0 011.8 1l2.2 4.2V16" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 16h14v2a1 1 0 01-1 1h-1.5M8.5 19H6a1 1 0 01-1-1v-2" />
          <circle cx="7.5" cy="17.5" r="1.4" />
          <circle cx="16.5" cy="17.5" r="1.4" />
          <path stroke-linecap="round" d="M9 10h6" />
        </svg>
      }
      @case ('home') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 11l8-7 8 7v9H4v-9z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 20v-6h4v6" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.2 7.2c1.6-.2 2.8 1 2.4 2.5-1.3.2-2.4-.7-2.4-2.5z" />
        </svg>
      }
      @case ('building') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path d="M4 20V6h10v14M14 10h6v10" />
          <path d="M7 9h2M7 13h2M7 17h2M16.5 13h1M16.5 16h1" />
        </svg>
      }
      @case ('briefcase') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <rect x="3" y="8" width="18" height="11" rx="1.5" />
          <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18" />
        </svg>
      }
      @case ('paw') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <circle cx="8" cy="8" r="1.4" />
          <circle cx="16" cy="8" r="1.4" />
          <circle cx="6.5" cy="12" r="1.4" />
          <circle cx="17.5" cy="12" r="1.4" />
          <path d="M9 16c1.2 2 4.8 2 6 0 0 2.8-6 2.8-6 0z" />
        </svg>
      }
      @case ('hammer') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l5 5-3 1-6 6-3-3 6-6 1-3zM5 19l4-4" />
        </svg>
      }
      @case ('bike') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <circle cx="6.5" cy="16.5" r="3" />
          <circle cx="17.5" cy="16.5" r="3" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 16.5L10.5 8h4.2M10.5 8l2.2 8.5M12.7 10.8h4.3M14.7 8l2.8 8.5" />
        </svg>
      }
      @case ('stroller') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <circle cx="8" cy="18.5" r="1.8" />
          <circle cx="16.5" cy="18.5" r="1.8" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 18.2L9 9h8.5l-1.8 9.2" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V5.8h5.5A2.2 2.2 0 0116.7 8" />
          <path stroke-linecap="round" d="M4.8 8.5h3.4" />
        </svg>
      }
      @case ('grid') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
        </svg>
      }
      @case ('palette') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path d="M12 4a8 8 0 108 8h-3a2 2 0 01-2-2 2 2 0 00-2-2h-1" />
          <circle cx="8" cy="10" r=".8" fill="currentColor" />
          <circle cx="9.5" cy="7.2" r=".8" fill="currentColor" />
          <circle cx="13" cy="7" r=".8" fill="currentColor" />
        </svg>
      }
      @case ('baby') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <circle cx="12" cy="9" r="4" />
          <path stroke-linecap="round" d="M8 16c1.2 2 6.8 2 8 0M9 9h.01M15 9h.01" />
        </svg>
      }
      @case ('more') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <circle cx="5" cy="12" r="1.4" />
          <circle cx="12" cy="12" r="1.4" />
          <circle cx="19" cy="12" r="1.4" />
        </svg>
      }
      @case ('facebook') {
        <svg [attr.class]="svgClass()" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
        </svg>
      }
      @case ('instagram') {
        <svg [attr.class]="svgClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17" cy="7" r=".8" fill="currentColor" />
        </svg>
      }
      @case ('youtube') {
        <svg [attr.class]="svgClass()" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12.2s0-3.2-.4-4.6c-.2-.8-.9-1.5-1.7-1.7C18.4 5.5 12 5.5 12 5.5s-6.4 0-7.9.4c-.8.2-1.5.9-1.7 1.7C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.8.9 1.5 1.7 1.7 1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.4.4-4.6.4-4.6zM10 15.2V9.2l5.2 3-5.2 3z" />
        </svg>
      }
    }
  `,
})
export class LandingIconComponent {
  name = input.required<string>();
  svgClass = input('h-6 w-6');
}
