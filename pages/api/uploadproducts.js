import XLSX from "xlsx";
import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "POST") {
    const { fileData } = req.body;

    const workbook = XLSX.read(fileData, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    try {
      for (const row of sheet) {
        // Actualiza o crea el producto
        const product = await Product.findOneAndUpdate(
          { title: row.title }, // Busca por título
          { $setOnInsert: { title: row.title }, price: row.price }, // Crea si no existe
          { upsert: true, new: true } // Opciones para actualizar/crear
        );
      }

      res.status(200).json({ message: "Precios actualizados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar los precios" });
    }
  } else if (method === "GET") {
    try {
      const products = await Product.find({});
      // Convierte los productos a un formato compatible con XLSX
      const worksheet = XLSX.utils.json_to_sheet(products);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

      // Genera un buffer del archivo XLSX
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

      // Configura la respuesta para descargar el archivo
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=productos.xlsx");
      res.send(excelBuffer);
    } catch (error) {
      res.status(500).json({ error: "Error al descargar la lista de productos" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}