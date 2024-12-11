import * as SQLite from 'expo-sqlite';

let db;

export async function initializeDatabase() {
    console.log('[initializeDatabase] Starting database initialization...');
    db = await SQLite.openDatabaseAsync('history.db');
    console.log('[initializeDatabase] Database opened/created.');

    console.log('[initializeDatabase] Running CREATE TABLE IF NOT EXISTS ...');
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      calories TEXT,
      barcodeData TEXT,
      scannedAt TEXT
    );
  `);
    console.log('[initializeDatabase] Table ensured. Initialization complete.');
}

function ensureDb() {
    if (!db) {
        const errorMsg = '[ensureDb] Error: Database is not initialized. Please call initializeDatabase() first.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    } else {
        console.log('[ensureDb] Database is already initialized.');
    }
}

export async function insertItem(name, calories, barcodeData) {
    ensureDb();
    console.log('[insertItem] Preparing to insert item:', { name, calories, barcodeData });

    const scannedAt = new Date().toISOString();
    console.log('[insertItem] Using scannedAt:', scannedAt);

    try {
        console.log('[insertItem] Running INSERT statement...');
        const result = await db.runAsync(
            'INSERT INTO history (name, calories, barcodeData, scannedAt) VALUES (?, ?, ?, ?)',
            [name, calories, barcodeData, scannedAt]
        );
        console.log('[insertItem] Insert complete. Result:', result);
    } catch (error) {
        console.error('[insertItem] Error inserting item:', error);
        throw error;
    }
}

export async function fetchItems(limit, offset) {
    ensureDb();
    console.log('[fetchItems] Fetching items with limit:', limit, 'and offset:', offset);

    try {
        console.log('[fetchItems] Running SELECT query for items...');
        const rows = await db.getAllAsync(
            'SELECT * FROM history ORDER BY scannedAt DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        console.log('[fetchItems] Query complete. Rows fetched:', rows.length, 'Rows:', rows);
        return rows;
    } catch (error) {
        console.error('[fetchItems] Error fetching items:', error);
        throw error;
    }
}

export async function fetchTotalCount() {
    ensureDb();
    console.log('[fetchTotalCount] Fetching total count...');

    try {
        console.log('[fetchTotalCount] Running SELECT COUNT(*) query...');
        const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM history');
        console.log('[fetchTotalCount] Query complete. Count result:', result);
        return result.count;
    } catch (error) {
        console.error('[fetchTotalCount] Error fetching total count:', error);
        throw error;
    }
}

export async function deleteItem(id) {
    ensureDb();
    await db.runAsync('DELETE FROM history WHERE id = ?', [id]);
}