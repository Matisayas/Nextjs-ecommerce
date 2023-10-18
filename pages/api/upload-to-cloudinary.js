import { cloudinary } from '@/config/cloudinary';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

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
    const uploadedImages = [];

    for (const file of Object.values(files.file)) {
      const { secure_url } = await cloudinary.uploader.upload(file.path);
      uploadedImages.push(secure_url);
    }

    res.status(200).json({ links: uploadedImages });
  } catch (error) {
    console.error('Error al cargar imágenes en Cloudinary:', error);
    res.status(500).json({ error: 'Error al cargar imágenes en Cloudinary' });
  }
}
