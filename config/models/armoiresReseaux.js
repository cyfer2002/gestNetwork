'use strict'

module.exports = (sequelize, DataTypes) => {
  const AmoiresReseaux = sequelize.define('armoiresreseaus', {
    armoireid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    localvdiid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    numeroarmoire: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    nbbandeau: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nbswitch: {
      type: DataTypes.INTEGER,
      allowNull: true
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
  return AmoiresReseaux;
};