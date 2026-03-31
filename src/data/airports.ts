/**
 * Lokale airport reference dataset.
 *
 * Velden:
 *   icao  – 4-letter ICAO code (altijd aanwezig)
 *   iata  – 3-letter IATA code (leeg string "" als niet van toepassing)
 *   name  – officiële of gangbare luchthavennaam
 *   city  – stad of regio (optioneel, voor toekomstig gebruik)
 *
 * Uitbreiding: voeg gewoon een regel toe aan de AIRPORTS array.
 * Intern worden bij module-load twee Maps opgebouwd (ICAO→Airport, IATA→Airport).
 *
 * Dekking: Europa (nadruk op NL/BE/DE/UK/FR/ES), Midden-Oosten, Noord-Amerika,
 * Azië en de meest gevlogen internationale bestemmingen vanuit Nederland.
 */

export interface Airport {
  icao: string;
  iata: string;
  name: string;
  city?: string;
}

export const AIRPORTS: Airport[] = [
  // ── Nederland ─────────────────────────────────────────────────────────────
  { icao: "EHAM", iata: "AMS", name: "Amsterdam Schiphol",          city: "Amsterdam" },
  { icao: "EHRD", iata: "RTM", name: "Rotterdam The Hague Airport", city: "Rotterdam" },
  { icao: "EHEH", iata: "EIN", name: "Eindhoven Airport",           city: "Eindhoven" },
  { icao: "EHGG", iata: "GRQ", name: "Groningen Airport Eelde",     city: "Groningen" },
  { icao: "EHMZ", iata: "MST", name: "Maastricht Aachen Airport",   city: "Maastricht" },

  // ── België ────────────────────────────────────────────────────────────────
  { icao: "EBBR", iata: "BRU", name: "Brussels Airport",            city: "Brussel" },
  { icao: "EBCI", iata: "CRL", name: "Brussels South Charleroi",    city: "Charleroi" },
  { icao: "EBOS", iata: "OST", name: "Ostend-Bruges Airport",       city: "Oostende" },
  { icao: "EBLG", iata: "LGG", name: "Liège Airport",              city: "Luik" },

  // ── Duitsland ─────────────────────────────────────────────────────────────
  { icao: "EDDF", iata: "FRA", name: "Frankfurt am Main Airport",   city: "Frankfurt" },
  { icao: "EDDM", iata: "MUC", name: "München Airport",            city: "München" },
  { icao: "EDDB", iata: "BER", name: "Berlin Brandenburg Airport",  city: "Berlijn" },
  { icao: "EDDH", iata: "HAM", name: "Hamburg Airport",             city: "Hamburg" },
  { icao: "EDDS", iata: "STR", name: "Stuttgart Airport",           city: "Stuttgart" },
  { icao: "EDDK", iata: "CGN", name: "Cologne Bonn Airport",        city: "Keulen" },
  { icao: "EDDL", iata: "DUS", name: "Düsseldorf Airport",         city: "Düsseldorf" },
  { icao: "EDDN", iata: "NUE", name: "Nuremberg Airport",           city: "Neurenberg" },
  { icao: "EDDP", iata: "LEJ", name: "Leipzig/Halle Airport",       city: "Leipzig" },
  { icao: "EDDC", iata: "DRS", name: "Dresden Airport",             city: "Dresden" },
  { icao: "EDDV", iata: "HAJ", name: "Hannover Airport",            city: "Hannover" },
  { icao: "EDHI", iata: "HAM", name: "Hamburg Finkenwerder",        city: "Hamburg" },

  // ── Verenigd Koninkrijk ───────────────────────────────────────────────────
  { icao: "EGLL", iata: "LHR", name: "London Heathrow",             city: "Londen" },
  { icao: "EGKK", iata: "LGW", name: "London Gatwick",              city: "Londen" },
  { icao: "EGGW", iata: "LTN", name: "London Luton Airport",        city: "Luton" },
  { icao: "EGSS", iata: "STN", name: "London Stansted",             city: "Stansted" },
  { icao: "EGCC", iata: "MAN", name: "Manchester Airport",          city: "Manchester" },
  { icao: "EGPF", iata: "GLA", name: "Glasgow Airport",             city: "Glasgow" },
  { icao: "EGPH", iata: "EDI", name: "Edinburgh Airport",           city: "Edinburgh" },
  { icao: "EGBB", iata: "BHX", name: "Birmingham Airport",          city: "Birmingham" },
  { icao: "EGNX", iata: "EMA", name: "East Midlands Airport",       city: "Nottingham" },
  { icao: "EGGD", iata: "BRS", name: "Bristol Airport",             city: "Bristol" },
  { icao: "EGAA", iata: "BFS", name: "Belfast International",       city: "Belfast" },
  { icao: "EGAC", iata: "BHD", name: "George Best Belfast City",    city: "Belfast" },
  { icao: "EGAE", iata: "LDY", name: "City of Derry Airport",       city: "Derry" },

  // ── Ierland ───────────────────────────────────────────────────────────────
  { icao: "EIDW", iata: "DUB", name: "Dublin Airport",              city: "Dublin" },
  { icao: "EICK", iata: "ORK", name: "Cork Airport",                city: "Cork" },

  // ── Frankrijk ─────────────────────────────────────────────────────────────
  { icao: "LFPG", iata: "CDG", name: "Paris Charles de Gaulle",     city: "Parijs" },
  { icao: "LFPO", iata: "ORY", name: "Paris Orly",                  city: "Parijs" },
  { icao: "LFLL", iata: "LYS", name: "Lyon-Saint Exupéry Airport", city: "Lyon" },
  { icao: "LFMN", iata: "NCE", name: "Nice Côte d'Azur Airport",   city: "Nice" },
  { icao: "LFBO", iata: "TLS", name: "Toulouse-Blagnac Airport",    city: "Toulouse" },
  { icao: "LFRS", iata: "NTE", name: "Nantes Atlantique Airport",   city: "Nantes" },
  { icao: "LFRB", iata: "BES", name: "Brest Bretagne Airport",      city: "Brest" },
  { icao: "LFBD", iata: "BOD", name: "Bordeaux-Mérignac Airport",  city: "Bordeaux" },
  { icao: "LFML", iata: "MRS", name: "Marseille Provence Airport",  city: "Marseille" },
  { icao: "LFST", iata: "SXB", name: "Strasbourg Airport",          city: "Straatsburg" },

  // ── Spanje ────────────────────────────────────────────────────────────────
  { icao: "LEMD", iata: "MAD", name: "Madrid Barajas Airport",      city: "Madrid" },
  { icao: "LEBL", iata: "BCN", name: "Barcelona El Prat Airport",   city: "Barcelona" },
  { icao: "LEPA", iata: "PMI", name: "Palma de Mallorca Airport",   city: "Palma" },
  { icao: "GCLP", iata: "LPA", name: "Gran Canaria Airport",        city: "Las Palmas" },
  { icao: "GCTS", iata: "TFS", name: "Tenerife South Airport",      city: "Tenerife" },
  { icao: "GCXO", iata: "TFN", name: "Tenerife North Airport",      city: "Tenerife" },
  { icao: "LEAL", iata: "ALC", name: "Alicante-Elche Airport",      city: "Alicante" },
  { icao: "LEMG", iata: "AGP", name: "Málaga-Costa del Sol Airport",city: "Málaga" },
  { icao: "LEVC", iata: "VLC", name: "Valencia Airport",            city: "Valencia" },
  { icao: "LEZL", iata: "SVQ", name: "Sevilla Airport",             city: "Sevilla" },
  { icao: "LEBG", iata: "RGS", name: "Burgos Airport",              city: "Burgos" },
  { icao: "GCFV", iata: "FUE", name: "Fuerteventura Airport",       city: "Fuerteventura" },
  { icao: "GCHI", iata: "VDE", name: "El Hierro Airport",           city: "El Hierro" },
  { icao: "GCLM", iata: "ACE", name: "Lanzarote Airport",           city: "Lanzarote" },
  { icao: "GCLA", iata: "SPC", name: "La Palma Airport",            city: "La Palma" },

  // ── Portugal ──────────────────────────────────────────────────────────────
  { icao: "LPPT", iata: "LIS", name: "Lisbon Humberto Delgado Airport", city: "Lissabon" },
  { icao: "LPPR", iata: "OPO", name: "Porto Airport",               city: "Porto" },
  { icao: "LPFR", iata: "FAO", name: "Faro Airport",                city: "Faro" },
  { icao: "LPPD", iata: "PDL", name: "Ponta Delgada Airport",       city: "Azoren" },
  { icao: "LPMA", iata: "FNC", name: "Madeira Airport",             city: "Funchal" },

  // ── Italië ────────────────────────────────────────────────────────────────
  { icao: "LIRF", iata: "FCO", name: "Rome Fiumicino Airport",      city: "Rome" },
  { icao: "LIMC", iata: "MXP", name: "Milan Malpensa Airport",      city: "Milaan" },
  { icao: "LIML", iata: "LIN", name: "Milan Linate Airport",        city: "Milaan" },
  { icao: "LIME", iata: "BGY", name: "Milan Bergamo Airport",       city: "Bergamo" },
  { icao: "LIPZ", iata: "VCE", name: "Venice Marco Polo Airport",   city: "Venetië" },
  { icao: "LIRN", iata: "NAP", name: "Naples International Airport",city: "Napels" },
  { icao: "LICC", iata: "CTA", name: "Catania-Fontanarossa Airport",city: "Catania" },
  { icao: "LICJ", iata: "PMO", name: "Palermo Airport",             city: "Palermo" },
  { icao: "LIBR", iata: "BRI", name: "Brindisi Airport",            city: "Brindisi" },
  { icao: "LIRQ", iata: "FLR", name: "Florence Airport",            city: "Florence" },
  { icao: "LIPB", iata: "BZO", name: "Bolzano Airport",             city: "Bolzano" },

  // ── Zwitserland & Oostenrijk ──────────────────────────────────────────────
  { icao: "LSZH", iata: "ZRH", name: "Zürich Airport",             city: "Zürich" },
  { icao: "LSGG", iata: "GVA", name: "Geneva Airport",              city: "Genève" },
  { icao: "LSZB", iata: "BRN", name: "Bern Airport",                city: "Bern" },
  { icao: "LOWW", iata: "VIE", name: "Vienna International Airport",city: "Wenen" },
  { icao: "LOWI", iata: "INN", name: "Innsbruck Airport",           city: "Innsbruck" },
  { icao: "LOWG", iata: "GRZ", name: "Graz Airport",                city: "Graz" },
  { icao: "LOWS", iata: "SZG", name: "Salzburg Airport",            city: "Salzburg" },

  // ── Scandinavië ───────────────────────────────────────────────────────────
  { icao: "EKCH", iata: "CPH", name: "Copenhagen Airport",          city: "Kopenhagen" },
  { icao: "EKBI", iata: "BLL", name: "Billund Airport",             city: "Billund" },
  { icao: "ENGM", iata: "OSL", name: "Oslo Gardermoen Airport",     city: "Oslo" },
  { icao: "ENKR", iata: "KKN", name: "Kirkenes Airport",            city: "Kirkenes" },
  { icao: "ESSA", iata: "ARN", name: "Stockholm Arlanda Airport",   city: "Stockholm" },
  { icao: "ESGG", iata: "GOT", name: "Gothenburg Landvetter Airport",city:"Göteborg" },
  { icao: "ESMS", iata: "MMX", name: "Malmö Airport",               city: "Malmö" },
  { icao: "EFHK", iata: "HEL", name: "Helsinki-Vantaa Airport",     city: "Helsinki" },
  { icao: "BIKF", iata: "KEF", name: "Reykjavik Keflavik Airport",  city: "Reykjavik" },

  // ── Oost-Europa ───────────────────────────────────────────────────────────
  { icao: "EPWA", iata: "WAW", name: "Warsaw Chopin Airport",       city: "Warschau" },
  { icao: "EPKK", iata: "KRK", name: "Kraków John Paul II Airport", city: "Kraków" },
  { icao: "EPGD", iata: "GDN", name: "Gdańsk Lech Wałęsa Airport",city: "Gdańsk" },
  { icao: "LKPR", iata: "PRG", name: "Prague Václav Havel Airport",city: "Praag" },
  { icao: "LHBP", iata: "BUD", name: "Budapest Ferenc Liszt Airport",city:"Budapest" },
  { icao: "LZIB", iata: "BTS", name: "Bratislava Airport",          city: "Bratislava" },
  { icao: "LROP", iata: "OTP", name: "Bucharest Henri Coandă Airport",city:"Boekarest" },
  { icao: "LRCL", iata: "CLJ", name: "Cluj-Napoca International",   city: "Cluj" },
  { icao: "LGAV", iata: "ATH", name: "Athens International Airport",city: "Athene" },
  { icao: "LGTS", iata: "SKG", name: "Thessaloniki Airport",        city: "Thessaloniki" },
  { icao: "LGKR", iata: "CFU", name: "Corfu International Airport", city: "Corfu" },
  { icao: "LGRP", iata: "RHO", name: "Rhodes Diagoras Airport",     city: "Rhodos" },
  { icao: "LGIR", iata: "HER", name: "Heraklion Nikos Kazantzakis",city: "Heraklion" },
  { icao: "LTFM", iata: "IST", name: "Istanbul Airport",            city: "Istanbul" },
  { icao: "LTBA", iata: "SAW", name: "Istanbul Sabiha Gökçen",     city: "Istanbul" },
  { icao: "LTAC", iata: "ESB", name: "Ankara Esenboğa Airport",    city: "Ankara" },
  { icao: "LTAI", iata: "AYT", name: "Antalya Airport",             city: "Antalya" },
  { icao: "LTBS", iata: "DLM", name: "Dalaman Airport",             city: "Dalaman" },
  { icao: "LTBJ", iata: "ADB", name: "Izmir Adnan Menderes Airport",city:"Izmir" },
  { icao: "UUEE", iata: "SVO", name: "Moscow Sheremetyevo Airport", city: "Moskou" },
  { icao: "UUDD", iata: "DME", name: "Moscow Domodedovo Airport",   city: "Moskou" },
  { icao: "UKBB", iata: "KBP", name: "Kyiv Boryspil Airport",       city: "Kyiv" },
  { icao: "LDZA", iata: "ZAG", name: "Zagreb Airport",              city: "Zagreb" },
  { icao: "LYBE", iata: "BEG", name: "Belgrade Nikola Tesla Airport",city:"Belgrado" },
  { icao: "LJLJ", iata: "LJU", name: "Ljubljana Jože Pučnik Airport",city:"Ljubljana" },

  // ── Midden-Oosten ─────────────────────────────────────────────────────────
  { icao: "OMDB", iata: "DXB", name: "Dubai International Airport", city: "Dubai" },
  { icao: "OMDW", iata: "DWC", name: "Al Maktoum International",    city: "Dubai" },
  { icao: "OMAA", iata: "AUH", name: "Abu Dhabi International",     city: "Abu Dhabi" },
  { icao: "OTBD", iata: "DOH", name: "Doha Hamad International",    city: "Doha" },
  { icao: "OEJN", iata: "JED", name: "King Abdulaziz International",city: "Jeddah" },
  { icao: "OERK", iata: "RUH", name: "Riyadh King Khalid Airport",  city: "Riyad" },
  { icao: "OJAI", iata: "AMM", name: "Queen Alia International",    city: "Amman" },
  { icao: "OLBA", iata: "BEY", name: "Beirut Rafic Hariri Airport", city: "Beiroet" },
  { icao: "LLBG", iata: "TLV", name: "Tel Aviv Ben Gurion Airport", city: "Tel Aviv" },
  { icao: "OKBK", iata: "KWI", name: "Kuwait International Airport",city: "Kuwait" },

  // ── Noord-Afrika ──────────────────────────────────────────────────────────
  { icao: "HECA", iata: "CAI", name: "Cairo International Airport", city: "Caïro" },
  { icao: "DTTA", iata: "TUN", name: "Tunis-Carthage Airport",      city: "Tunis" },
  { icao: "DAAG", iata: "ALG", name: "Houari Boumediene Airport",   city: "Algiers" },
  { icao: "GMMN", iata: "CMN", name: "Casablanca Mohammed V Airport",city:"Casablanca" },
  { icao: "GMME", iata: "RBA", name: "Rabat-Salé Airport",          city: "Rabat" },
  { icao: "GMTT", iata: "TNG", name: "Tangier Ibn Battouta Airport",city: "Tanger" },
  { icao: "GMFM", iata: "RAK", name: "Marrakech Menara Airport",    city: "Marrakech" },
  { icao: "GMFO", iata: "OUD", name: "Oujda Angads Airport",        city: "Oujda" },

  // ── Noord-Amerika ─────────────────────────────────────────────────────────
  { icao: "KJFK", iata: "JFK", name: "New York JFK",                city: "New York" },
  { icao: "KEWR", iata: "EWR", name: "Newark Liberty International",city: "Newark" },
  { icao: "KLGA", iata: "LGA", name: "New York LaGuardia",          city: "New York" },
  { icao: "KLAX", iata: "LAX", name: "Los Angeles International",   city: "Los Angeles" },
  { icao: "KORD", iata: "ORD", name: "Chicago O'Hare International",city: "Chicago" },
  { icao: "KATL", iata: "ATL", name: "Atlanta Hartsfield-Jackson",  city: "Atlanta" },
  { icao: "KDFW", iata: "DFW", name: "Dallas/Fort Worth International",city:"Dallas" },
  { icao: "KBOS", iata: "BOS", name: "Boston Logan International",  city: "Boston" },
  { icao: "KMIA", iata: "MIA", name: "Miami International Airport", city: "Miami" },
  { icao: "KSFO", iata: "SFO", name: "San Francisco International", city: "San Francisco" },
  { icao: "KIAD", iata: "IAD", name: "Washington Dulles International",city:"Washington" },
  { icao: "KDCA", iata: "DCA", name: "Washington Reagan National",  city: "Washington" },
  { icao: "CYYZ", iata: "YYZ", name: "Toronto Pearson International",city:"Toronto" },
  { icao: "CYVR", iata: "YVR", name: "Vancouver International Airport",city:"Vancouver" },
  { icao: "CYUL", iata: "YUL", name: "Montréal-Trudeau Airport",   city: "Montreal" },

  // ── Azië & Pacific ────────────────────────────────────────────────────────
  { icao: "VHHH", iata: "HKG", name: "Hong Kong International Airport",city:"Hongkong" },
  { icao: "WSSS", iata: "SIN", name: "Singapore Changi Airport",    city: "Singapore" },
  { icao: "RJTT", iata: "HND", name: "Tokyo Haneda Airport",        city: "Tokio" },
  { icao: "RJAA", iata: "NRT", name: "Tokyo Narita Airport",        city: "Tokio" },
  { icao: "RKSI", iata: "ICN", name: "Seoul Incheon International", city: "Seoul" },
  { icao: "VTBS", iata: "BKK", name: "Bangkok Suvarnabhumi Airport",city: "Bangkok" },
  { icao: "VTBD", iata: "DMK", name: "Bangkok Don Mueang Airport",  city: "Bangkok" },
  { icao: "ZBAA", iata: "PEK", name: "Beijing Capital International",city:"Peking" },
  { icao: "ZBAD", iata: "PKX", name: "Beijing Daxing International",city:"Peking" },
  { icao: "ZSPD", iata: "PVG", name: "Shanghai Pudong International",city:"Shanghai" },
  { icao: "ZSSS", iata: "SHA", name: "Shanghai Hongqiao International",city:"Shanghai" },
  { icao: "ZGGG", iata: "CAN", name: "Guangzhou Baiyun International",city:"Guangzhou" },
  { icao: "RPLL", iata: "MNL", name: "Manila Ninoy Aquino International",city:"Manila" },
  { icao: "WADD", iata: "DPS", name: "Bali Ngurah Rai International",city:"Bali" },
  { icao: "WIII", iata: "CGK", name: "Jakarta Soekarno-Hatta",      city: "Jakarta" },
  { icao: "VOMM", iata: "MAA", name: "Chennai International Airport",city:"Chennai" },
  { icao: "VOBL", iata: "BLR", name: "Bangalore Kempegowda Airport",city:"Bangalore" },
  { icao: "VIDP", iata: "DEL", name: "Delhi Indira Gandhi Airport", city: "Delhi" },
  { icao: "VABB", iata: "BOM", name: "Mumbai Chhatrapati Shivaji",  city: "Mumbai" },
  { icao: "YSSY", iata: "SYD", name: "Sydney Kingsford Smith Airport",city:"Sydney" },
  { icao: "YMML", iata: "MEL", name: "Melbourne Airport",           city: "Melbourne" },
  { icao: "NZAA", iata: "AKL", name: "Auckland Airport",            city: "Auckland" },

  // ── Sub-Sahara Afrika ─────────────────────────────────────────────────────
  { icao: "FAOR", iata: "JNB", name: "Johannesburg O.R. Tambo International",city:"Johannesburg" },
  { icao: "FACT", iata: "CPT", name: "Cape Town International Airport",city:"Kaapstad" },
  { icao: "HAAB", iata: "ADD", name: "Addis Ababa Bole International",city:"Addis Abeba" },
  { icao: "DNAA", iata: "ABV", name: "Abuja Nnamdi Azikiwe International",city:"Abuja" },
  { icao: "DNMM", iata: "LOS", name: "Lagos Murtala Muhammed International",city:"Lagos" },
  { icao: "DIAP", iata: "ABJ", name: "Abidjan Félix Houphouët-Boigny",city:"Abidjan" },
  { icao: "FMMI", iata: "TNR", name: "Antananarivo Ivato International",city:"Antananarivo" },
];
