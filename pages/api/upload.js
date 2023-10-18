import multiparty from 'multiparty'

export default async function handle(req, res) {
  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    if (!files || !files.file || files.file.length === 0) {
      return res.status(400).json({ error: 'Ningún archivo enviado' });
    }

    // Sube el archivo a Cloudinary
    const result = await cloudinary.uploader.upload(files.file[0].path, {
      folder: 'uploads', // Opcional: carpeta donde se almacenan los archivos en Cloudinary
    });

    // Devuelve la URL de la imagen subida
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar el archivo en Cloudinary' });
  }
}


export const config = {
  api: { bodyParser: false },
};