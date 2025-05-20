import {v2 as cloudinary} from 'cloudinary';
import('dotenv').then(dotenv => dotenv.config());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
      if (err) return reject(err);
      console.error('Erro ao enviar para o Cloudinary:', err);
      resolve(result);
    });

    stream.end(buffer);
  });
};