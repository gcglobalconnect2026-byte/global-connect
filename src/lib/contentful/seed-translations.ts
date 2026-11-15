import type { Locale } from "@/lib/locales";
import {
  doc,
  guideImage,
  heading2,
  hr,
  image,
  link,
  list,
  marked,
  orderedList,
  paragraph,
  quote,
  richParagraph,
  text,
  video,
} from "./seed";

/**
 * Translations for the bundled seed (`pnpm contentful:seed`).
 *
 * One key per language, then the same entry ids `seed.ts` uses, so the
 * seeder can merge them into the same upsert that writes the English values
 * — in one pass. Fields that are not localized (`slug`, flags, orders,
 * links, emoji) are deliberately absent: they are identical in every
 * language. Anything left out falls back to English at read time.
 *
 * Adding a language = a new key in this record (the seeder already maps the
 * site locale to its Contentful code).
 */
export type SeedTranslation = Record<string, unknown>;

/** Site locale → (entry id → field values in that language). */
export type SeedTranslations = Partial<
  Record<Locale, Record<string, SeedTranslation>>
>;

export const seedTranslations: SeedTranslations = {
  de: {
  // -------------------------------------------------------------------------
  // Opportunities
  // -------------------------------------------------------------------------
  "seed-opportunity-erasmus": {
    title: "Erasmus+ Jugendaustausch",
    country: "Portugal",
    type: "Austausch",
    description:
      "Zehn Tage mit jungen Menschen aus sechs Ländern rund um Klimaschutz und interkulturellen Dialog.",
    ageRange: "16–20 Jahre",
    funding: "Voll finanziert",
    deadline: "12. September",
    tags: ["Austausch", "Reisen", "Erasmus+"],
    longDescription: doc(
      paragraph(
        "Erasmus+ Jugendaustausche bringen Gruppen junger Menschen aus verschiedenen Ländern für ein kurzes, strukturiertes Programm zusammen – rund um ein gemeinsames Thema, von Klimaschutz über Menschenrechte bis zu digitalen Kompetenzen.",
      ),
      guideImage(
        "opp-erasmus-youth-exchange",
        "Junge Menschen arbeiten bei einem Erasmus+-Jugendaustausch in Portugal zusammen",
      ),
      heading2("Was du tatsächlich tust"),
      paragraph(
        "Du bist kein passiver Teilnehmer. Mit deiner Gruppe planst, gestaltest und reflektierst du Aktivitäten: Workshops, Exkursionen, kreative Formate und eine kleine lokale Aktion. Der Austausch wird von einer lokalen Organisation getragen, die Logistik, Unterkunft und die meisten Kosten übernimmt.",
      ),
      list([
        "Anreise und Unterkunft sind in der Regel vollständig über das Erasmus+-Stipendium gedeckt.",
        "Du arbeitest in Teams mit unterschiedlichen Nationalitäten – Englisch ist die gemeinsame Sprache.",
        "Eine Fachkraft für Jugendarbeit begleitet, aber das Programm entsteht gemeinsam mit den Teilnehmenden.",
      ]),
      heading2("Ist das etwas für dich?"),
      paragraph(
        "Wenn du zwischen 16 und 20 bist, dich für andere Kulturen interessierst und zehn Tage lang bereit bist, deine Komfortzone zu verlassen, ist das eine der wirkungsvollsten und kostengünstigsten Erfahrungen, die jungen Europäerinnen und Europäern offenstehen.",
      ),
    ),
  },
  "seed-opportunity-european-youth-programme": {
    title: "Europäisches Jugendprogramm",
    country: "Europa",
    type: "Programm",
    description:
      "Ein laufendes Programm mit Workshops, Policy-Labs und jugendgeleiteten Projekten in der EU.",
    ageRange: "15–21 Jahre",
    funding: "Kostenlos",
    deadline: "Laufend",
    tags: ["Programm", "Führung"],
    longDescription: doc(
      paragraph(
        "Das Europäische Jugendprogramm vernetzt junge Menschen in der EU mit fortlaufenden Workshops, Policy-Labs und kleinen, selbst beantragten Förderprojekten.",
      ),
      guideImage(
        "opp-european-youth-programme",
        "Teilnehmende bei einem Workshop des europäischen Jugendprogramms",
      ),
      heading2("So funktioniert es"),
      paragraph(
        "Anders als ein einmaliger Austausch ist das ein laufendes Format. Du nimmst an lokalen Terminen teil, arbeitest mit Peer-Gruppen aus anderen Ländern und kannst Mikrozuschüsse für eigene Jugendinitiativen beantragen.",
      ),
      list([
        "Kostenlos – finanziert über die EU-Jugendförderung.",
        "Baut direkt auf den EU-Jugendialog auf, dessen Empfehlungen Entscheidungsträger erreichen.",
        "Ein guter erster Schritt vor größeren Mobilitätsprogrammen.",
      ]),
    ),
  },
  "seed-opportunity-youth-leadership-conference": {
    title: "Youth Leadership Conference",
    country: "USA",
    type: "Konferenz",
    description:
      "Drei Tage Vorträge, Mentoring und Networking mit Schülerführern aus über 40 Ländern.",
    ageRange: "16–20 Jahre",
    funding: "Stipendium möglich",
    deadline: "30. Oktober",
    tags: ["Konferenz", "Führung"],
    longDescription: doc(
      paragraph(
        "Eine dreitägige Konferenz, auf der Schülerinnen und Schüler aus mehr als vierzig Ländern zeigen, woran sie arbeiten – und die Mentoren kennenlernen, die sie weiterbringen können.",
      ),
      guideImage(
        "opp-youth-leadership-conference",
        "Referierende auf der Bühne einer Jugendführungskonferenz",
      ),
      heading2("Was dich erwartet"),
      paragraph(
        "Keynotes, praktische Labs und strukturiertes Networking. Stipendien decken einen Teil oder die gesamten Teilnahmegebühren für ausgewählte Bewerberinnen und Bewerber ab.",
      ),
      quote(
        "Die Gespräche in den Fluren waren mehr wert als jeder einzelne Vortrag.",
      ),
    ),
  },
  "seed-opportunity-un-youth-volunteer": {
    title: "UN-Jugendfreiwilligenprogramm",
    country: "Schweiz",
    type: "Freiwilligenarbeit",
    description:
      "Bis zu 12 Monate bei UN-Organisationen in Friedens-, Entwicklungs- und humanitären Projekten.",
    ageRange: "18–26 Jahre",
    funding: "Voll finanziert",
    deadline: "Laufend",
    tags: ["Freiwilligenarbeit", "UN", "Entwicklung"],
    longDescription: doc(
      paragraph(
        "Das UN-Jugendfreiwilligenprogramm vermittelt junge Menschen für sechs bis zwölf Monate an UN-Organisationen und Partnerorganisationen – mit Aufgaben zu Friedenssicherung, Klima, Gesundheit und Bildung.",
      ),
      guideImage(
        "opp-un-youth-volunteer-programme",
        "Junge UN-Freiwillige arbeiten in einem Feldbüro zusammen",
      ),
      heading2("Was die Aufgabe beinhaltet"),
      paragraph(
        "Du unterstützt ein konkretes Projekt – Recherche, Kommunikation, Veranstaltungsorganisation oder Feldlogistik – zusammen mit erfahrenen Mitarbeitenden. Das ist echte Arbeit mit echter Verantwortung, keine Beobachtung.",
      ),
      list([
        "Unterhalt und Versicherung sind abgedeckt.",
        "Einsätze an Feldbüros und Hauptquartieren weltweit.",
        "Du wirst Teil einer globalen Kohorte junger Freiwilliger.",
      ]),
      heading2("Wer sollte sich bewerben"),
      paragraph(
        "Wenn du 18 bis 26 bist, gut Englisch sprichst und erste Erfahrungen in Freiwilligenarbeit oder einem entwicklungspolitischen Studium hast, ist das eine seltene Chance, früh auf UN-Ebene mitzuwirken.",
      ),
      quote(
        "Ich kam unsicher und ging mit einem Beruf, an den ich glaubte.",
      ),
    ),
  },
  "seed-opportunity-british-council-future-leaders": {
    title: "British Council Future Leaders",
    country: "Großbritannien",
    type: "Programm",
    description:
      "Ein einjähriges Führungsprogramm für Schülerinnen und Schüler aus dem Commonwealth.",
    ageRange: "16–21 Jahre",
    funding: "Kostenlos",
    deadline: "31. Januar",
    tags: ["Führung", "Programm"],
    longDescription: doc(
      paragraph(
        "Future Leaders ist ein Jahr voller Workshops, Mentoring und eines Sozialprojekts, das der British Council für ambitionierte Jugendliche aus dem Vereinigten Königreich und dem Commonwealth anbietet.",
      ),
      guideImage(
        "opp-british-council-future-leaders",
        "Jugendliche in einem Führungsworkshop des British Council",
      ),
      heading2("Das Jahr im Überblick"),
      paragraph(
        "Die Gruppen treffen sich monatlich online und zweimal persönlich. Du entwickelst mit einem kleinen Team ein Projekt und präsentierst es vor einem Gremium aus Partnern.",
      ),
      list([
        "Keine Gebühren – vollständig gefördert.",
        "Mentoren aus Wirtschaft, Politik und Kunst.",
        "Ein von britischen Universitäten anerkanntes Zertifikat.",
      ]),
      heading2("Ist das etwas für dich?"),
      paragraph(
        "Du musst nicht die Bestleistung deiner Klasse sein. Du brauchst Neugier, Beständigkeit und die Bereitschaft, mit Menschen zu arbeiten, die anders sind als du.",
      ),
      quote(
        "Ich habe mehr über mich gelernt als in jeder Prüfung.",
      ),
    ),
  },
  "seed-opportunity-afs-intercultural-exchange": {
    title: "AFS Interkultureller Austausch",
    country: "Deutschland",
    type: "Austausch",
    description:
      "Ein Schuljahr an einer deutschen Schule, bei einer Gastfamilie.",
    ageRange: "15–18 Jahre",
    funding: "Teilstipendium",
    deadline: "15. März",
    tags: ["Austausch", "Schule", "Deutschland"],
    longDescription: doc(
      paragraph(
        "AFS bringt dich für ein Schuljahr oder ein ganzes Jahr zu einer Gastfamilie und an eine lokale Schule – mitten hinein in den Alltag.",
      ),
      guideImage(
        "opp-afs-intercultural-exchange",
        "Austauschschülerin mit Gastfamilie in Deutschland",
      ),
      heading2("Leben im Austausch"),
      paragraph(
        "Du besuchst lokale Kurse, wirst Mitglied in Vereinen und Teil einer Familie. Eine Sprache lernt man am schnellsten, wenn man sie beim Abendessen benutzen muss.",
      ),
      list([
        "Gastfamilie und Schulplatz inklusive.",
        "Teilstipendien je nach Bedarf.",
        "Begleitung vor der Abreise und nach der Rückkehr.",
      ]),
      heading2("Was du mitnimmst"),
      paragraph(
        "Selbstständigkeit, eine zweite Sprache und eine Familie auf einem anderen Kontinent. Ehemalige beschreiben es als das Jahr, das ihre Richtung verändert hat.",
      ),
      quote(
        "Mein Gastbruder ist immer noch mein Bruder.",
      ),
    ),
  },
  "seed-opportunity-youth-exchange-green-deal": {
    title: "Jugendaustausch „Green Deal“",
    country: "Spanien",
    type: "Austausch",
    description:
      "Zehn Tage zu Klimaschutz und Biodiversität mit Jugendlichen aus acht Ländern.",
    ageRange: "16–20 Jahre",
    funding: "Voll finanziert",
    deadline: "20. April",
    tags: ["Austausch", "Klima", "Erasmus+"],
    longDescription: doc(
      paragraph(
        "Ein Green-Deal-Jugendaustausch bringt junge Menschen aus acht Ländern zusammen, um lokale Klimaaktionen zu planen und umzusetzen.",
      ),
      guideImage(
        "opp-youth-exchange-green-deal",
        "Junge Menschen pflanzen Bäume bei einem grünen Jugendaustausch",
      ),
      heading2("Das Programm"),
      paragraph(
        "Workshops zu Biodiversität und sozialer Transformation, danach ein kleines Projekt, das du mit deiner Gruppe im Gastort umsetzt.",
      ),
      list([
        "Anreise und Unterkunft über Erasmus+.",
        "Fokus auf praktische lokale Wirkung.",
        "Internationale Teams.",
      ]),
      heading2("Warum es zählt"),
      paragraph(
        "Klimaschutz wirkt riesig; dieser Austausch macht ihn lokal und gemeinsam. Du fährst mit Freunden und einem Projekt nach Hause, das du zu Hause weiterführen kannst.",
      ),
      quote(
        "Wir haben vierzig Bäume gepflanzt – und eine Gewohnheit, die ich behalten habe.",
      ),
    ),
  },
  "seed-opportunity-harvard-secondary-school": {
    title: "Harvard Secondary School Program",
    country: "USA",
    type: "Programm",
    description:
      "Ein richtiger Harvard-Kurs für Studiencredits – vor dem Studium.",
    ageRange: "15–18 Jahre",
    funding: "Bezahlt",
    deadline: "10. Mai",
    tags: ["Programm", "Studium", "USA"],
    longDescription: doc(
      paragraph(
        "Das Secondary School Program ermöglicht Schülerinnen und Schülern, Harvard-Kurse für Hochschulcredits zu belegen – online oder vor Ort.",
      ),
      guideImage(
        "opp-harvard-secondary-school-program",
        "Studierende auf dem Harvard-Campus",
      ),
      heading2("Was du studierst"),
      paragraph(
        "Wähle zwischen Schreiben, Wissenschaft, Wirtschaft und mehr. Du hörst Vorlesungen, gibst Arbeiten ab und sammelst anrechenbare Credits.",
      ),
      list([
        "Zwei Formate: vor Ort und online.",
        "Hochschulcredits werden vergeben.",
        "Unterricht durch Harvard-Dozentinnen und -Dozenten.",
      ]),
      heading2("Gut zu wissen"),
      paragraph(
        "Das Programm ist selektiv und nicht günstig, aber es gibt Finanzhilfen. Betrachte es als Probeaufnahme des Studienlebens, nicht als Ferienlager.",
      ),
      quote(
        "Ich habe erst durchs Tun gemerkt, dass mir Wirtschaft gefällt.",
      ),
    ),
  },
  "seed-opportunity-ka107-mobility": {
    title: "KA107 Internationale Mobilität",
    country: "Polen",
    type: "Austausch",
    description:
      "Kurzzeitiges Studien- oder Ausbildungspraktikum an einer Partnerhochschule im Ausland.",
    ageRange: "18–24 Jahre",
    funding: "Finanziert",
    deadline: "Laufend",
    tags: ["Austausch", "Universität", "Erasmus+"],
    longDescription: doc(
      paragraph(
        "KA107 fördert kurze Mobilitäten – von einer Woche bis zu einem Semester – zwischen Partnerhochschulen, häufig in und aus Nicht-EU-Ländern.",
      ),
      guideImage(
        "opp-ka107-international-mobility",
        "Internationale Studierende auf dem Campus einer Partnerhochschule",
      ),
      heading2("So funktioniert es"),
      paragraph(
        "Deine Hochschule unterzeichnet die Vereinbarung; du beantragst einen Platz, der zu deinem Studium passt. Ein Zuschuss deckt Reise- und Lebenskosten.",
      ),
      list([
        "Offen für Studierende und Beschäftigte.",
        "Benotet oder anerkannt von deiner Heimathochschule.",
        "Baut Partnernetzwerke auf.",
      ]),
      heading2("Früh bewerben"),
      paragraph(
        "Die Plätze sind begrenzt und werden je Ausschreibung vergeben. Sprich vor der Frist mit deinem International Office – nicht danach.",
      ),
      quote(
        "Zwei Wochen in Warschau haben meinen ganzen Plan verändert.",
      ),
    ),
  },
  "seed-opportunity-one-young-world": {
    title: "One Young World Summit",
    country: "Großbritannien",
    type: "Konferenz",
    description:
      "Jährlicher Gipfel, auf dem junge Führungskräfte Persönlichkeiten treffen und Lösungen vorstellen.",
    ageRange: "18–30 Jahre",
    funding: "Stipendium möglich",
    deadline: "30. Juni",
    tags: ["Konferenz", "Führung"],
    longDescription: doc(
      paragraph(
        "One Young World bringt junge Führungskräfte aus über 190 Ländern für einige intensive Tage mit Präsidentinnen, Aktivisten und CEOs zusammen.",
      ),
      guideImage(
        "opp-one-young-world-summit",
        "Referierende auf der Bühne des One-Young-World-Gipfels",
      ),
      heading2("Vor Ort"),
      paragraph(
        "Plenardiskussionen, Workshops und die Chance, die eigene Initiative Menschen vorzustellen, die sie finanzieren oder ausbauen können.",
      ),
      list([
        "Stipendien decken viele Delegierte ab.",
        "Mentoring durch Branchenführerinnen und -führer.",
        "Ein globales Alumni-Netzwerk.",
      ]),
      heading2("Nach dem Gipfel"),
      paragraph(
        "Die Delegierten kehren mit Kontakten und Auftrag zurück. Viele starten Projekte mit Menschen, die sie im Flur kennengelernt haben.",
      ),
      quote(
        "Ich habe eine Idee vorgestellt und drei Mitgründer gefunden.",
      ),
    ),
  },
  "seed-opportunity-iucn-youth-advisory": {
    title: "IUCN Jugendbeirat",
    country: "Remote",
    type: "Programm",
    description:
      "Die IUCN zu Jugend- und Naturschutzpolitik beraten – vollständig remote.",
    ageRange: "18–28 Jahre",
    funding: "Unbezahlt",
    deadline: "Laufend",
    tags: ["Programm", "Natur", "Remote"],
    longDescription: doc(
      paragraph(
        "Der IUCN Jugendbeirat holt junge Menschen in globale Gespräche über Natur- und Artenschutzpolitik ein.",
      ),
      guideImage(
        "opp-iucn-youth-advisory",
        "Junge Naturschutzakteure in einem Videocall",
      ),
      heading2("Deine Rolle"),
      paragraph(
        "Du prüfst Konsultationen, bringst Jugendperspektiven ein und arbeitst in Arbeitsgruppen mit – alles remote und mit flexiblen Zeiten.",
      ),
      list([
        "Vollständig remote.",
        "Echter Einfluss auf Politik.",
        "Netzwerk aus dem Naturschutz.",
      ]),
      heading2("Das passt, wenn"),
      paragraph(
        "Du dich für Biodiversität interessierst und klar schreiben kannst. Die Stelle ist unbezahlt, öffnet aber Türen für Umweltkarrieren.",
      ),
      quote(
        "Mein Kommentar landete in einem Positionspapier.",
      ),
    ),
  },
  "seed-opportunity-spacex-stem-camp": {
    title: "SpaceX STEM-Camp",
    country: "USA",
    type: "Programm",
    description:
      "Zwei Wochen Raketenbau und Programmieren für Jugendliche.",
    ageRange: "14–17 Jahre",
    funding: "Stipendium möglich",
    deadline: "15. Juli",
    tags: ["Programm", "STEM", "USA"],
    longDescription: doc(
      paragraph(
        "Ein Sommercamp, in dem Jugendliche echte Projekte bauen, programmieren und starten – gemeinsam mit Ingenieurinnen, Ingenieuren und Mentoren.",
      ),
      guideImage(
        "opp-spacex-stem-camp",
        "Jugendliche bauen eine kleine Rakete auf einem STEM-Camp",
      ),
      heading2("Was du baust"),
      paragraph(
        "Teams entwerfen eine Nutzlast, schreiben den Code und fliegen ihn. Fehlschläge gehören dazu; Debuggen ist die Lektion.",
      ),
      list([
        "Praxis statt Vorlesungen.",
        "Stipendien auf Antrag.",
        "Mentoren aus der Branche.",
      ]),
      heading2("Wer profitiert"),
      paragraph(
        "Neugierige Jugendliche, die gern Dinge bauen. Keine Vorkenntnisse nötig – nur Ausdauer.",
      ),
      quote(
        "Unsere Rakete flog beim dritten Versuch. Bester Tag.",
      ),
    ),
  },
  "seed-opportunity-adb-youth-internship": {
    title: "ADB Jugendpraktikum",
    country: "Philippinen",
    type: "Praktikum",
    description:
      "Praktikum bei der Asiatischen Entwicklungsbank in Entwicklungsprojekten.",
    ageRange: "19–25 Jahre",
    funding: "Bezahlt",
    deadline: "1. August",
    tags: ["Praktikum", "Entwicklung", "Asien"],
    longDescription: doc(
      paragraph(
        "Das ADB-Jugendpraktikum vermittelt Studierende nach Manila oder in Feldbüros, wo sie bei Armutsbekämpfung und Infrastruktur mitarbeiten.",
      ),
      guideImage(
        "opp-adb-youth-internship",
        "Praktikantinnen und Praktikanten im Büro der Asiatischen Entwicklungsbank",
      ),
      heading2("Die Arbeit"),
      paragraph(
        "Du unterstützt Recherche, Daten und Veranstaltungen zu echten Krediten und Zuschüssen in Asien.",
      ),
      list([
        "Bezahlt, Vollzeit.",
        "Vor Ort in Manila oder remote.",
        "Offen für verschiedene Fachrichtungen.",
      ]),
      heading2("Vor der Bewerbung"),
      paragraph(
        "Zeige passende Kurse oder ehrenamtliches Engagement und ein klares Interesse an Entwicklungszusammenarbeit. Ein kurzer, konkreter Anschlag schlägt ein langes Standardschreiben.",
      ),
      quote(
        "Ich habe gesehen, wie aus einem Kredit eine Klinik wird.",
      ),
    ),
  },
  "seed-opportunity-soros-equality-fellowship": {
    title: "Soros Equality Fellowship",
    country: "Ungarn",
    type: "Fellowship",
    description:
      "Ein gefördertes Stipendium für junge Aktivisten einer offenen Gesellschaft.",
    ageRange: "20–30 Jahre",
    funding: "Finanziert",
    deadline: "1. September",
    tags: ["Fellowship", "Aktivismus"],
    longDescription: doc(
      paragraph(
        "Das Equality Fellowship unterstützt junge Menschen, die lokale Projekte zu Rechten, Inklusion und verantwortlichen Institutionen leiten.",
      ),
      guideImage(
        "opp-soros-equality-fellowship",
        "Junge Aktivisten in einem Strategie-Workshop",
      ),
      heading2("Das Fellowship"),
      paragraph(
        "Du bekommst ein Stipendium, Trainings und eine Peer-Gruppe, um ein Projekt weiterzubringen, das dir schon wichtig ist.",
      ),
      list([
        "Stipendium inklusive.",
        "Trainings und Mentoring.",
        "Flexibel, projektbezogen.",
      ]),
      heading2("Beste Voraussetzungen"),
      paragraph(
        "Bewerberinnen und Bewerber mit einem laufenden Vorhaben und einer klaren Bitte. Das Fellowship verstärkt, es erfindet nichts.",
      ),
      quote(
        "Sie haben die Arbeit gefördert, die ich sowieso schon machte.",
      ),
    ),
  },
  "seed-opportunity-roots-and-shoots-grant": {
    title: "Roots & Shoots Zuschuss",
    country: "Weltweit",
    type: "Zuschuss",
    description:
      "Kleine Zuschüsse für jugendgeleitete Umweltprojekte.",
    ageRange: "16–25 Jahre",
    funding: "Zuschuss",
    deadline: "15. Oktober",
    tags: ["Zuschuss", "Umwelt"],
    longDescription: doc(
      paragraph(
        "Roots & Shoots vergibt kleine Zuschüsse an Gruppen junger Menschen, die lokale Umwelt- oder Gemeinschaftsprojekte umsetzen.",
      ),
      guideImage(
        "opp-roots-and-shoots-grant",
        "Junge Menschen räumen einen lokalen Fluss auf",
      ),
      heading2("Mit Plan bewerben"),
      paragraph(
        "Du reichst einen einfachen Plan, ein Budget und ein Team ein. Die Mittel fließen direkt in die Aktivität, nicht in Verwaltung.",
      ),
      list([
        "Kleine, schnelle Zuschüsse.",
        "Für Gruppen, nicht für Einzelne.",
        "Jedes Umwelthema.",
      ]),
      heading2("Tipps"),
      paragraph(
        "Konkret, lokal und messbar gewinnt. Eine Flussreinigung mit Zahl schlägt vages „Sensibilisieren“.",
      ),
      quote(
        "Zweihundert Euro haben einen ganzen Strand geräumt.",
      ),
    ),
  },
  "seed-opportunity-ted-ed-club": {
    title: "TED-Ed Club",
    country: "Weltweit",
    type: "Programm",
    description:
      "Führe einen Club an, der dir hilft, deinen eigenen TED-Vortrag zu schreiben und zu halten.",
    ageRange: "13–18 Jahre",
    funding: "Kostenlos",
    deadline: "Laufend",
    tags: ["Programm", "Reden", "Online"],
    longDescription: doc(
      paragraph(
        "Ein TED-Ed Club ist ein Weg über ein Schuljahr hinweg: recherchieren, schreiben und einen lohnenden Vortrag halten.",
      ),
      guideImage(
        "opp-ted-ed-club",
        "Eine Schülerin hält einen Vortrag im TED-Stil",
      ),
      heading2("Der Bogen"),
      paragraph(
        "Du wählst eine Frage, entwickelst die Idee und probst sie. Der finale Vortrag kann gefilmt und geteilt werden.",
      ),
      list([
        "Kostenloses Lehrmaterial.",
        "In der Schule oder online.",
        "Baut schnell Selbstvertrauen auf.",
      ]),
      heading2("Warum mitmachen"),
      paragraph(
        "Redeangst sinkt, wenn dir die Idee gehört. Du gehst mit einem Vortrag, auf den du stolz bist.",
      ),
      quote(
        "Endlich habe ich das gesagt, was ich meine.",
      ),
    ),
  },
  "seed-opportunity-world-heritage-volunteers": {
    title: "World Heritage Volunteers",
    country: "Italien",
    type: "Freiwilligenarbeit",
    description:
      "Konservierungscamps an UNESCO-Stätten in ganz Europa.",
    ageRange: "18–30 Jahre",
    funding: "Finanziert",
    deadline: "Laufend",
    tags: ["Freiwilligenarbeit", "Kulturerbe", "Europa"],
    longDescription: doc(
      paragraph(
        "WHV-Camps bringen Freiwillige an Kulturerbestätten für praktische Konservierungs- und Vermittlungsarbeit.",
      ),
      guideImage(
        "opp-world-heritage-volunteers",
        "Freiwillige restaurieren eine historische Mauer in Italien",
      ),
      heading2("Campalltag"),
      paragraph(
        "Eine Woche praktische Arbeit, Abendvorträge und ein Team aus vielen Ländern.",
      ),
      list([
        "Kost und Logis inklusive.",
        "Orte in ganz Europa.",
        "Keine Vorkenntnisse nötig.",
      ]),
      heading2("Die Mitnahme"),
      paragraph(
        "Du schützt etwas Altes und triffst Menschen, die es genauso wichtig finden wie du.",
      ),
      quote(
        "Ich habe eine Mauer repariert, die älter ist als mein Land.",
      ),
    ),
  },
  "seed-opportunity-eyf-project-grant": {
    title: "EYF Projektförderung",
    country: "Frankreich",
    type: "Zuschuss",
    description:
      "Zuschüsse der Europäischen Jugendstiftung für internationale Jugendaktivitäten.",
    ageRange: "15–30 Jahre",
    funding: "Zuschuss",
    deadline: "30. November",
    tags: ["Zuschuss", "Europa", "Jugend"],
    longDescription: doc(
      paragraph(
        "Die EYF fördert internationale Aktivitäten von Jugend-NGOs – Austausche, Trainings und Kampagnen.",
      ),
      guideImage(
        "opp-eyf-project-grant",
        "Junge Organisatoren bei einem Jugendprojekt-Treffen",
      ),
      heading2("Was gefördert wird"),
      paragraph(
        "Du bewirbst dich als Gruppe mit klarer Aktivität und Budget. Gefördert wird die Aktivität, nicht Gehälter.",
      ),
      list([
        "Für Jugendorganisationen.",
        "Internationaler Fokus.",
        "Transparente Kriterien.",
      ]),
      heading2("Wie du gewinnst"),
      paragraph(
        "Ein realistisches Budget und eine europäische Dimension. Zeige, wer davon profitiert – nicht nur, was ihr vorhabt.",
      ),
      quote(
        "Unser erster Zuschuss hat dreißig Zugtickets bezahlt.",
      ),
    ),
  },

  // -------------------------------------------------------------------------
  // Sessions
  // -------------------------------------------------------------------------
  "seed-session-speaking-club": {
    title: "Global English Speaking Club",
    description:
      "Wöchentliches Gesprächstraining mit Mitgliedern aus einem Dutzend Ländern. Noten gibt es nicht, Druck auch nicht.",
    duration: "60 Min.",
    difficulty: "Alle Level",
  },
  "seed-session-tech-ai": {
    title: "Technologie- & KI-Workshop",
    description:
      "Praktische Einführung in die Werkzeuge, die Lernen, Arbeiten und Kreativität 2026 prägen.",
    duration: "90 Min.",
    difficulty: "Einsteiger",
  },
  "seed-session-entrepreneurship": {
    title: "Entrepreneurship-Session",
    description:
      "Von der ersten Idee zu den ersten Nutzern – erzählt von Gründerinnen und Gründern, die vor zwanzig begonnen haben.",
    duration: "75 Min.",
    difficulty: "Mittelstufe",
  },
  "seed-session-intl-opportunities": {
    title: "Workshop internationale Möglichkeiten",
    description:
      "Wie Austausche, Stipendien und Konferenzen wirklich funktionieren – und wie du ausgewählt wirst.",
    duration: "60 Min.",
    difficulty: "Alle Level",
  },
  "seed-session-global-debate-club": {
    title: "Global Debate Club",
    description:
      "Wöchentlich strukturierte Debatten zu Weltthemen. Lernen, zu argumentieren – und zuzuhören.",
    duration: "60 Min.",
    difficulty: "Alle Level",
  },
  "seed-session-university-prep": {
    title: "Vorbereitung aufs Studium",
    description:
      "Schritt für Schritt Hilfe bei Bewerbungen, Essays und Fristen.",
    duration: "90 Min.",
    difficulty: "Einsteiger",
  },
  "seed-session-creative-writing": {
    title: "Kreatives Schreiben",
    description:
      "Teile Entwürfe, erhalte freundliches Feedback, finde deine Stimme.",
    duration: "60 Min.",
    difficulty: "Alle Level",
  },
  "seed-session-mental-health": {
    title: "Mentale Gesundheit & Wohlbefinden",
    description:
      "Ehrliches Gespräch über Stress, Lernen und gesund bleiben.",
    duration: "75 Min.",
    difficulty: "Alle Level",
  },
  "seed-session-coding-beginners": {
    title: "Programmieren für Anfänger",
    description: "Deine ersten Python-Zeilen – Vorkenntnisse nicht nötig.",
    duration: "90 Min.",
    difficulty: "Einsteiger",
  },
  "seed-session-model-un": {
    title: "Model-UN-Session",
    description: "Die UN simulieren und eine echte Resolution verhandeln.",
    duration: "120 Min.",
    difficulty: "Mittelstufe",
  },
  "seed-session-career-fair": {
    title: "Career-Fair-Treffen",
    description:
      "Lerne Organisationen kennen, die junges Talent über Grenzen hinweg suchen.",
    duration: "90 Min.",
    difficulty: "Alle Level",
  },
  "seed-session-art-culture": {
    title: "Kunst- & Kulturaustausch",
    description:
      "Zeig deine Kultur und lerne eine andere beim Gestalten kennen.",
    duration: "60 Min.",
    difficulty: "Alle Level",
  },
  "seed-session-science-talks": {
    title: "Science-Talk-Reihe",
    description: "Junge Forschende erklären ihre Arbeit einfach.",
    duration: "45 Min.",
    difficulty: "Alle Level",
  },
  "seed-session-volunteer-stories": {
    title: "Abend der Freiwilligengeschichten",
    description:
      "Rückkehrende Freiwillige erzählen, was sie verändert hat.",
    duration: "60 Min.",
    difficulty: "Alle Level",
  },

  // -------------------------------------------------------------------------
  // Guides
  // -------------------------------------------------------------------------
  "seed-guide-motivation-letter": {
    title: "So schreibst du ein Motivationsschreiben",
    excerpt:
      "Ein praktischer Leitfaden für ein Motivationsschreiben, das deine Bewerbung auffallen lässt.",
    body: doc(
      paragraph(
        "Das Motivationsschreiben ist der einzige Teil deiner Bewerbung, in dem du wie ein Mensch klingst und nicht wie eine Liste von Noten. Auswahlgremien lesen täglich dutzende Schreiben – deine Aufgabe ist es, konkret, ehrlich und merkbar zu sein, nicht im allgemeinen Sinne beeindruckend.",
      ),
      guideImage(
        "how-to-write-a-motivation-letter",
        "Jemand schreibt am Laptop ein Motivationsschreiben",
      ),
      heading2("Beginne mit dem Warum, nicht mit dem Lebenslauf"),
      paragraph(
        "Starte mit dem konkreten Moment, in dem diese Möglichkeit für dich wichtig wurde. Ein Projekt, das du geleitet hast, eine Frage, die du nicht loswurdest, eine Gemeinschaft, der du dienen willst. Gremien lesen deine Erfolge woanders – sie brauchen den Faden, der sie verbindet.",
      ),
      heading2("Eine Struktur, die funktioniert"),
      list([
        "Absatz 1 – der konkrete Grund deiner Bewerbung, als eine Geschichte.",
        "Absatz 2 – was du mitbringst (Fähigkeiten, Erfahrung, Perspektive).",
        "Absatz 3 – was du danach damit tun willst und warum es zählt.",
        "Schluss – eine ruhige, sichere Zusammenfassung der Passung.",
      ]),
      heading2("Streiche den leeren Kram"),
      paragraph(
        "Lösche „Ich bin ein sehr leidenschaftlicher und fleißiger Mensch.“ Zeige die Leidenschaft durch die Geschichte und die Arbeit durch das Beispiel. Jedes Adjektiv braucht eine Tatsache dahinter.",
      ),
      quote(
        "Die besten Schreiben, die ich lese, sind die, in denen ich eine echte Stimme höre – keine Vorlage.",
      ),
      heading2("Vor dem Absenden"),
      list([
        "Lies es laut vor – wenn du an einem Satz hängst, schreib ihn um.",
        "Prüfe den Programmnamen und jede gestellte Frage.",
        "Eine Seite. Immer. Respektiere die Zeit der Lesenden.",
      ]),
    ),
  },
  "seed-guide-scholarships": {
    title: "So findest du Stipendien",
    excerpt:
      "Wo Stipendiengeld liegt – und wie du eines zu deinem Profil findest.",
    body: doc(
      paragraph(
        "Die meisten Stipendien sind nicht die berühmten, umkämpften, auf die sich alle bewerben. Sie sind kleiner, lokal und für ein bestimmtes Profil gedacht – dein Land, dein Fach, dein Geschlecht, dein Hobby. Der Trick ist dort zu suchen, wo andere es nicht tun.",
      ),
      guideImage(
        "how-to-find-scholarships",
        "Eine Studentin recherchiert online Stipendien",
      ),
      heading2("Suche über das Offensichtliche hinaus"),
      list([
        "Fachbereiche der Hochschulen verwalten oft Stipendien, die nicht auf der Hauptseite stehen – schreibe die Koordination an.",
        "Botschaften und Kulturinstitute fördern Studien in ihrer Sprache oder ihrem Land.",
        "Unternehmen fördern Talentpipelines in Ingenieurwesen, Landwirtschaft, Gesundheit.",
        "Lokale Wohlfahrtsverbände und Diaspora-Vereine unterstützen Studierende aus deiner Region.",
      ]),
      heading2("Gezielt bewerben statt massenhaft"),
      paragraph(
        "Eine gezielte Bewerbung auf drei passende Stipendien schlägt fünfzig kopierte. Bau dir eine einfache Tabelle: Frist, Voraussetzungen, was sie wollen, was du hast. Bewirb dich, wo die Überschneidung echt ist.",
      ),
      quote(
        "Das Stipendium, das ich gewonnen habe, hing nur am Aushang in der Physikflur.",
      ),
    ),
  },
  "seed-guide-erasmus": {
    title: "So funktioniert Erasmus+",
    excerpt:
      "Das Mobilitätsprogramm der EU erklärt – von der Bewerbung bis zur Rückkehr.",
    body: doc(
      paragraph(
        "Erasmus+ ist das EU-Programm für Bildung, Ausbildung, Jugend und Sport. Für junge Menschen bedeutet das vor allem Studienaustausche, Praktika im Ausland und Jugendaustausche – mit teilweise oder vollständig gedeckten Reise- und Lebenskosten.",
      ),
      guideImage(
        "how-erasmus-works",
        "Studierende aus verschiedenen Ländern beim Erasmus+-Austausch",
      ),
      heading2("Die Hauptwege"),
      list([
        "Studienmobilität – ein Semester an einer Partnerhochschule verbringen.",
        "Praktikum – ein Praktikum im Ausland, oft zwischen den Studienjahren.",
        "Jugendaustausche – kurze Gruppenprogramme zu einem Thema, das dir wichtig ist.",
      ]),
      heading2("Geld und Papierkram"),
      paragraph(
        "Deine Heimatinstitution kümmert sich um den Zuschuss und die Lernvereinbarung. Bewahre beide Dokumente auf; der Zuschuss wird in Raten ausgezahlt, und die letzte hängt davon ab, dass du deine Aufenthaltsbestätigung vollständig einreichst.",
      ),
      heading2("Nach der Rückkehr"),
      paragraph(
        "Erasmus+ kommt gut im Lebenslauf an und öffnet oft Türen zu Praktika und Masterprogrammen. Das Netzwerk, das du aufbaust, ist der Teil, den am Anfang alle unterschätzen.",
      ),
      quote(
        "Ich bin für ein Semester gefahren und kam mit einer zweiten Sprache und einem Jobkontakt zurück.",
      ),
    ),
  },
  "seed-guide-interview": {
    title: "So bereitest du dich auf ein Vorstellungsgespräch vor",
    excerpt:
      "Was dich erwartet, was du üben sollst und wie du die knappen Fragen beantwortest.",
    body: doc(
      paragraph(
        "Vorstellungsgespräche belohnen Vorbereitung mehr als rohes Talent. Wer natürlich wirkt, hat in der Regel die langweiligen Teile so lange geprobt, bis sie automatisch laufen.",
      ),
      video(
        "seed-video-interview-prep",
        "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        "Interview-Vorbereitung",
        "Ein kompakter Überblick, was dich erwartet und wie du dich auf dein nächstes Gespräch vorbereitest.",
      ),
      guideImage(
        "how-to-prepare-for-an-interview",
        "Eine Kandidatin bereitet sich auf ein Vorstellungsgespräch vor",
      ),
      heading2("Vor dem Gespräch"),
      list([
        "Recherchiere die Mission der Organisation, nicht nur ihre Produkte.",
        "Bereite drei Geschichten im Muster Situation – Handlung – Ergebnis vor.",
        "Hab eine scharfe Frage bereit, die zeigt, dass du dich vorbereitet hast.",
      ]),
      heading2("Die schwierigen Fragen"),
      paragraph(
        "Bei „Nennen Sie eine Schwäche“ nimm etwas Echtes, an dem du arbeitest, und sag wie. Bei „Warum wir“ benenne das Einzige, was nur diese Organisation bietet. Stille ist in Ordnung – denke zwei Sekunden nach, bevor du sprichst.",
      ),
      quote(
        "Ich habe aufgehört, beeindrucken zu wollen, und angefangen, konkret zu sein. Das hat alles verändert.",
      ),
    ),
  },
  "seed-guide-cv": {
    title: "So baust du deinen ersten Lebenslauf",
    excerpt:
      "Ein Lebenslauf, der auffällt, wenn du erst am Anfang stehst – mit Vorlagen.",
    body: doc(
      paragraph(
        "Ohne Berufserfahrung ist dein Lebenslauf der Beweis, wie du denkst und Dinge zu Ende bringst. Projekte, Ehrenamt und Schularbeiten zählen – rahme sie als Dinge, die du verantwortet und abgeschlossen hast.",
      ),
      video(
        "seed-video-cv-tips",
        "https://www.youtube.com/watch?v=lv8TasO-EV4",
        "Tipps für den Lebenslauf",
        "Sieh dir diesen Durchgang an: einen klaren, wirkungsvollen Lebenslauf von Grund auf erstellen.",
      ),
      guideImage(
        "how-to-build-your-first-cv",
        "Ein klarer, gut strukturierter erster Lebenslauf auf dem Bildschirm",
      ),
      heading2("Abschnitte mit Gewicht"),
      list([
        "Bildung – mit besonderen Fächern oder Auszeichnungen.",
        "Projekte – verlinke das Repository, das Video, die Arbeit.",
        "Verantwortung – ein Verein, ein Team, eine Schicht, der man dir anvertraut hat.",
        "Fähigkeiten – ehrlich beim Niveau (grundlegend / sicher / fließend).",
      ]),
      heading2("Formate-Regeln"),
      paragraph(
        "Eine Seite, klare Überschriften, kein Foto, sofern nicht verlangt. Nutze dieselbe Zeitform. Exportiere als PDF, damit es überall korrekt dargestellt wird. Nenne die Datei vorname-nachname-lebenslauf.pdf, nicht final_final2.pdf.",
      ),
      quote(
        "Personalverantwortliche schauen zuerst zehn Sekunden lang. Lass das obere Drittel die Arbeit machen.",
      ),
    ),
  },
  "seed-guide-intl-programmes": {
    title: "So bewirbst du dich auf internationale Programme",
    excerpt:
      "Schritt für Schritt durch den Bewerbungsprozess für internationale Möglichkeiten.",
    body: doc(
      paragraph(
        "Internationale Programme wirken einschüchternd, weil die Schritte unbekannt sind – nicht weil sie schwer sind. Zerlege den Ablauf in Etappen und behandle jede als kleine Aufgabe mit eigener Frist.",
      ),
      guideImage(
        "how-to-apply-for-international-programmes",
        "Eine Weltkarte mit Stecknadeln für internationale Möglichkeiten",
      ),
      heading2("Die Bewerbungstreppe"),
      list([
        "Voraussetzungen – prüfe, ob du qualifiziert bist, bevor du eine Stunde in Formulare investierst.",
        "Dokumente – Reisepass, Zeugnisse, Sprachnachweise, Referenzen.",
        "Motivation – ein Schreiben, pro Programm angepasst, nie kopiert.",
        "Einreichung – früh hochladen; Portale crashen in der letzten Nacht.",
        "Nachfassen – Gesprächsdaten notieren und Spam-Ordner im Blick behalten.",
      ]),
      heading2("Häufige Fehler"),
      paragraph(
        "Die Frist in der lokalen Zeitzone verpassen, das Wortlimit ignorieren und dasselbe Schreiben an zwei Programme schicken, die sich gegenseitig nennen. Gremien bemerken das.",
      ),
      quote(
        "Ich habe meine erste Frist um sechs Minuten verpasst. Seitdem lasse ich nichts mehr so knapp.",
      ),
      heading2("Wenn du eine Absage bekommst"),
      paragraph(
        "Die meisten erfolgreichen Bewerberinnen und Bewerber wurden zuerst abgelehnt. Bitte um Feedback, verbessere den schwachen Teil und bewirb dich in der nächsten Runde oder beim nächsten Programm. Ausdauer schlägt Perfektion.",
      ),
    ),
  },
  "seed-guide-studying-abroad": {
    title: "So bereitest du dich auf ein Auslandsstudium vor",
    excerpt:
      "Eine praktische Checkliste für die Monate vor der Abreise – Formalitäten, Budget, Packen und Mindset.",
    body: doc(
      paragraph(
        "Ein Auslandsstudium verändert, wie du die Welt siehst – und wie die Welt dich sieht. Aber zwischen der Vorfreude und dem Abreisedatum liegt ein Berg an Logistik. Dieser Leitfaden zerlegt den Ablauf in überschaubare Schritte, damit du vorbereitet und nicht panisch ankommst.",
      ),
      image(
        "asset-studying-abroad-1",
        "/guides/asset-studying-abroad-1.jpg",
        "Studierender mit Koffer am Abflugbereich eines Flughafens",
      ),
      heading2("Vor der Abreise"),
      richParagraph(
        text("Dein "),
        marked("Motivationsschreiben", ["bold"]),
        text(" und "),
        marked("Lebenslauf", ["italic"]),
        text(
          " sind die Dokumente, die die meisten Programme zuerst verlangen. ",
        ),
        marked("Beginne früh", ["underline"]),
        text(" – "),
        marked("Fristen", ["code"]),
        text(" kommen schneller, als du denkst."),
      ),
      heading2("Die Formalitäten-Checkliste"),
      list([
        "Reisepass – Gültigkeit für mindestens sechs Monate nach dem Rückflug prüfen.",
        "Visum – beantragen, sobald die Zusage da ist.",
        "Versicherung – die meisten Programme verlangen einen Nachweis der Krankenversicherung.",
        "Bankkarte – eine reisefreundliche Karte mit geringen Gebühren besorgen, bevor du losfährst.",
      ]),
      heading2("Geld: Was ein Auslandsstudium wirklich kostet"),
      richParagraph(
        text(
          "Die Preise unterscheiden sich zwischen Städten stark. Nutze diese kostenlosen Werkzeuge, um echte Zahlen zu prüfen, bevor du dich festlegst: ",
        ),
        link(
          "https://www.numbeo.com/cost-of-living/",
          "Numbeo Cost of Living",
        ),
        text(
          " (Miete, Lebensmittel, Transport pro Stadt), ",
        ),
        link("https://www.expatistan.com/cost-of-living", "Expatistan"),
        text(" (Städte im direkten Vergleich) und "),
        link(
          "https://worldpopulationreview.com/country-rankings/cost-of-living-by-country",
          "World Population Review",
        ),
        text(
          " (Länderweiter Kostenindex für über 180 Länder).",
        ),
      ),
      paragraph(
        "Kostenvergleich – Lissabon: Miete 1.100 €/Monat, Mahlzeiten 15 €, Transport 40 €, Cappuccino 2,80 €.",
      ),
      paragraph(
        "Kostenvergleich – Berlin: Miete 1.200 €/Monat, Mahlzeiten 13 €, Transport 49 €, Cappuccino 3,50 €.",
      ),
      paragraph(
        "Kostenvergleich – Bangkok: Miete ca. 370 $/Monat, Mahlzeiten ca. 3 $, Transport ca. 30 $, Cappuccino ca. 2,50 $.",
      ),
      paragraph(
        "Kostenvergleich – New York: Miete ca. 3.000 $/Monat, Mahlzeiten ca. 25 $, Transport ca. 127 $, Cappuccino ca. 5,50 $.",
      ),
      richParagraph(
        text(
          "Rechenbeispiel (Lissabon): Miete 1.100 € + Lebensmittel 250 € + Transport 40 € + Telefon/Nebenkosten 120 € + Freizeit 150 € ≈ ",
        ),
        marked("1.660 €/Monat", ["bold"]),
        text(
          ". Prüfe die aktuellen Werte vor der Budgetierung immer auf Numbeo oder Expatistan – die Preise ändern sich von Jahr zu Jahr.",
        ),
      ),
      image(
        "asset-studying-abroad-2",
        "/guides/asset-studying-abroad-2.jpg",
        "Eine Budgettabelle, die Lebenskosten in verschiedenen Städten vergleicht",
      ),
      quote(
        "Ich habe in meinem ersten Monat in London mehr für Kaffee ausgegeben als in drei Monaten in Bangkok für Transport.",
      ),
      heading2("Packen, in dieser Reihenfolge"),
      orderedList([
        "Zuerst Dokumente – Reisepass, Versicherung, Zusage, gedruckte Kopien von allem.",
        "Medikamente und Adapter – klein, leicht zu vergessen, teuer im Ausland zu ersetzen.",
        "Kleidung zuletzt – lokal kaufen, wo es günstiger ist (Thailand, Vietnam und Portugal haben alle erschwingliche Läden).",
      ]),
      hr(),
      heading2("Eine Mustererste Woche"),
      richParagraph(
        marked("Tag 1: ", ["bold"]),
        text("Schlüssel abholen und beim lokalen Amt anmelden. "),
        marked("Tag 2: ", ["bold"]),
        text("Ein "),
        marked("lokales Bankkonto", ["underline"]),
        text(" eröffnen – das spart Gebühren. Tag 3: "),
        marked("SIM-Karte kaufen", ["code"]),
        text(
          " und Mobilzahlungen einrichten. Tag 4–7: Einführung, die Stadt erkunden und den Lieblings-Supermarkt finden.",
        ),
      ),
      image(
        "asset-studying-abroad-3",
        "/guides/asset-studying-abroad-3.jpg",
        "Studierende erkunden in der ersten Woche eine neue Stadt",
      ),
      quote(
        "Die erste Woche wirkt überwältigend. In der dritten Woche hast du eine Routine und ein Lieblingscafé. Vertraue dem Prozess.",
      ),
    ),
  },

  // -------------------------------------------------------------------------
  // Videos (embedded in guide bodies)
  // -------------------------------------------------------------------------
  "seed-video-cv-tips": {
    title: "Tipps für den Lebenslauf",
    caption:
      "Sieh dir diesen Durchgang an: einen klaren, wirkungsvollen Lebenslauf von Grund auf erstellen.",
  },
  "seed-video-interview-prep": {
    title: "Interview-Vorbereitung",
    caption:
      "Ein kompakter Überblick, was dich erwartet und wie du dich auf dein nächstes Gespräch vorbereitest.",
  },

  // -------------------------------------------------------------------------
  // Stories
  // -------------------------------------------------------------------------
  "seed-story-lera": {
    quote:
      "Vielen Dank an Global Connect und besonders an Zlata Shevtsova, die Gründerin! Durch deinen Kanal habe ich den Erasmus+-Austausch entdeckt und konnte nach Portugal gehen. Eine unglaubliche Erfahrung!",
    location: "Portugal",
    role: "Global-Connect-Mitglied",
  },
  "seed-story-maxim": {
    quote:
      "Ich wusste nie, dass Englisch sprechen so viel Spaß machen kann! Die Sprechclubs von Global Connect haben das Üben richtig angenehm gemacht.",
    location: "Sprechclubs",
    role: "Global-Connect-Mitglied",
  },
  "seed-story-alice": {
    quote:
      "Ich bewundere die großartigen Möglichkeiten, die Global Connect mit uns teilt. Eine tolle Plattform, um Neues zu entdecken und den Anstoß zum Handeln zu bekommen.",
    location: "Globales Mitglied",
    role: "Global-Connect-Mitglied",
  },
  "seed-story-daria": {
    quote:
      "Global Connect hat mir gezeigt, dass Möglichkeiten im Ausland nicht nur für die „anderen“ da sind. Ich habe mich beworben – und ich bin gefahren.",
    location: "Deutschland",
    role: "Global-Connect-Mitglied",
  },
  "seed-story-tom": {
    quote:
      "Die Sessions haben mir das Selbstvertrauen gegeben, ohne Angst auf Englisch zu sprechen. Heute moderiere ich selbst eine.",
    location: "Irland",
    role: "Sprechclub-Moderation",
  },
  "seed-story-amina": {
    quote:
      "Ich habe ein Stipendium gefunden, von dem ich nie wusste, dass es existiert – drei Straßen von meinem Haus entfernt, ausgeschrieben an meiner Schule.",
    location: "Kenia",
    role: "Global-Connect-Mitglied",
  },
  "seed-story-lucas": {
    quote:
      "Meine erste Konferenz kam mir unmöglich vor, bis mich ein Mentor von Global Connect durchgebracht hat.",
    location: "Brasilien",
    role: "Global-Connect-Mitglied",
  },
  "seed-story-yuki": {
    quote:
      "Ein Austausch in Spanien hat mir in einem Monat mehr Spanisch beigebracht als die Schule in Jahren.",
    location: "Japan",
    role: "Austausch-Alumna",
  },
  "seed-story-noor": {
    quote:
      "Ich habe mit Freunden aus einer Session ein kleines Klimaprojekt gestartet. Es läuft noch immer.",
    location: "Niederlande",
    role: "Projektleitung",
  },
  "seed-story-elias": {
    quote:
      "Die Community hat mich nach zwei Absagen weitergemacht. Die dritte Bewerbung hat geklappt.",
    location: "Griechenland",
    role: "Global-Connect-Mitglied",
  },

  // -------------------------------------------------------------------------
  // Path steps
  // -------------------------------------------------------------------------
  "seed-step-discover": {
    title: "Entdecken",
    description: "Eine Möglichkeit finden",
  },
  "seed-step-understand": {
    title: "Verstehen",
    description: "Voraussetzungen und Anforderungen prüfen",
  },
  "seed-step-prepare": {
    title: "Vorbereiten",
    description: "Leitfäden, Sessions und Mentoring nutzen",
  },
  "seed-step-apply": {
    title: "Bewerben",
    description: "Den offiziellen Bewerbungsprozess durchlaufen",
  },
  "seed-step-grow": {
    title: "Wachsen",
    description:
      "Mit der Community vernetzen und das Nächste entdecken",
  },

  // -------------------------------------------------------------------------
  // Interests
  // -------------------------------------------------------------------------
  "seed-interest-study": { label: "Im Ausland studieren" },
  "seed-interest-travel": { label: "Reisen & Austausch" },
  "seed-interest-tech": { label: "Technologie" },
  "seed-interest-research": { label: "Forschung" },
  "seed-interest-startup": { label: "Unternehmertum" },
  "seed-interest-speaking": { label: "Präsentieren & Reden" },
  "seed-interest-competitions": { label: "Wettbewerbe" },
  "seed-interest-volunteering": { label: "Ehrenamt" },

  // -------------------------------------------------------------------------
  // Cities
  // -------------------------------------------------------------------------
  "seed-city-kyiv": { city: "Kyjiw" },
  "seed-city-lisbon": { city: "Lissabon" },
  "seed-city-warsaw": { city: "Warschau" },
  "seed-city-berlin": { city: "Berlin" },

  // -------------------------------------------------------------------------
  // Homepage sections
  // -------------------------------------------------------------------------
  "seed-homepage-hero": {
    eyebrow: "Für junge Menschen, überall",
    title: "Deine nächste globale Chance beginnt hier.",
    description:
      "Entdecke internationale Möglichkeiten, lerne von Expertinnen und Experten, gewinne Sicherheit und vernetze dich mit jungen Menschen weltweit.",
    imageAlt:
      "Junge Menschen aus verschiedenen Ländern lachen gemeinsam auf einem Campus",
  },
  "seed-homepage-opportunity-finder": {
    eyebrow: "Möglichkeiten finden",
    title: "Finde eine Möglichkeit, die wirklich zu dir passt.",
    description:
      "Hör auf, durch Möglichkeiten zu scrollen, auf die du dich nicht bewerben kannst.",
  },
  "seed-homepage-path": {
    eyebrow: "Der Weg",
    title: "So funktioniert Global Connect",
  },
  "seed-homepage-sessions": {
    eyebrow: "Online-Sessions",
    title: "Lernen. Sprechen. Vernetzen.",
    description:
      "Stärke die Fähigkeiten und das Selbstvertrauen für deinen nächsten globalen Schritt.",
    imageAlt:
      "Eine junge Frau macht sich Notizen während einer Online-Session von Global Connect",
  },
  "seed-homepage-guides": {
    eyebrow: "Ratgeber",
    title: "Finde nicht nur Möglichkeiten. Lerne, wie du sie bekommst.",
  },
  "seed-homepage-stories": {
    eyebrow: "Geschichten von Studierenden",
    title: "Echte Menschen. Echte Möglichkeiten. Echtes Wachstum.",
    description:
      "Echte Erfahrungen von jungen Menschen, die Möglichkeiten entdecken, Sicherheit gewinnen und sich mit der Welt verbinden.",
  },
  "seed-homepage-community": {
    eyebrow: "Community",
    title: "Du machst das nicht allein.",
    description:
      "Global Connect ist mehr als eine Liste von Möglichkeiten. Hier bereiten sich junge Menschen gemeinsam vor, teilen, was funktioniert hat, und machen nach der ersten Absage weiter.",
    imageAlt:
      "Junge Menschen aus verschiedenen Ländern sitzen im Kreis und unterhalten sich",
  },
  "seed-homepage-discovery": {
    eyebrow: "Personalisierte Vorschläge",
    title: "Wovon träumst du?",
    description:
      "Sag uns, worauf du dich interessierst – wir helfen dir, einen Einstieg zu finden.",
  },
  "seed-homepage-partners": {
    title: "Gemeinsam mit Menschen, die an junge Menschen glauben.",
  },
  "seed-homepage-final-cta": {
    title: "Die Welt ist größer, als du denkst.",
    description: "Deine nächste Möglichkeit ist vielleicht nur eine Suche entfernt.",
  },
  },
};
