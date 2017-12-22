'use strict'

module.exports = (sequelize, DataTypes) => {
  const BandeauxReseaux = sequelize.define('bandeauxreseaus', {
    bandeauid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    armoireid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    numerobandeau: {
      type: DataTypes.CHAR(32),
      allowNull: false
    },
    nbprises: {
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
  return BandeauxReseaux;
};