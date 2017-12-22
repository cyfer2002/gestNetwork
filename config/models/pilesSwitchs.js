'use strict'

module.exports = (sequelize, DataTypes) => {
  const PilesSwitchs = sequelize.define('pilesswitchs', {
    nompile: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    armoireid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    nbswitch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
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
  return PilesSwitchs;
};