import { Country } from '../types/game';
import { getDatabase, initDatabase } from './initDB';

export const getAllCountries = async (): Promise<Country[]> => {
  await initDatabase(); // Ensure DB is initialized
  const db = getDatabase();
  const countries = await db.getAllAsync<Country>('SELECT * FROM countries');
  return countries;
};

export const getRandomCountries = async (count: number): Promise<Country[]> => {
  try {
    await initDatabase(); // Ensure DB is initialized
    const db = getDatabase();

    if (!db) {
      throw new Error('Database is null after initialization');
    }

    console.log('Fetching random countries, count:', count);
    const countries = await db.getAllAsync<Country>(
      'SELECT * FROM countries ORDER BY RANDOM() LIMIT ?',
      [count],
    );
    console.log('Fetched countries:', countries.length);
    return countries;
  } catch (error) {
    console.error('Error in getRandomCountries:', error);
    throw error;
  }
};

export const getCountryById = async (id: number): Promise<Country | null> => {
  await initDatabase(); // Ensure DB is initialized
  const db = getDatabase();
  const country = await db.getFirstAsync<Country>(
    'SELECT * FROM countries WHERE id = ?',
    [id],
  );
  return country || null;
};
