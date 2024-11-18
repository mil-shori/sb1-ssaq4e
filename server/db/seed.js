import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function seed() {
  const db = await open({
    filename: join(__dirname, '..', 'database.sqlite'),
    driver: sqlite3.Database
  });

  // サンプルデータ
  const accounts = [
    {
      id: 'yt1',
      platform: 'youtube',
      url: 'https://youtube.com/channel1',
      username: 'TechReviewJP',
      category: 'テクノロジー',
      sub_category: 'ガジェットレビュー',
      followers: 500000,
      engagement: 8.5,
      views: 15000000,
      likes: 250000,
      comments: 45000,
      last_updated: new Date().toISOString()
    },
    {
      id: 'ig1',
      platform: 'instagram',
      url: 'https://instagram.com/foodie_tokyo',
      username: 'foodie_tokyo',
      category: 'フード',
      sub_category: '和食',
      followers: 250000,
      engagement: 4.2,
      likes: 12000,
      comments: 800,
      last_updated: new Date().toISOString()
    },
    {
      id: 'tt1',
      platform: 'tiktok',
      url: 'https://tiktok.com/@dance_jp',
      username: 'dance_jp',
      category: 'エンターテイメント',
      sub_category: 'ダンス',
      followers: 1200000,
      engagement: 15.8,
      views: 8000000,
      likes: 950000,
      comments: 25000,
      last_updated: new Date().toISOString()
    }
  ];

  // テーブルの作成
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

  // 既存のデータを削除
  await db.exec('DELETE FROM accounts');

  // サンプルデータの挿入
  for (const account of accounts) {
    await db.run(`
      INSERT INTO accounts (
        id, platform, url, username, category, sub_category,
        followers, engagement, views, likes, comments, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      account.id,
      account.platform,
      account.url,
      account.username,
      account.category,
      account.sub_category,
      account.followers,
      account.engagement,
      account.views,
      account.likes,
      account.comments,
      account.last_updated
    ]);
  }

  console.log('Database seeded successfully!');
  await db.close();
}

seed().catch(console.error);