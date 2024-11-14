import { DataTypes } from 'sequelize';
import sequelize from '../dbconnector/db.js';

const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
  },
  {
    timestamps: false,
  },
);

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
  creatorId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
});

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
      model: Channel,
      key: 'id',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

const ChannelUser = sequelize.define(
  'ChannelUser',
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
    channelId: {
      type: DataTypes.INTEGER,
      references: {
        model: Channel,
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
const Token = sequelize.define(
  'token',
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    refresh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

User.hasMany(Channel, { foreignKey: 'creatorId' });
Channel.belongsTo(User, { foreignKey: 'creatorId' });

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Channel.hasMany(Message, { foreignKey: 'channel_id' });
Message.belongsTo(Channel, { foreignKey: 'channel_id' });

User.belongsToMany(Channel, { through: ChannelUser, foreignKey: 'userId' });
Channel.belongsToMany(User, { through: ChannelUser, foreignKey: 'channelId' });

export { User, Channel, Message, Token, ChannelUser };
