'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tambahkan kolom latitude
    await queryInterface.addColumn('Presensis', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true, // Boleh null jika izin lokasi ditolak
    });

    // Tambahkan kolom longitude
    await queryInterface.addColumn('Presensis', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Hapus kolom latitude
    await queryInterface.removeColumn('Presensis', 'latitude');

    // Hapus kolom longitude
    await queryInterface.removeColumn('Presensis', 'longitude');
  },
};