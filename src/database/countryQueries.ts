import { Country } from '../types/game';
import { getDatabase, initDatabase } from './initDB';

export const getAllCountries = async (): Promise<Country[]> => {
  await initDatabase(); // Ensure DB is initialized
  const db = getDatabase();
  const countries = await db.getAllAsync<Country>('SELECT * FROM countries');
  return countries;
};

export const getRandomCountries = async (
  count: number,
  difficultyLevels?: number[],
): Promise<Country[]> => {
  try {
    await initDatabase(); // Ensure DB is initialized
    const db = getDatabase();

    if (!db) {
      throw new Error('Database is null after initialization');
    }

    console.log('Fetching random countries, count:', count);

    let query = 'SELECT * FROM countries';
    const params: any[] = [];

    // Filter by difficulty levels if provided
    if (difficultyLevels && difficultyLevels.length > 0) {
      const placeholders = difficultyLevels.map(() => '?').join(',');
      query += ` WHERE difficulty IN (${placeholders})`;
      params.push(...difficultyLevels);
    }

    query += ' ORDER BY RANDOM() LIMIT ?';
    params.push(count);

    console.log('Query:', query, 'Params:', params);
    const countries = await db.getAllAsync<Country>(query, params);
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
