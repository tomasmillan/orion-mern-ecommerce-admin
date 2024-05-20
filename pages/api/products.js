import { Product } from "../../models/Product";
import { Category } from "../../models/Category";
import { mongooseConnect } from "../../lib/mongoose";
import { isAdminRequest } from "../api/auth/[...nextauth]";
import mongoose from "mongoose";
import * as XLSX from "xlsx";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  switch (method) {
    case "GET":
      try {
        const products = req.query?.id ? await Product.findOne({ _id: req.query.id }) : await Product.find();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
      }
      break;

    case "POST":
      try {
        if (req.query.upload) {
          // Carga masiva de productos desde un archivo Excel
          const workbook = XLSX.read(req.body, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet);

          await Product.insertMany(data);
          res.json({ message: "Productos cargados exitosamente" });
        } else {
          // Crear un nuevo producto
          const { title, description, price, images, category, properties } = req.body;

          if (category && !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ error: "Categoría inválida" });
          }

          if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
              return res.status(404).json({ error: "Categoría no encontrada" });
            }
          }

          const productDoc = await Product.create({ title, description, price, images, category, properties });
          res.json(productDoc);
        }
      } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto', details: error.message });
      }
      break;

    case "PUT":
      try {
        const { _id, ...updateData } = req.body;
        await Product.updateOne({ _id }, updateData);
        res.json({ message: "Producto actualizado correctamente" });
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
      }
      break;

    case "DELETE":
      try {
        if (req.query?.id) {
          await Product.deleteOne({ _id: req.query.id });
          res.json({ message: "Producto eliminado correctamente" });
        } else {
          res.status(400).json({ error: "ID del producto requerido" });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Método ${method} no permitido` });
      break;
  }
}

