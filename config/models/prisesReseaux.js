'use strict'

module.exports = (sequelize, DataTypes) => {
  const PrisesReseaux = sequelize.define('prisesreseaus', {
    priseid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    bandeauid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    portid: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    numeroprise: {
      type: DataTypes.INTEGER(4),
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
  return PrisesReseaux;
};