const { User } = require('../models/user.model');

module.exports = async function quotaTracker(req, res, next) {
  try {
    const userId = req.user?.id; // Assumes auth middleware sets this
    if (!userId) return next();

    const user = await User.findByPk(userId);
    if (!user) return next();

    const now = new Date();
    const resetTime = new Date(user.last_quota_reset);
    const oneDay = 24 * 60 * 60 * 1000;

    // Reset quota if past 24 hours
    if (now - resetTime > oneDay) {
      user.quota_used = 0;
      user.last_quota_reset = now;
    }

    user.quota_used += 1;
    await user.save();

    // Optional: Block if over limit
    if (user.quota_used > 1000) {
      return res.status(429).json({ error: 'Daily API quota exceeded.' });
    }

    next();
  } catch (err) {
    console.error('Quota middleware error:', err);
    next();
  }
};
