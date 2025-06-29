const pool = require('../config/db');

exports.addChannel = async (req, res) => {
  const { userId } = req.user;
  const { channelId, alias } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO channels (user_id, channel_id, alias) VALUES ($1, $2, $3) RETURNING *',
      [userId, channelId, alias]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add channel.' });
  }
};

exports.getChannels = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM channels'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve channels.' });
  }
};

exports.deleteChannel = async (req, res) => {
  const { userId } = req.user;
  const { channelId } = req.params;

  try {
    await pool.query(
      'DELETE FROM channels WHERE user_id = $1 AND channel_id = $2',
      [userId, channelId]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete channel.' });
  }
};

