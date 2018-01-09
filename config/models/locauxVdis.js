'use strict'

module.exports = (sequelize, DataTypes) => {
  const LocauxVdis = sequelize.define('locauxvdis', {
    localvdiid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    batimentid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    etage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aile: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nbarmoire: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
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
  return LocauxVdis;
};