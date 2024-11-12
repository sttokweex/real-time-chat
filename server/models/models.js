// src/models.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js'; // Import the sequelize instance

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the Channel model
const Channel = sequelize.define('Channel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the Message model
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  channel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Channel, // Reference to Channel model
      key: 'id',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Set default value to current date/time
  },
});

// Define associations
Channel.hasMany(Message, { foreignKey: 'channel_id' });
Message.belongsTo(Channel, { foreignKey: 'channel_id' });

// Sync models with database (optional, can be done in server.js)
export const syncDatabase = async () => {
  try {
    await sequelize.sync(); // Synchronize all defined models to the DB.
    console.log('All models were synchronized successfully.');

    // Optionally create default channels here if needed.
    const defaultChannelName = 'general';
    await Channel.findOrCreate({
      where: { name: defaultChannelName },
      defaults: { creator: 'System' },
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Export models for use in other files
export { User, Channel, Message };
