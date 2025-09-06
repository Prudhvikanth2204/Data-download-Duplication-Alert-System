import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ddas_db',
  password: 'Maranatha#1',
  port: 5432,
});

// Connect to the database and create table if needed
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS checksums (
        id TEXT PRIMARY KEY,
        file_name TEXT NOT NULL,
        checksum TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        path TEXT
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Simple CORS configuration to avoid path-to-regexp errors
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Serve static files if available
const distPath = path.join(fileURLToPath(import.meta.url), '../dist');
app.use(express.static(distPath));

// Routes
app.get('/api/checksums', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM checksums');
    res.json(result.rows.map(row => ({
      id: row.id,
      fileName: row.file_name,
      checksum: row.checksum,
      timestamp: row.timestamp,
      path: row.path || row.file_name
    })));
  } catch (error) {
    console.error('Error fetching checksums:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/checksums', async (req, res) => {
  try {
    const { id, fileName, checksum, timestamp, path } = req.body;
    
    console.log('Received checksum data:', { id, fileName, checksum, timestamp, path });
    
    const result = await pool.query(
      'INSERT INTO checksums (id, file_name, checksum, timestamp, path) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, fileName, checksum, timestamp, path || fileName]
    );
    
    res.json({
      id: result.rows[0].id,
      fileName: result.rows[0].file_name,
      checksum: result.rows[0].checksum,
      timestamp: result.rows[0].timestamp,
      path: result.rows[0].path || result.rows[0].file_name
    });
  } catch (error) {
    console.error('Error saving checksum:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/checksums/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM checksums WHERE id = $1 OR path = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting checksum:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve React app index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Initialize the database and start the server
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
  });
});
