import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// データベース初期化
async function initializeDatabase() {
  const db = await open({
    filename: join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      username TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT,
      followers INTEGER NOT NULL,
      engagement REAL NOT NULL,
      views INTEGER,
      likes INTEGER,
      comments INTEGER,
      last_updated TEXT NOT NULL
    )
  `);

  return db;
}

let db;
initializeDatabase().then((database) => {
  db = database;
  console.log('Database initialized');
});

// アカウント検索API
app.get('/api/accounts', async (req, res) => {
  try {
    const { keyword, platforms, categories, sortBy = 'followers', sortOrder = 'desc' } = req.query;

    let query = 'SELECT * FROM accounts WHERE 1=1';
    const params = [];

    if (keyword) {
      query += ' AND (username LIKE ? OR category LIKE ? OR sub_category LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (platforms) {
      const platformList = platforms.split(',');
      query += ` AND platform IN (${platformList.map(() => '?').join(',')})`;
      params.push(...platformList);
    }

    if (categories) {
      const categoryList = categories.split(',');
      query += ` AND category IN (${categoryList.map(() => '?').join(',')})`;
      params.push(...categoryList);
    }

    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    const accounts = await db.all(query, params);
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// アカウントエクスポートAPI
app.get('/api/export', async (req, res) => {
  try {
    const accounts = await db.all('SELECT * FROM accounts');
    
    // CSVフォーマットに変換
    const headers = ['ID', 'プラットフォーム', 'URL', 'ユーザー名', 'カテゴリー', 
                    'サブカテゴリー', 'フォロワー数', 'エンゲージメント率', 
                    '再生回数', 'いいね数', 'コメント数', '最終更新日'];
    
    const csv = [
      headers.join(','),
      ...accounts.map(account => [
        account.id,
        account.platform,
        account.url,
        account.username,
        account.category,
        account.sub_category || '',
        account.followers,
        account.engagement,
        account.views || '',
        account.likes || '',
        account.comments || '',
        account.last_updated
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=social_media_accounts.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});