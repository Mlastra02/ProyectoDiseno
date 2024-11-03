// src/lib/excel.js
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const filePath = path.resolve(process.cwd(), 'usuarios.xlsx');

// Lee los usuarios desde el archivo Excel
export async function leerUsuarios() {
  const workbook = new ExcelJS.Workbook();
  if (!fs.existsSync(filePath)) {
    return []; // Si el archivo no existe, devuelve un array vacío
  }
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);
  const data = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // omitir encabezado
      const [username, password] = row.values.slice(1);
      data.push({ username, password });
    }
  });

  return data;
}

// Escribe los usuarios en el archivo Excel
export async function escribirUsuarios(usuarios) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Usuarios');

  // Agrega encabezados
  worksheet.addRow(['Username', 'Password']);

  // Agrega datos
  usuarios.forEach(user => {
    worksheet.addRow([user.username, user.password]);
  });

  await workbook.xlsx.writeFile(filePath);
}
