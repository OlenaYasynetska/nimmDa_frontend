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

export function checkEmailCopy(
  type: AuthMailType,
  sent: boolean | null
): { title: string; body: string } {
  if (type === 'reset') {
    return {
      title: 'E-Mail prüfen',
      body: 'Wenn ein Konto existiert, haben wir einen Link zum Zurücksetzen des Passworts gesendet. Bitte prüfe Posteingang und Spam.',
    };
  }
  if (sent === false) {
    return {
      title: 'Bitte E-Mail bestätigen',
      body: 'Dein Konto ist noch nicht offen. Die Bestätigungsmail konnte gerade nicht gesendet werden. Tippe auf „E-Mail erneut senden“, öffne die Nachricht und den Link darin. Erst danach kannst du dich anmelden.',
    };
  }
  if (sent === true) {
    return {
      title: 'Bitte E-Mail bestätigen',
      body: 'Wir haben gerade eine E-Mail an diese Adresse geschickt. Öffne die Nachricht und tippe auf den Link. Erst nach dieser Bestätigung kannst du dich anmelden und dein Konto öffnen. Schau auch im Spam-Ordner nach.',
    };
  }
  return {
    title: 'Bitte E-Mail bestätigen',
    body: 'Dein Konto öffnet sich erst nach dem Link in der Bestätigungsmail. Die Nachricht geht an die Adresse unten. Schau im Posteingang und im Spam nach. Wenn keine Mail da ist, tippe auf „E-Mail erneut senden“.',
  };
}
