'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : 'uniqueUsername',
      validate: {
        notEmpty: {
          error: "Un nom d'utilisateur est requis"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          error: "Un nom d'utilisateur est requis"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          error: "Un nom d'utilisateur est requis"
        }
      }
    },
    password : {
    type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          error: "Le mot de passe est requis"
        }
      }
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'create', 'view'],
      defaultValue: 'view'
    },
    email : {
      type: DataTypes.STRING,
      allowNull: false,
      unique : 'uniqueEmail',
      validate: {
        notEmpty: {
          error: "L'e-mail est requis"
        },
        isEmail: true
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at:  DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    underscored: true
  });
  return Users;
};