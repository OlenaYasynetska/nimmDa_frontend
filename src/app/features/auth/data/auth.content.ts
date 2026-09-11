import type { AuthFlowError, AuthMailType } from '../../../core/models/auth-account.model';

export const AUTH_ERRORS: Record<AuthFlowError, string> = {
  exists: 'Für diese E-Mail gibt es bereits ein Konto. Bitte anmelden.',
  invalid: 'E-Mail oder Passwort ist nicht korrekt.',
  notFound: 'Diese E-Mail ist noch nicht registriert. Bitte zuerst ein Konto erstellen.',
  unverified: 'Bitte bestätige zuerst deine E-Mail.',
  expired: 'Dieser Link ist ungültig oder abgelaufen.',
  mismatch: 'Die Passwörter stimmen nicht überein.',
  mailFailed: 'Die E-Mail konnte nicht gesendet werden. Bitte später erneut versuchen.',
  network: 'Keine Verbindung zum Server. Seite neu laden und nochmal versuchen.',
};

export function checkEmailCopy(type: AuthMailType): { title: string; body: string } {
  if (type === 'reset') {
    return {
      title: 'E-Mail prüfen',
      body: 'Wenn ein Konto existiert, haben wir einen Link zum Zurücksetzen des Passworts gesendet. Bitte prüfe Posteingang und Spam.',
    };
  }
  return {
    title: 'E-Mail bestätigen',
    body: 'Wir haben dir einen Bestätigungslink an deine E-Mail gesendet. Bitte prüfe Posteingang und Spam. Nach dem Klick auf den Link kannst du dich anmelden.',
  };
}
