import cloudinary from 'cloudinary';

// Configura Cloudinary con tus credenciales
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploads = (file, folder)=> {
  return new Promise((resolve, reject)=>{
    cloudinary.uploader.upload(
      file,
    (results)=>{
      resolve({
        public_id: results.public_id,
        url: results.url,
      })
    },
    {
     resource_type:"auto",
     folder:folder, 
    }
    )
  })
}
export { uploads,cloudinary };
