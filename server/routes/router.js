import { Router } from 'express';
import { Channel, ChannelUser } from '../models/models.js';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth-middleware.js';

const router = Router();

router.get('/api/channels', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const channels = await Channel.findAll();

    const userChannels = await ChannelUser.findAll({
      where: { userId },
      attributes: ['channelId'],
    });

    const userChannelIds = new Set(
      userChannels.map((userChannel) => userChannel.channelId),
    );

    const response = channels.map((channel) => {
      const role = userChannelIds.has(channel.id)
        ? channel.creatorId == userId
          ? 'admin'
          : 'member'
        : 'unstated';

      return {
        id: channel.id,
        name: channel.name,
        userRole: role,
      };
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

router.post('/api/registration', authController.registration);

router.post('/api/login', authController.login);

router.post('/api/logout', authController.logout);

router.get('/api/refresh', authController.refresh);

export default router;
