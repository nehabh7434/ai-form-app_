import { useState } from 'react';
import axios from 'axios';

export default function FormRenderer({ schema }) {
  const [values, setValues] = useState({});
  const [files, setFiles] = useState([]);
  const api = process.env.NEXT_PUBLIC_API;

  function onChange(name, v) {
    setValues(prev => ({ ...prev, [name]: v }));
  }

  async function uploadFile(file) {
    // Use Cloudinary direct unsigned or your backend proxy endpoint (frontend/api/upload)
    const fd = new FormData();
    fd.append('file', file);
    const res = await axios.post('/api/upload', fd); // proxy route on frontend that returns cloudinary url
    return res.data.url;
  }

  async function submit(e) {
    e.preventDefault();
    const uploaded = [];
    for (let f of files) {
      const url = await uploadFile(f);
      uploaded.push(url);
    }

    // responses collected
    const payload = { responses: values, uploadedImages: uploaded };
    await axios.post(api + '/api/submissions/submit/' + schema._id, payload);
    alert('Submitted!');
  }

  return (
    <form onSubmit={submit}>
      {schema.fields.map(field => (
        <div key={field.name} style={{ marginBottom: 12 }}>
          <label>{field.label || field.name}</label><br/>
          {field.type === 'text' && <input onChange={e=>onChange(field.name, e.target.value)} />}
          {field.type === 'email' && <input type="email" onChange={e=>onChange(field.name, e.target.value)} />}
          {field.type === 'image' && <input type="file" onChange={e=>{ setFiles(prev=>[...prev, e.target.files[0]]) }} />}
          {field.type === 'file' && <input type="file" onChange={e=>{ setFiles(prev=>[...prev, e.target.files[0]]) }} />}
        </div>
      ))}
      <button>Submit</button>
    </form>
  );
}
