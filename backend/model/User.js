const { Sequelize, DataTypes } = require('sequelize');
require("dotenv").config()

const databaseUrl = process.env.DATABASE_URL || ""

const sequelize = new Sequelize(databaseUrl);
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
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    }
});

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
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    priority : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duedate : {
        type : DataTypes.DATE,
        allowNull : false
    }
});


User.hasMany(Task, { foreignKey: 'userId' }); 
Task.belongsTo(User, { foreignKey: 'userId' });


// sequelize.sync(() => {
//     console.log("ok database connection done");
// }) 
// .then((res) => {console.log("okok");})
// .catch((err) => { console.log("error")});


// sequelize.query("select * from user;").then((res) => { console.log(res)}).catch((err) => { console.log(err)});


module.exports = {User,Task}