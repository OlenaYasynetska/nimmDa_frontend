export const SITE_OPERATOR = {
  name: 'Olena Yasynetska',
  addressLines: ['Arbeiterstraße 26/3', '4400 Steyr', 'Österreich'],
  email: 'contact@ugs-info.at',
  region: 'Oberösterreich',
};

export type FooterDocId =
  | 'faq'
  | 'sicherheit'
  | 'agb'
  | 'datenschutz'
  | 'impressum'
  | 'werbung'
  | 'profi'
  | 'kooperationen'
  | 'about'
  | 'team'
  | 'presse'
  | 'kontakt';

export interface FooterDocSection {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
  email?: string;
  emailLabel?: string;
}

export interface FooterDoc {
  title: string;
  sections: FooterDocSection[];
}

export const FOOTER_DOCS: Record<FooterDocId, FooterDoc> = {
  faq: {
    title: 'Hilfe / FAQ',
    sections: [
      {
        paragraphs: [
          'NimmDa ist der lokale Marktplatz für Oberösterreich: kaufen, verkaufen, verschenken und Dienstleistungen finden — möglichst in der Nähe.',
        ],
      },
      {
        heading: 'Wie erstelle ich ein Konto?',
        paragraphs: [
          'Klicke oben rechts auf Anmelden und wähle Neues Konto. Gib E-Mail und Passwort ein. Danach schicken wir dir eine Bestätigungsmail. Erst nach dem Klick auf den Link in der Mail ist dein Konto aktiv.',
        ],
      },
      {
        heading: 'Ich habe keine Mail bekommen.',
        paragraphs: [
          'Bitte prüfe den Spam-Ordner. Warte ein bis zwei Minuten und nutze E-Mail erneut senden. Die Bestätigung sollte im selben Browser geöffnet werden, in dem du dich registriert hast.',
        ],
      },
      {
        heading: 'Wie gebe ich eine Anzeige auf?',
        paragraphs: [
          'Melde dich an, öffne Anzeige aufgeben, lade Fotos hoch, setze Titel, Preis, Kategorie und Standort. Der Standort sollte ein echter Ort sein (z. B. Steyr oder Linz), damit andere im Umkreis suchen können.',
        ],
      },
      {
        heading: 'Wie funktioniert die Suche mit Umkreis?',
        paragraphs: [
          'Wähle zuerst einen Standort und dann 5, 10, 25 oder 50 km. NimmDa zeigt Anzeigen rund um diesen Ort — nicht nur in genau dieser Stadt.',
        ],
      },
      {
        heading: 'Wie schreibe ich einer Verkäuferin oder einem Verkäufer?',
        paragraphs: [
          'Öffne die Anzeige und nutze Verkäufer kontaktieren. Dafür brauchst du ein bestätigtes Konto. Der Chat liegt danach unter Nachrichten.',
        ],
      },
      {
        heading: 'Kostenlose Anzeigen',
        paragraphs: [
          'Unter Kostenlos findest du Verschenk-Anzeigen mit Preis 0. Beim Aufgeben einfach 0 als Preis eintragen.',
        ],
      },
      {
        heading: 'Passwort vergessen',
        paragraphs: [
          'Auf der Anmeldeseite Passwort vergessen wählen. Wir schicken einen Link zum Zurücksetzen an deine E-Mail-Adresse.',
        ],
      },
      {
        heading: 'Noch Fragen?',
        paragraphs: ['Schreib uns. Wir antworten so schnell wie möglich.'],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  sicherheit: {
    title: 'Sicherheitstipps',
    sections: [
      {
        paragraphs: [
          'NimmDa bringt Menschen lokal zusammen. Der Handel findet zwischen euch statt — bitte bleibt vorsichtig, besonders bei Geld und Treffen.',
        ],
      },
      {
        heading: 'Treffen',
        items: [
          'Trefft euch an einem öffentlichen Ort: Bahnhof, Café, belebter Platz.',
          'Geht am besten tagsüber und sag einer Vertrauensperson Bescheid.',
          'Nimm die Ware in die Hand und prüfe sie, bevor du bezahlst.',
        ],
      },
      {
        heading: 'Bezahlung',
        items: [
          'Barzahlung bei Übergabe ist für Privatverkäufe meist am sichersten.',
          'Überweise kein Geld im Voraus an unbekannte Personen.',
          'Vorsicht bei „der Kurier kommt schon“, „Zollgebühr“ oder Links zu gefälschten Bezahlseiten.',
        ],
      },
      {
        heading: 'Nachrichten',
        items: [
          'Bleib für den ersten Kontakt im NimmDa-Chat.',
          'Gib keine TAN, PIN, Passwörter oder Kopien von Ausweisen weiter.',
          'Seriöse Käuferinnen und Käufer setzen dich nicht unter Zeitdruck.',
        ],
      },
      {
        heading: 'Anzeigen',
        items: [
          'Preise, die viel zu gut klingen, sind oft Betrug.',
          'Fotos sollten zum Artikel passen. Bei Unsicherheit lieber nach weiteren Bildern fragen.',
        ],
      },
      {
        heading: 'Verdacht?',
        paragraphs: [
          'Brich den Kontakt ab und schreib uns. Bei Straftaten zusätzlich die Polizei informieren.',
        ],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  agb: {
    title: 'Allgemeine Geschäftsbedingungen',
    sections: [
      {
        paragraphs: ['Stand: September 2026'],
      },
      {
        heading: '1. Anbieterin und Geltung',
        paragraphs: [
          `Diese Bedingungen gelten für die Nutzung der Website nimmda.org (NimmDa), betrieben von ${SITE_OPERATOR.name}, ${SITE_OPERATOR.addressLines.join(', ')}.`,
          'NimmDa ist Kleinunternehmerin gemäß § 6 Abs. 1 Z 27 UStG. Es wird keine Umsatzsteuer berechnet.',
          'Mit der Registrierung oder Nutzung der Plattform akzeptierst du diese AGB.',
        ],
      },
      {
        heading: '2. Was NimmDa ist',
        paragraphs: [
          'NimmDa ist ein regionaler Online-Marktplatz. Nutzerinnen und Nutzer können Anzeigen für Waren, Verschenktes und Dienstleistungen veröffentlichen und miteinander in Kontakt treten.',
          'NimmDa wird nicht Vertragspartei des Kaufs, Tauschs oder der Dienstleistung. Der Vertrag kommt ausschließlich zwischen den Nutzerinnen und Nutzern zustande.',
        ],
      },
      {
        heading: '3. Konto',
        paragraphs: [
          'Für Anzeigen und Nachrichten ist ein Konto mit bestätigter E-Mail-Adresse nötig. Die Angaben müssen wahr sein.',
          'Das Passwort ist geheim zu halten. Du bist für alle Handlungen über dein Konto verantwortlich, soweit du sie zu vertreten hast.',
          'NimmDa darf Konten sperren oder löschen, wenn gegen diese AGB, Rechte Dritter oder geltendes Recht verstoßen wird.',
        ],
      },
      {
        heading: '4. Anzeigen',
        paragraphs: [
          'Wer eine Anzeige aufgibt, versichert, zur Veröffentlichung berechtigt zu sein und dass Text und Bilder nicht gegen Rechte Dritter verstoßen.',
          'Untersagt sind insbesondere illegale Angebote, Waffen, gefährliche Güter, eindeutig irreführende Inhalte sowie Werbung, die nicht als solche erkennbar ist.',
          'NimmDa darf Anzeigen ohne Angabe von Gründen ablehnen, kürzen oder entfernen, wenn sie gegen diese Regeln verstoßen oder den Betrieb der Plattform gefährden.',
        ],
      },
      {
        heading: '5. Nachrichten und Treffen',
        paragraphs: [
          'Kontakt über NimmDa dient der Anbahnung eines lokalen Geschäfts. Treffen, Zahlung und Übergabe organisiert ihr selbst.',
          'NimmDa prüft Nutzerinnen, Nutzer und angebotene Artikel nicht vollständig. Bitte nutze die Sicherheitstipps.',
        ],
      },
      {
        heading: '6. Entgelt',
        paragraphs: [
          'Eine Anzeige aufzugeben und Nachrichten zu schreiben ist kostenlos.',
          'Die Zusatzleistung „Top“ hebt eine Anzeige für 7 Tage über die kostenlosen Anzeigen. Sie kostet 4,99 €. Es wird keine Umsatzsteuer ausgewiesen (Kleinunternehmerin gemäß § 6 Abs. 1 Z 27 UStG). Die Kennzeichnung „Top · Anzeige“ macht die Werbung erkennbar. Danach reiht sich die Anzeige wieder unter die kostenlosen ein. Der Preis steht vor der Zahlung.',
          'Das Profi-Profil kostet 19,99 € für 30 Tage. Es zeigt Firma, Branche, Ort, Telefon und die eigenen Anzeigen und steht in dieser Zeit über privaten Anzeigen in Services, gekennzeichnet als Firma. Danach bleibt die Seite erreichbar, erscheint aber nicht mehr in diesem Block.',
          'Ein Platz auf der Startseite kostet 99 € für 30 Tage, fest und nicht pro Klick. Er ist als Anzeige gekennzeichnet. Vertrag, Rechnung und Bannerbild werden direkt vereinbart.',
          'Top-Anzeige und Profi-Profil starten erst, wenn die Zahlung erfolgreich war. Der Zahlungsbeleg geht an die E-Mail-Adresse des Kontos. Läuft die bezahlte Zeit ab, entfällt die Kennzeichnung automatisch.',
        ],
      },
      {
        heading: '7. Haftung',
        paragraphs: [
          'NimmDa haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach dem Produkthaftungsgesetz und bei Personenschäden.',
          'Bei leichter Fahrlässigkeit haftet NimmDa nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den typischerweise vorhersehbaren Schaden.',
          'Für Inhalte der Nutzerinnen und Nutzer, den Erfolg eines Geschäfts und für Schäden aus Treffen oder Zahlungen zwischen Nutzerinnen und Nutzern übernimmt NimmDa keine Haftung, soweit gesetzlich zulässig.',
        ],
      },
      {
        heading: '8. Verfügbarkeit',
        paragraphs: [
          'NimmDa bemüht sich um einen störungsfreien Betrieb, schuldet aber keine ununterbrochene Verfügbarkeit. Wartung und technische Störungen können vorkommen.',
        ],
      },
      {
        heading: '9. Änderungen',
        paragraphs: [
          'NimmDa kann diese AGB anpassen, wenn gesetzliche oder technische Änderungen es erfordern. Die aktuelle Fassung findest du auf der Website. Wesentliche Änderungen teilen wir nach Möglichkeit per E-Mail mit.',
        ],
      },
      {
        heading: '10. Recht und Gerichtsstand',
        paragraphs: [
          'Es gilt österreichisches Recht. Ist die Nutzerin oder der Nutzer Verbraucher mit Wohnsitz in der EU, bleiben zwingende Schutzvorschriften dieses Wohnsitzstaates unberührt.',
          `Gerichtsstand für Streitigkeiten mit Unternehmerinnen und Unternehmern ist ${SITE_OPERATOR.addressLines[1].replace(/^\d+\s/, '')}.`,
        ],
      },
      {
        heading: 'Kontakt',
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    sections: [
      {
        paragraphs: ['Stand: Oktober 2026'],
      },
      {
        heading: '1. Verantwortliche',
        paragraphs: [
          `${SITE_OPERATOR.name}`,
          SITE_OPERATOR.addressLines.join('\n'),
        ],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
      {
        heading: '2. Welche Daten wir verarbeiten',
        items: [
          'Konto: E-Mail-Adresse, Passwort (nur als Hash), Vor- und Nachname, Rolle, Bestätigungsstatus.',
          'Anzeigen: Titel, Preis, Kategorie, Standort mit Koordinaten, Fotos, Zeitangaben.',
          'Nachrichten: Inhalt der Chats zwischen Käuferinnen, Käufern und Verkaufenden.',
          'Technik: Login-Token im Browser (localStorage/sessionStorage), Server-Logs in üblichem Umfang.',
        ],
      },
      {
        heading: '3. Zwecke und Rechtsgrundlagen',
        paragraphs: [
          'Die Daten dienen dem Betrieb des Marktplatzes: Konto, Anzeigen, Suche nach Ort und Umkreis, Nachrichten und Sicherheit.',
          'Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO (Vertrag / vorvertragliche Schritte) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb). Soweit eine Einwilligung nötig ist, ist Art. 6 Abs. 1 lit. a DSGVO maßgeblich.',
        ],
      },
      {
        heading: '4. Empfänger und Hosting',
        paragraphs: [
          'Die Anwendung und Datenbanken werden bei technischen Dienstleistern betrieben (derzeit u. a. Hosting der Website und der API). Transaktionsmails (Bestätigung, Passwort) versenden wir über einen E-Mail-Dienstleister.',
          'Zur Ortsuche können Koordinaten über einen Kartendienst (OpenStreetMap Nominatim) ermittelt werden, wenn ein Ort noch nicht in unserer Ortsliste liegt.',
          'Reichweitenmessung läuft über Google Analytics. Fremde Display-Werbung (Google AdSense) erscheint nur auf Anzeigenseiten und nur, wenn du Werbe-Cookies erlaubst.',
        ],
      },
      {
        heading: '5. Speicherdauer',
        paragraphs: [
          'Kontodaten bleiben, solange das Konto besteht. Nach Löschung entfernen wir personenbezogene Daten, soweit keine gesetzliche Aufbewahrung entgegensteht.',
          'Anzeigen und Chats speichern wir, solange sie für den Dienst nötig sind oder du sie selbst entfernst.',
        ],
      },
      {
        heading: '6. Cookies und Browser-Speicher',
        paragraphs: [
          'Für die Anmeldung speichert der Browser ein Login-Token (localStorage/sessionStorage). Ohne diesen Speicher funktioniert der Login nicht.',
          'Werbe-Cookies sind standardmäßig aus. Erst nach „Erlauben“ darf Google AdSense auf den Seiten der Anzeigen Werbung einblenden. Die Entscheidung bleibt in diesem Browser gespeichert. Löschst du die Daten dieser Website, fragen wir erneut. Die Reichweitenmessung schaltet keine Werbe-Cookies frei.',
        ],
      },
      {
        heading: '7. Deine Rechte',
        paragraphs: [
          'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch sowie das Recht, eine Einwilligung zu widerrufen. Außerdem kannst du dich bei der österreichischen Datenschutzbehörde beschweren (dsb.gv.at).',
        ],
      },
      {
        heading: '8. Pflicht zur Bereitstellung',
        paragraphs: [
          'Ohne E-Mail und Passwort können wir kein Konto anlegen. Ohne Standortangabe bei einer Anzeige können wir sie nicht sinnvoll veröffentlichen.',
        ],
      },
      {
        heading: 'Kontakt zum Datenschutz',
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  impressum: {
    title: 'Impressum',
    sections: [
      {
        paragraphs: [SITE_OPERATOR.name, SITE_OPERATOR.addressLines.join('\n')],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
      {
        paragraphs: [
          'Kleinunternehmerin gemäß § 6 Abs. 1 Z 27 UStG.',
          'Es wird keine Umsatzsteuer berechnet. Der angegebene Preis ist der Endbetrag.',
          'Kostenpflichtig sind nur diese Zusatzleistungen: Top-Anzeige 4,99 € für 7 Tage, Profi-Profil 19,99 € für 30 Tage, Startseiten-Anzeige 99 € für 30 Tage.',
          'Top und Profi-Profil werden auf der Website bezahlt und beginnen erst nach erfolgreicher Zahlung. Ein Zahlungsbeleg geht an die E-Mail-Adresse des Kontos. Die Startseiten-Anzeige wird direkt verrechnet. Nach Ablauf des Zeitraums endet die Leistung automatisch.',
        ],
      },
    ],
  },
  werbung: {
    title: 'Werbung schalten',
    sections: [
      {
        paragraphs: [
          'Eine Top-Anzeige steht 7 Tage über den kostenlosen Anzeigen und kostet 4,99 €. Sie ist mit „Top · Anzeige“ als Werbung gekennzeichnet.',
          'Die Zahlung startest du im Konto unter Meine Anzeigen mit „Nach oben“. Es wird keine Umsatzsteuer ausgewiesen.',
        ],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  profi: {
    title: 'Profi-Profil',
    sections: [
      {
        paragraphs: [
          'Ein Profi-Profil zeigt Firma, Branche, Ort, Telefon und die eigenen Anzeigen. Es kostet 19,99 € für 30 Tage und steht in Services über privaten Anzeigen, gekennzeichnet als Firma.',
          'Anlegen und bezahlen kannst du es im Konto unter Profi-Profil. Einzelne Anzeigen bleiben kostenlos. Es wird keine Umsatzsteuer ausgewiesen.',
        ],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  kooperationen: {
    title: 'Kooperationen',
    sections: [
      {
        paragraphs: [
          'Ein Platz auf der Startseite für Oberösterreich kostet 99 € für 30 Tage. Der Preis ist fest, nicht pro Klick. Der Platz ist als Anzeige gekennzeichnet.',
          'Schreib uns, welches Angebot du zeigen möchtest. Vertrag, Rechnung und Bannerbild klären wir direkt. Es wird keine Umsatzsteuer ausgewiesen.',
        ],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  about: {
    title: 'Über NimmDa',
    sections: [
      {
        paragraphs: [
          'NimmDa ist ein lokaler Marktplatz für Oberösterreich. Ziel ist, dass Dinge und Hilfe in der Nähe bleiben: kaufen, verkaufen, verschenken, Dienstleistungen finden.',
          'Die Plattform ist bewusst regional. Standort und Umkreis stehen im Mittelpunkt — nicht ein österreichweites Versandportal.',
          'NimmDa wird von einer Kleinunternehmerin betrieben, ohne Umsatzsteuerausweis.',
        ],
      },
    ],
  },
  team: {
    title: 'Team',
    sections: [
      {
        paragraphs: [
          `${SITE_OPERATOR.name} entwickelt und betreibt NimmDa — Produkt, Technik und Support.`,
          'Für Presse, Feedback und Kooperationen erreichst du uns per E-Mail.',
        ],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  presse: {
    title: 'Presse',
    sections: [
      {
        paragraphs: [
          'Du berichtest über regionale Wirtschaft, Nachbarschaft oder Gründungen? Gerne stellen wir Informationen zu NimmDa zusammen.',
          'Bitte mit Redaktion, Medium und gewünschtem Termin schreiben.',
        ],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
    ],
  },
  kontakt: {
    title: 'Kontakt',
    sections: [
      {
        paragraphs: [SITE_OPERATOR.name, SITE_OPERATOR.addressLines.join('\n')],
        email: SITE_OPERATOR.email,
        emailLabel: 'E-Mail:',
      },
      {
        paragraphs: ['Wir lesen jede Nachricht und antworten so bald wie möglich.'],
      },
    ],
  },
};
