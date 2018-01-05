'use strict'

module.exports = (sequelize, DataTypes) => {
  const Batiments = sequelize.define('batiments', {
    batimentid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    nombatiment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    caractbatiment: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    nbaile: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nbetageinf: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nbetagesup: {
      type: DataTypes.INTEGER,
      allowNull: false
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
  return Batiments;
};