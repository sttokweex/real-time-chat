// src/routes/channelRoutes.js
import { Router } from 'express';
import { Channel } from '../models/models.js'; // Импорт модели Channel

const router = Router();

// Получение всех каналов
router.get('/api/channels', async (req, res) => {
  try {
    const channels = await Channel.findAll();
    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

export default router;
