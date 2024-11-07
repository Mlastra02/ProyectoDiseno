// src/lib/excel.js
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const filePath = path.resolve(process.cwd(), 'usuarios.xlsx');

// Verificación de la ruta del archivo
console.log("Ruta completa de 'usuarios.xlsx':", filePath);

// Función para verificar permisos de lectura/escritura
async function verificarPermisos() {
  fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.error("No tienes permisos de lectura/escritura para 'usuarios.xlsx'.", err);
    } else {
      console.log("Permisos de lectura y escritura verificados.");
    }
  });
}

// Función para escribir un usuario nuevo al archivo
export async function escribirUsuarios(nuevoUsuario) {
  await verificarPermisos();  // Verificar permisos de lectura/escritura

  const workbook = new ExcelJS.Workbook();

  try {
    // Leer el archivo si existe, o crear uno nuevo si no existe
    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      console.log("Archivo encontrado y leído.");
    } else {
      console.log("Archivo no encontrado. Creando nuevo archivo 'usuarios.xlsx'.");
    }

    // Seleccionar la hoja de trabajo 'Usuarios' o crearla si no existe
    let worksheet = workbook.getWorksheet('Usuarios');
    if (!worksheet) {
      worksheet = workbook.addWorksheet('Usuarios');
      worksheet.columns = [
        { header: 'Username', key: 'username', width: 30 },
        { header: 'Password', key: 'password', width: 60 },
      ];
      console.log("Hoja de trabajo 'Usuarios' creada.");
    }

    // Agregar nuevo usuario en una nueva fila
    worksheet.addRow({ username: nuevoUsuario.username, password: nuevoUsuario.password });
    console.log(`Usuario agregado: ${nuevoUsuario.username}`);

    // Guardar el archivo Excel
    await workbook.xlsx.writeFile(filePath);
    console.log("Archivo guardado exitosamente con el nuevo usuario.");

    // Verificación: Leer el archivo nuevamente y mostrar el contenido en consola
    const verificationWorkbook = new ExcelJS.Workbook();
    await verificationWorkbook.xlsx.readFile(filePath);
    const verificationWorksheet = verificationWorkbook.getWorksheet('Usuarios');

    if (verificationWorksheet) {
      console.log("Verificación del contenido actual en 'usuarios.xlsx':");
      verificationWorksheet.eachRow((row, rowNumber) => {
        console.log(`Fila ${rowNumber}:`, row.values);
      });
    } else {
      console.log("Hoja 'Usuarios' no encontrada al verificar el archivo.");
    }

  } catch (error) {
    console.error("Error al manejar el archivo de Excel:", error);
  }
}
