import { Country } from '../types/game';
import { getDatabase, initDatabase } from './initDB';

export const getAllCountries = async (): Promise<Country[]> => {
  await initDatabase(); // Ensure DB is initialized
  const db = getDatabase();
  const countries = await db.getAllAsync<Country>('SELECT * FROM countries');
  return countries;
};

export const getRandomCountries = async (count: number): Promise<Country[]> => {
  await initDatabase(); // Ensure DB is initialized
  const db = getDatabase();
  const countries = await db.getAllAsync<Country>(
    'SELECT * FROM countries ORDER BY RANDOM() LIMIT ?',
    [count],
  );
  return countries;
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
