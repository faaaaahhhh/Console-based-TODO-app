import 'dotenv/config';
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
    }
);


//
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {
    tableName: 'users',
    timestamps: false,
});


//
const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
    },

    dueDate: {
        type: DataTypes.DATEONLY,
    },

    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM('Pending', 'Completed'),
        defaultValue: 'Pending',
    },

}, {
    tableName: 'tasks',
    timestamps: true,
});


//
User.hasMany(Task, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

Task.belongsTo(User, {
    foreignKey: 'userId',
});


//
async function initDB() {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log('Database connected and tables are ready.');
}

async function closeDB() {
    await sequelize.close();
}


//
export {
    sequelize,
    User,
    Task,
    initDB,
    closeDB,
};
