// seedChannels.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const channels = [
  { name: 'MrBeast', youtube_id: 'UCX6OQ3DkcsbYNE6H8uQQuVA' },
  { name: 'Veritasium', youtube_id: 'UCHnyfMqiRRG1u-2MsSQLbXA' },
  { name: 'Marques Brownlee', youtube_id: 'UCBJycsmduvYEL83R_U4JriQ' },
  { name: 'Ali Abdaal', youtube_id: 'UCoOae5nYA7VqaXzerajD0lg' },
  { name: 'Kurzgesagt', youtube_id: 'UCsXVk37bltHxD1rDPwtNM8Q' },
  { name: 'TED-Ed', youtube_id: 'UCsooa4yRKGN_zEE8iknghZA' },
  { name: 'SmarterEveryDay', youtube_id: 'UC6107grRI4m0o2-emgoDnAA' },
  { name: 'Linus Tech Tips', youtube_id: 'UCXuqSBlHAE6Xw-yeJA0Tunw' },
  { name: 'CrashCourse', youtube_id: 'UCX6b17PVsYBQ0ip5gyeme-Q' },
  { name: 'Tom Scott', youtube_id: 'UCBa659QWEk1AI4Tg--mrJ2A' },
];

async function seed() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS channels (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        youtube_id TEXT UNIQUE NOT NULL
      )
    `);

    for (const { name, youtube_id } of channels) {
      await pool.query(
        `INSERT INTO channels (name, youtube_id)
         VALUES ($1, $2)
         ON CONFLICT (youtube_id) DO NOTHING`,
        [name, youtube_id]
      );
    }

    console.log('✅ Channels seeded successfully');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await pool.end();
  }
}

seed();
