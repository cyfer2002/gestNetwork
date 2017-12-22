'use strict'

module.exports = (sequelize, DataTypes) => {
  const PortsReseaux = sequelize.define('portsreseaus', {
    portid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    slotid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    numeroport: {
      type: DataTypes.CHAR(2),
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
  return PortsReseaux;
};