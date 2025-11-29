import cloudinary from 'cloudinary';
import formidable from 'formidable';

export const config = { api: { bodyParser: false } };

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'parse error' });
    const file = files.file.filepath || files.file.path;
    const result = await cloudinary.v2.uploader.upload(file, { folder: 'ai_forms' });
    res.json({ url: result.secure_url });
  });
}
