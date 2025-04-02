import express from 'express';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import { User } from '../models/userModel.js';

const router = express.Router();

// Approve user (admin only)
router.put('/approve/:userId', authenticateUser, authorizeAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.approved = true;
    await user.save();

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
