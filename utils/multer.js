import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads"); // Corrección: Cambié "piblic" a "public" para el directorio de destino
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname); // Se añadió un guion '-' entre la marca de tiempo y el nombre del archivo
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb({ error: 'Unsupported file format. Upload only JPEG/JPG or PNG' }, false); // Corrección: Cambié la forma en que se devuelve un error
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 }, // Corrección: Cambié "fieldSize" a "fileSize"
    fileFilter,
});

export default upload;
