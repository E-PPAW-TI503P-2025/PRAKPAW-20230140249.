const presensiRecords = [
  // Contoh data: Karyawan yang sudah selesai bekerja dan siap untuk check-in baru.
  // Properti "userid" juga diperbaiki menjadi "userId" agar konsisten.
  {
    userId: 123,
    nama: 'User Karyawan',
    checkIn: new Date('2024-06-01T08:00:00'),
    checkOut: null // <-- UBAH INI MENJADI NULL
  }
  
];

module.exports = presensiRecords;