import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    console.log('Database already initialized');
    return db;
  }

  console.log('Initializing database...');
  try {
    db = await SQLite.openDatabaseAsync('guesstheflag.db');
    console.log('Database opened successfully');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        region TEXT,
        difficulty INTEGER,
        flag_file TEXT NOT NULL
      );
    `);
    console.log('Table created/verified');

    // Check if data exists
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM countries',
    );
    console.log('Country count:', result?.count);

    if (result && result.count === 0) {
      console.log('Seeding countries...');
      await seedCountries(db);
      console.log('Countries seeded');
    }

    console.log('Database initialization complete');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    db = null;
    throw error;
  }
};

const seedCountries = async (database: SQLite.SQLiteDatabase) => {
  const countries = [
    { name: 'Afghanistan', region: 'Asia', difficulty: 3, flag_file: 'af.png' },
    { name: 'Albania', region: 'Europe', difficulty: 2, flag_file: 'al.png' },
    { name: 'Algeria', region: 'Africa', difficulty: 2, flag_file: 'dz.png' },
    { name: 'Andorra', region: 'Europe', difficulty: 3, flag_file: 'ad.png' },
    { name: 'Angola', region: 'Africa', difficulty: 2, flag_file: 'ao.png' },
    {
      name: 'Antigua and Barbuda',
      region: 'North America',
      difficulty: 4,
      flag_file: 'ag.png',
    },
    {
      name: 'Argentina',
      region: 'South America',
      difficulty: 1,
      flag_file: 'ar.png',
    },
    { name: 'Armenia', region: 'Asia', difficulty: 3, flag_file: 'am.png' },
    {
      name: 'Australia',
      region: 'Oceania',
      difficulty: 1,
      flag_file: 'au.png',
    },
    { name: 'Austria', region: 'Europe', difficulty: 1, flag_file: 'at.png' },
    { name: 'Azerbaijan', region: 'Asia', difficulty: 3, flag_file: 'az.png' },
    {
      name: 'Bahamas',
      region: 'North America',
      difficulty: 3,
      flag_file: 'bs.png',
    },
    { name: 'Bahrain', region: 'Asia', difficulty: 3, flag_file: 'bh.png' },
    { name: 'Bangladesh', region: 'Asia', difficulty: 2, flag_file: 'bd.png' },
    {
      name: 'Barbados',
      region: 'North America',
      difficulty: 4,
      flag_file: 'bb.png',
    },
    { name: 'Belarus', region: 'Europe', difficulty: 2, flag_file: 'by.png' },
    { name: 'Belgium', region: 'Europe', difficulty: 1, flag_file: 'be.png' },
    {
      name: 'Belize',
      region: 'North America',
      difficulty: 3,
      flag_file: 'bz.png',
    },
    { name: 'Benin', region: 'Africa', difficulty: 3, flag_file: 'bj.png' },
    { name: 'Bhutan', region: 'Asia', difficulty: 3, flag_file: 'bt.png' },
    {
      name: 'Bolivia',
      region: 'South America',
      difficulty: 2,
      flag_file: 'bo.png',
    },
    {
      name: 'Bosnia and Herzegovina',
      region: 'Europe',
      difficulty: 3,
      flag_file: 'ba.png',
    },
    { name: 'Botswana', region: 'Africa', difficulty: 2, flag_file: 'bw.png' },
    {
      name: 'Brazil',
      region: 'South America',
      difficulty: 1,
      flag_file: 'br.png',
    },
    { name: 'Brunei', region: 'Asia', difficulty: 3, flag_file: 'bn.png' },
    { name: 'Bulgaria', region: 'Europe', difficulty: 2, flag_file: 'bg.png' },
    {
      name: 'Burkina Faso',
      region: 'Africa',
      difficulty: 3,
      flag_file: 'bf.png',
    },
    { name: 'Burundi', region: 'Africa', difficulty: 3, flag_file: 'bi.png' },
    {
      name: 'Cabo Verde',
      region: 'Africa',
      difficulty: 3,
      flag_file: 'cv.png',
    },
    { name: 'Cambodia', region: 'Asia', difficulty: 2, flag_file: 'kh.png' },
    { name: 'Cameroon', region: 'Africa', difficulty: 2, flag_file: 'cm.png' },
    {
      name: 'Canada',
      region: 'North America',
      difficulty: 1,
      flag_file: 'ca.png',
    },
    {
      name: 'Central African Republic',
      region: 'Africa',
      difficulty: 4,
      flag_file: 'cf.png',
    },
    { name: 'Chad', region: 'Africa', difficulty: 3, flag_file: 'td.png' },
    {
      name: 'Chile',
      region: 'South America',
      difficulty: 1,
      flag_file: 'cl.png',
    },
    { name: 'China', region: 'Asia', difficulty: 1, flag_file: 'cn.png' },
    {
      name: 'Colombia',
      region: 'South America',
      difficulty: 1,
      flag_file: 'co.png',
    },
    { name: 'Comoros', region: 'Africa', difficulty: 4, flag_file: 'km.png' },
    { name: 'Congo', region: 'Africa', difficulty: 4, flag_file: 'cg.png' },
    {
      name: 'Democratic Republic of the Congo',
      region: 'Africa',
      difficulty: 4,
      flag_file: 'cd.png',
    },
    {
      name: 'Costa Rica',
      region: 'North America',
      difficulty: 2,
      flag_file: 'cr.png',
    },
    {
      name: 'Côte d’Ivoire',
      region: 'Africa',
      difficulty: 3,
      flag_file: 'ci.png',
    },
    { name: 'Croatia', region: 'Europe', difficulty: 2, flag_file: 'hr.png' },
    {
      name: 'Cuba',
      region: 'North America',
      difficulty: 2,
      flag_file: 'cu.png',
    },
    { name: 'Cyprus', region: 'Asia', difficulty: 3, flag_file: 'cy.png' },
    { name: 'Czechia', region: 'Europe', difficulty: 2, flag_file: 'cz.png' },
    { name: 'Denmark', region: 'Europe', difficulty: 1, flag_file: 'dk.png' },
    { name: 'Djibouti', region: 'Africa', difficulty: 3, flag_file: 'dj.png' },
    {
      name: 'Dominica',
      region: 'North America',
      difficulty: 4,
      flag_file: 'dm.png',
    },
    {
      name: 'Dominican Republic',
      region: 'North America',
      difficulty: 2,
      flag_file: 'do.png',
    },
    {
      name: 'Ecuador',
      region: 'South America',
      difficulty: 2,
      flag_file: 'ec.png',
    },
    { name: 'Egypt', region: 'Africa', difficulty: 1, flag_file: 'eg.png' },
    {
      name: 'El Salvador',
      region: 'North America',
      difficulty: 3,
      flag_file: 'sv.png',
    },
    {
      name: 'Equatorial Guinea',
      region: 'Africa',
      difficulty: 4,
      flag_file: 'gq.png',
    },
    { name: 'Eritrea', region: 'Africa', difficulty: 3, flag_file: 'er.png' },
    { name: 'Estonia', region: 'Europe', difficulty: 2, flag_file: 'ee.png' },
    { name: 'Eswatini', region: 'Africa', difficulty: 3, flag_file: 'sz.png' },
    { name: 'Ethiopia', region: 'Africa', difficulty: 1, flag_file: 'et.png' },
    { name: 'Fiji', region: 'Oceania', difficulty: 3, flag_file: 'fj.png' },
    { name: 'Finland', region: 'Europe', difficulty: 1, flag_file: 'fi.png' },
    { name: 'France', region: 'Europe', difficulty: 1, flag_file: 'fr.png' },
    { name: 'Gabon', region: 'Africa', difficulty: 3, flag_file: 'ga.png' },
    { name: 'Gambia', region: 'Africa', difficulty: 3, flag_file: 'gm.png' },
    { name: 'Georgia', region: 'Asia', difficulty: 3, flag_file: 'ge.png' },
    { name: 'Germany', region: 'Europe', difficulty: 1, flag_file: 'de.png' },
    { name: 'Ghana', region: 'Africa', difficulty: 2, flag_file: 'gh.png' },
    { name: 'Greece', region: 'Europe', difficulty: 1, flag_file: 'gr.png' },
    {
      name: 'Grenada',
      region: 'North America',
      difficulty: 4,
      flag_file: 'gd.png',
    },
    {
      name: 'Guatemala',
      region: 'North America',
      difficulty: 2,
      flag_file: 'gt.png',
    },
    { name: 'Guinea', region: 'Africa', difficulty: 3, flag_file: 'gn.png' },
    {
      name: 'Guinea-Bissau',
      region: 'Africa',
      difficulty: 4,
      flag_file: 'gw.png',
    },
    {
      name: 'Guyana',
      region: 'South America',
      difficulty: 3,
      flag_file: 'gy.png',
    },
    {
      name: 'Haiti',
      region: 'North America',
      difficulty: 3,
      flag_file: 'ht.png',
    },
    {
      name: 'Honduras',
      region: 'North America',
      difficulty: 3,
      flag_file: 'hn.png',
    },
    { name: 'Hungary', region: 'Europe', difficulty: 2, flag_file: 'hu.png' },
    { name: 'Iceland', region: 'Europe', difficulty: 2, flag_file: 'is.png' },
    { name: 'India', region: 'Asia', difficulty: 1, flag_file: 'in.png' },
    { name: 'Indonesia', region: 'Asia', difficulty: 1, flag_file: 'id.png' },
    { name: 'Iran', region: 'Asia', difficulty: 2, flag_file: 'ir.png' },
    { name: 'Iraq', region: 'Asia', difficulty: 2, flag_file: 'iq.png' },
    { name: 'Ireland', region: 'Europe', difficulty: 1, flag_file: 'ie.png' },
    { name: 'Israel', region: 'Asia', difficulty: 2, flag_file: 'il.png' },
    { name: 'Italy', region: 'Europe', difficulty: 1, flag_file: 'it.png' },
    {
      name: 'Jamaica',
      region: 'North America',
      difficulty: 2,
      flag_file: 'jm.png',
    },
    { name: 'Japan', region: 'Asia', difficulty: 1, flag_file: 'jp.png' },
    { name: 'Jordan', region: 'Asia', difficulty: 2, flag_file: 'jo.png' },
    { name: 'Kazakhstan', region: 'Asia', difficulty: 2, flag_file: 'kz.png' },
    { name: 'Kenya', region: 'Africa', difficulty: 1, flag_file: 'ke.png' },
    { name: 'Kiribati', region: 'Oceania', difficulty: 4, flag_file: 'ki.png' },
    { name: 'North Korea', region: 'Asia', difficulty: 3, flag_file: 'kp.png' },
    { name: 'South Korea', region: 'Asia', difficulty: 1, flag_file: 'kr.png' },
    { name: 'Kuwait', region: 'Asia', difficulty: 2, flag_file: 'kw.png' },
    { name: 'Kyrgyzstan', region: 'Asia', difficulty: 3, flag_file: 'kg.png' },
    { name: 'Laos', region: 'Asia', difficulty: 3, flag_file: 'la.png' },
    { name: 'Latvia', region: 'Europe', difficulty: 2, flag_file: 'lv.png' },
    { name: 'Lebanon', region: 'Asia', difficulty: 2, flag_file: 'lb.png' },
    { name: 'Lesotho', region: 'Africa', difficulty: 3, flag_file: 'ls.png' },
    { name: 'Liberia', region: 'Africa', difficulty: 3, flag_file: 'lr.png' },
    { name: 'Libya', region: 'Africa', difficulty: 2, flag_file: 'ly.png' },
    {
      name: 'Liechtenstein',
      region: 'Europe',
      difficulty: 3,
      flag_file: 'li.png',
    },
    { name: 'Lithuania', region: 'Europe', difficulty: 2, flag_file: 'lt.png' },
    {
      name: 'Luxembourg',
      region: 'Europe',
      difficulty: 2,
      flag_file: 'lu.png',
    },
    {
      name: 'Madagascar',
      region: 'Africa',
      difficulty: 2,
      flag_file: 'mg.png',
    },
    { name: 'Malawi', region: 'Africa', difficulty: 3, flag_file: 'mw.png' },
    { name: 'Malaysia', region: 'Asia', difficulty: 2, flag_file: 'my.png' },
    { name: 'Maldives', region: 'Asia', difficulty: 3, flag_file: 'mv.png' },
    { name: 'Mali', region: 'Africa', difficulty: 3, flag_file: 'ml.png' },
    { name: 'Malta', region: 'Europe', difficulty: 2, flag_file: 'mt.png' },
    {
      name: 'Marshall Islands',
      region: 'Oceania',
      difficulty: 4,
      flag_file: 'mh.png',
    },
    {
      name: 'Mauritania',
      region: 'Africa',
      difficulty: 3,
      flag_file: 'mr.png',
    },
    { name: 'Mauritius', region: 'Africa', difficulty: 2, flag_file: 'mu.png' },
    {
      name: 'Mexico',
      region: 'North America',
      difficulty: 1,
      flag_file: 'mx.png',
    },
    {
      name: 'Micronesia',
      region: 'Oceania',
      difficulty: 4,
      flag_file: 'fm.png',
    },
    { name: 'Moldova', region: 'Europe', difficulty: 3, flag_file: 'md.png' },
    { name: 'Monaco', region: 'Europe', difficulty: 3, flag_file: 'mc.png' },
    { name: 'Mongolia', region: 'Asia', difficulty: 2, flag_file: 'mn.png' },
    {
      name: 'Montenegro',
      region: 'Europe',
      difficulty: 3,
      flag_file: 'me.png',
    },
    { name: 'Morocco', region: 'Africa', difficulty: 2, flag_file: 'ma.png' },
    {
      name: 'Mozambique',
      region: 'Africa',
      difficulty: 2,
      flag_file: 'mz.png',
    },
    { name: 'Myanmar', region: 'Asia', difficulty: 2, flag_file: 'mm.png' },
    { name: 'Namibia', region: 'Africa', difficulty: 2, flag_file: 'na.png' },
    { name: 'Nauru', region: 'Oceania', difficulty: 5, flag_file: 'nr.png' },
    { name: 'Nepal', region: 'Asia', difficulty: 2, flag_file: 'np.png' },
    {
      name: 'Netherlands',
      region: 'Europe',
      difficulty: 1,
      flag_file: 'nl.png',
    },
    {
      name: 'New Zealand',
      region: 'Oceania',
      difficulty: 1,
      flag_file: 'nz.png',
    },
    {
      name: 'Nicaragua',
      region: 'North America',
      difficulty: 3,
      flag_file: 'ni.png',
    },
    { name: 'Niger', region: 'Africa', difficulty: 3, flag_file: 'ne.png' },
    { name: 'Nigeria', region: 'Africa', difficulty: 1, flag_file: 'ng.png' },
    {
      name: 'North Macedonia',
      region: 'Europe',
      difficulty: 3,
      flag_file: 'mk.png',
    },
    { name: 'Norway', region: 'Europe', difficulty: 1, flag_file: 'no.png' },
    { name: 'Oman', region: 'Asia', difficulty: 2, flag_file: 'om.png' },
    { name: 'Pakistan', region: 'Asia', difficulty: 1, flag_file: 'pk.png' },
    { name: 'Palau', region: 'Oceania', difficulty: 4, flag_file: 'pw.png' },
    { name: 'Palestine', region: 'Asia', difficulty: 3, flag_file: 'ps.png' },
    {
      name: 'Panama',
      region: 'North America',
      difficulty: 2,
      flag_file: 'pa.png',
    },
    {
      name: 'Papua New Guinea',
      region: 'Oceania',
      difficulty: 3,
      flag_file: 'pg.png',
    },
    {
      name: 'Paraguay',
      region: 'South America',
      difficulty: 2,
      flag_file: 'py.png',
    },
    {
      name: 'Peru',
      region: 'South America',
      difficulty: 1,
      flag_file: 'pe.png',
    },
    { name: 'Philippines', region: 'Asia', difficulty: 1, flag_file: 'ph.png' },
    { name: 'Poland', region: 'Europe', difficulty: 1, flag_file: 'pl.png' },
    { name: 'Portugal', region: 'Europe', difficulty: 1, flag_file: 'pt.png' },
    { name: 'Qatar', region: 'Asia', difficulty: 2, flag_file: 'qa.png' },
    { name: 'Romania', region: 'Europe', difficulty: 2, flag_file: 'ro.png' },
    { name: 'Russia', region: 'Europe', difficulty: 1, flag_file: 'ru.png' },
    { name: 'Rwanda', region: 'Africa', difficulty: 2, flag_file: 'rw.png' },
    {
      name: 'Saint Kitts and Nevis',
      region: 'North America',
      difficulty: 4,
      flag_file: 'kn.png',
    },
    {
      name: 'Saint Lucia',
      region: 'North America',
      difficulty: 4,
      flag_file: 'lc.png',
    },
    {
      name: 'Saint Vincent and the Grenadines',
      region: 'North America',
      difficulty: 4,
      flag_file: 'vc.png',
    },
    { name: 'Samoa', region: 'Oceania', difficulty: 3, flag_file: 'ws.png' },
    {
      name: 'San Marino',
      region: 'Europe',
      difficulty: 3,
      flag_file: 'sm.png',
    },
    {
      name: 'Sao Tome and Principe',
      region: 'Africa',
      difficulty: 4,
      flag_file: 'st.png',
    },
    {
      name: 'Saudi Arabia',
      region: 'Asia',
      difficulty: 1,
      flag_file: 'sa.png',
    },
    { name: 'Senegal', region: 'Africa', difficulty: 2, flag_file: 'sn.png' },
    { name: 'Serbia', region: 'Europe', difficulty: 2, flag_file: 'rs.png' },
    {
      name: 'Seychelles',
      region: 'Africa',
      difficulty: 4,
      flag_file: 'sc.png',
    },
    {
      name: 'Sierra Leone',
      region: 'Africa',
      difficulty: 3,
      flag_file: 'sl.png',
    },
    { name: 'Singapore', region: 'Asia', difficulty: 1, flag_file: 'sg.png' },
    { name: 'Slovakia', region: 'Europe', difficulty: 2, flag_file: 'sk.png' },
    { name: 'Slovenia', region: 'Europe', difficulty: 2, flag_file: 'si.png' },
    {
      name: 'Solomon Islands',
      region: 'Oceania',
      difficulty: 4,
      flag_file: 'sb.png',
    },
    { name: 'Somalia', region: 'Africa', difficulty: 2, flag_file: 'so.png' },
    {
      name: 'South Africa',
      region: 'Africa',
      difficulty: 1,
      flag_file: 'za.png',
    },
    {
      name: 'South Sudan',
      region: 'Africa',
      difficulty: 3,
      flag_file: 'ss.png',
    },
    { name: 'Spain', region: 'Europe', difficulty: 1, flag_file: 'es.png' },
    { name: 'Sri Lanka', region: 'Asia', difficulty: 2, flag_file: 'lk.png' },
    { name: 'Sudan', region: 'Africa', difficulty: 3, flag_file: 'sd.png' },
    {
      name: 'Suriname',
      region: 'South America',
      difficulty: 3,
      flag_file: 'sr.png',
    },
    { name: 'Sweden', region: 'Europe', difficulty: 1, flag_file: 'se.png' },
    {
      name: 'Switzerland',
      region: 'Europe',
      difficulty: 1,
      flag_file: 'ch.png',
    },
    { name: 'Syria', region: 'Asia', difficulty: 3, flag_file: 'sy.png' },
    { name: 'Tajikistan', region: 'Asia', difficulty: 3, flag_file: 'tj.png' },
    { name: 'Tanzania', region: 'Africa', difficulty: 2, flag_file: 'tz.png' },
    { name: 'Thailand', region: 'Asia', difficulty: 1, flag_file: 'th.png' },
    { name: 'Timor-Leste', region: 'Asia', difficulty: 4, flag_file: 'tl.png' },
    { name: 'Togo', region: 'Africa', difficulty: 3, flag_file: 'tg.png' },
    { name: 'Tonga', region: 'Oceania', difficulty: 4, flag_file: 'to.png' },
    {
      name: 'Trinidad and Tobago',
      region: 'North America',
      difficulty: 3,
      flag_file: 'tt.png',
    },
    { name: 'Tunisia', region: 'Africa', difficulty: 2, flag_file: 'tn.png' },
    { name: 'Turkey', region: 'Asia', difficulty: 1, flag_file: 'tr.png' },
    {
      name: 'Turkmenistan',
      region: 'Asia',
      difficulty: 3,
      flag_file: 'tm.png',
    },
    { name: 'Tuvalu', region: 'Oceania', difficulty: 5, flag_file: 'tv.png' },
    { name: 'Uganda', region: 'Africa', difficulty: 2, flag_file: 'ug.png' },
    { name: 'Ukraine', region: 'Europe', difficulty: 1, flag_file: 'ua.png' },
    {
      name: 'United Arab Emirates',
      region: 'Asia',
      difficulty: 1,
      flag_file: 'ae.png',
    },
    {
      name: 'United Kingdom',
      region: 'Europe',
      difficulty: 1,
      flag_file: 'gb.png',
    },
    {
      name: 'United States',
      region: 'North America',
      difficulty: 1,
      flag_file: 'us.png',
    },
    {
      name: 'Uruguay',
      region: 'South America',
      difficulty: 2,
      flag_file: 'uy.png',
    },
    { name: 'Uzbekistan', region: 'Asia', difficulty: 3, flag_file: 'uz.png' },
    { name: 'Vanuatu', region: 'Oceania', difficulty: 4, flag_file: 'vu.png' },
    {
      name: 'Vatican City',
      region: 'Europe',
      difficulty: 4,
      flag_file: 'va.png',
    },
    {
      name: 'Venezuela',
      region: 'South America',
      difficulty: 2,
      flag_file: 've.png',
    },
    { name: 'Vietnam', region: 'Asia', difficulty: 1, flag_file: 'vn.png' },
    { name: 'Yemen', region: 'Asia', difficulty: 3, flag_file: 'ye.png' },
    { name: 'Zambia', region: 'Africa', difficulty: 2, flag_file: 'zm.png' },
    { name: 'Zimbabwe', region: 'Africa', difficulty: 2, flag_file: 'zw.png' },
  ];

  for (const country of countries) {
    await database.runAsync(
      'INSERT INTO countries (name, region, difficulty, flag_file) VALUES (?, ?, ?, ?)',
      [country.name, country.region, country.difficulty, country.flag_file],
    );
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) throw new Error('Database not initialized');

  return db;
};
