'use strict'

module.exports = (sequelize, DataTypes) => {
  const Switchs = sequelize.define('switchs', {
    switchid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    nompile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    numeroswitch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nbslots: {
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
  return Switchs;
};