// Database utility with fallback to in-memory storage
// If DATABASE_URL is not set, uses local storage instead

let pool: any = null;
let isDbConnected = false;

// Try to initialize database connection if DATABASE_URL is provided
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require('@neondatabase/serverless');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    isDbConnected = true;
    console.log('[v0] Database connected to Neon');
  } catch (error) {
    console.warn('[v0] Failed to initialize database, using fallback storage');
    isDbConnected = false;
  }
}

// In-memory fallback storage
const fallbackStorage = {
  users: new Map<string, any>(),
  sessions: new Map<string, any>(),
  userCounter: 1,
};

export async function query(text: string, params?: unknown[]) {
  if (!isDbConnected || !pool) {
    console.warn('[v0] Using fallback storage (no database connection)');
    return { rows: [] };
  }

  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    console.log('[v0] Executed query in', Date.now() - start, 'ms');
    return result;
  } catch (error) {
    console.error('[v0] Database error:', error);
    throw error;
  }
}

export async function getUser(email: string) {
  if (!isDbConnected || !pool) {
    return fallbackStorage.users.get(email);
  }

  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function createUser(email: string, password_hash: string, username: string) {
  if (!isDbConnected || !pool) {
    const userId = fallbackStorage.userCounter++;
    const user = { id: userId, email, password_hash, username };
    fallbackStorage.users.set(email, user);
    return { id: userId, email, username };
  }

  const result = await query(
    'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username',
    [email, password_hash, username]
  );
  return result.rows[0];
}

export async function createSession(user_id: number, token: string, expiresAt: Date) {
  if (!isDbConnected || !pool) {
    const session = { id: token, user_id, token, expires_at: expiresAt };
    fallbackStorage.sessions.set(token, session);
    return session;
  }

  const result = await query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [user_id, token, expiresAt]
  );
  return result.rows[0];
}

export async function getSession(token: string) {
  if (!isDbConnected || !pool) {
    const session = fallbackStorage.sessions.get(token);
    if (session && new Date(session.expires_at) > new Date()) {
      return session;
    }
    return undefined;
  }

  const result = await query(
    'SELECT s.*, u.email, u.username FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = $1 AND s.expires_at > NOW()',
    [token]
  );
  return result.rows[0];
}

export async function deleteSession(token: string) {
  if (!isDbConnected || !pool) {
    fallbackStorage.sessions.delete(token);
    return;
  }

  await query('DELETE FROM sessions WHERE token = $1', [token]);
}
