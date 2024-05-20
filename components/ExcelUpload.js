import Dropzone from 'react-dropzone';
import React, { useState } from 'react';
import XLSX from 'xlsx';
import Swal from 'sweetalert2'

const ProductUpload = () => {
  const [file, setFile] = useState(null);
  const handleDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (sheet.length > 0) {
        
        Swal.fire('¡Archivo cargado correctamente!', '', 'success');
      } else {
        Swal.fire('Error al cargar el archivo', 'Por favor, intenta de nuevo', 'error');
      }
    };
    reader.readAsArrayBuffer(acceptedFiles[0]);
  };

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Arrastra y suelta un archivo Excel aquí, o haz clic para seleccionar uno</p>
        </div>
      )}
    </Dropzone>
  );
};

export default ProductUpload;