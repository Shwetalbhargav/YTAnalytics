const pool = require('../config/db'); 

const Channel = {};

// Get channel by YouTube channel_id
Channel.getChannelByYoutubeId = async (channelId) => {
  console.log('DB: Looking for YouTube channel_id:', channelId);
  const result = await pool.query(
    'SELECT * FROM channels WHERE channel_id = $1',
    [channelId]
  );
  return result.rows[0];
};

// Get channel by database id
Channel.getChannelById = async (id) => {
  console.log('DB: Looking for DB id:', id);
  const result = await pool.query(
    'SELECT * FROM channels WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

module.exports = Channel;
