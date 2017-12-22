'use strict'

module.exports = (sequelize, DataTypes) => {
  const Slots = sequelize.define('slots', {
    slotid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    switchid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    numeroslot: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    nbports: {
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
  return Slots;
};