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
    {
      name: 'United States',
      region: 'Americas',
      difficulty: 1,
      flag_file: 'us.png',
    },
    {
      name: 'United Kingdom',
      region: 'Europe',
      difficulty: 1,
      flag_file: 'gb.png',
    },
    { name: 'Canada', region: 'Americas', difficulty: 1, flag_file: 'ca.png' },
    { name: 'France', region: 'Europe', difficulty: 1, flag_file: 'fr.png' },
    { name: 'Germany', region: 'Europe', difficulty: 1, flag_file: 'de.png' },
    { name: 'Japan', region: 'Asia', difficulty: 1, flag_file: 'jp.png' },
    { name: 'China', region: 'Asia', difficulty: 1, flag_file: 'cn.png' },
    { name: 'Brazil', region: 'Americas', difficulty: 1, flag_file: 'br.png' },
    {
      name: 'Australia',
      region: 'Oceania',
      difficulty: 1,
      flag_file: 'au.png',
    },
    { name: 'India', region: 'Asia', difficulty: 1, flag_file: 'in.png' },
    { name: 'Italy', region: 'Europe', difficulty: 2, flag_file: 'it.png' },
    { name: 'Spain', region: 'Europe', difficulty: 2, flag_file: 'es.png' },
    { name: 'Mexico', region: 'Americas', difficulty: 2, flag_file: 'mx.png' },
    { name: 'South Korea', region: 'Asia', difficulty: 2, flag_file: 'kr.png' },
    { name: 'Russia', region: 'Europe', difficulty: 2, flag_file: 'ru.png' },
    {
      name: 'Argentina',
      region: 'Americas',
      difficulty: 2,
      flag_file: 'ar.png',
    },
    {
      name: 'South Africa',
      region: 'Africa',
      difficulty: 2,
      flag_file: 'za.png',
    },
    { name: 'Egypt', region: 'Africa', difficulty: 2, flag_file: 'eg.png' },
    { name: 'Turkey', region: 'Asia', difficulty: 2, flag_file: 'tr.png' },
    {
      name: 'Netherlands',
      region: 'Europe',
      difficulty: 2,
      flag_file: 'nl.png',
    },
    { name: 'Sweden', region: 'Europe', difficulty: 2, flag_file: 'se.png' },
    { name: 'Norway', region: 'Europe', difficulty: 2, flag_file: 'no.png' },
    { name: 'Denmark', region: 'Europe', difficulty: 2, flag_file: 'dk.png' },
    { name: 'Finland', region: 'Europe', difficulty: 2, flag_file: 'fi.png' },
    { name: 'Poland', region: 'Europe', difficulty: 2, flag_file: 'pl.png' },
    { name: 'Ukraine', region: 'Europe', difficulty: 2, flag_file: 'ua.png' },
    { name: 'Greece', region: 'Europe', difficulty: 2, flag_file: 'gr.png' },
    { name: 'Portugal', region: 'Europe', difficulty: 2, flag_file: 'pt.png' },
    { name: 'Belgium', region: 'Europe', difficulty: 2, flag_file: 'be.png' },
    {
      name: 'Switzerland',
      region: 'Europe',
      difficulty: 2,
      flag_file: 'ch.png',
    },
    { name: 'Austria', region: 'Europe', difficulty: 2, flag_file: 'at.png' },
    {
      name: 'Czech Republic',
      region: 'Europe',
      difficulty: 2,
      flag_file: 'cz.png',
    },
    { name: 'Ireland', region: 'Europe', difficulty: 2, flag_file: 'ie.png' },
    {
      name: 'New Zealand',
      region: 'Oceania',
      difficulty: 2,
      flag_file: 'nz.png',
    },
    {
      name: 'Singapore',
      region: 'Asia',
      difficulty: 2,
      flag_file: 'sg.png',
    },
    { name: 'Thailand', region: 'Asia', difficulty: 2, flag_file: 'th.png' },
    { name: 'Vietnam', region: 'Asia', difficulty: 2, flag_file: 'vn.png' },
    {
      name: 'Indonesia',
      region: 'Asia',
      difficulty: 2,
      flag_file: 'id.png',
    },
    { name: 'Malaysia', region: 'Asia', difficulty: 2, flag_file: 'my.png' },
    {
      name: 'Philippines',
      region: 'Asia',
      difficulty: 2,
      flag_file: 'ph.png',
    },
    {
      name: 'Saudi Arabia',
      region: 'Asia',
      difficulty: 2,
      flag_file: 'sa.png',
    },
    {
      name: 'United Arab Emirates',
      region: 'Asia',
      difficulty: 2,
      flag_file: 'ae.png',
    },
    { name: 'Israel', region: 'Asia', difficulty: 2, flag_file: 'il.png' },
    { name: 'Chile', region: 'Americas', difficulty: 2, flag_file: 'cl.png' },
    {
      name: 'Colombia',
      region: 'Americas',
      difficulty: 2,
      flag_file: 'co.png',
    },
    { name: 'Peru', region: 'Americas', difficulty: 2, flag_file: 'pe.png' },
    {
      name: 'Venezuela',
      region: 'Americas',
      difficulty: 2,
      flag_file: 've.png',
    },
    { name: 'Nigeria', region: 'Africa', difficulty: 3, flag_file: 'ng.png' },
    { name: 'Kenya', region: 'Africa', difficulty: 3, flag_file: 'ke.png' },
    { name: 'Morocco', region: 'Africa', difficulty: 3, flag_file: 'ma.png' },
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
