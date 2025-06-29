const pool = require('../config/db');

const addChannel = async (userId, channelId, alias) => {
  const res = await pool.query(
    'INSERT INTO channels (user_id, channel_id, alias) VALUES ($1, $2, $3) RETURNING *',
    [userId, channelId, alias]
  );
  return res.rows[0];
};

const getUserChannels = async (userId) => {
  const res = await pool.query(
    'SELECT * FROM channels WHERE user_id = $1',
    [userId]
  );
  return res.rows;
};

const deleteChannel = async (userId, channelId) => {
  await pool.query(
    'DELETE FROM channels WHERE user_id = $1 AND channel_id = $2',
    [userId, channelId]
  );
};

module.exports = {
  addChannel,
  getUserChannels,
  deleteChannel,
};
