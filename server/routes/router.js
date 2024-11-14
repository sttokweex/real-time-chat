import { Router } from 'express';
import { Channel } from '../models/models.js';
import authController from '../controllers/authController.js';

const router = Router();

router.get('/api/channels', async (req, res) => {
  try {
    const channels = await Channel.findAll();

    res.json(channels);
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
