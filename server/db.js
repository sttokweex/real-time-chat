import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres', 'postgres', 'admin', {
  host: 'some-postgres',
  dialect: 'postgres',
});

export default sequelize;
