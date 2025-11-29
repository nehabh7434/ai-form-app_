import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [token, setToken] = useState('');
  const [forms, setForms] = useState([]);

  useEffect(()=> {
    const t = localStorage.getItem('token');
    if (t) { setToken(t); fetchForms(t); }
  }, []);

  async function fetchForms(t) {
    const res = await axios.get(process.env.NEXT_PUBLIC_API + '/api/forms', { headers: { Authorization: `Bearer ${t}` }});
    setForms(res.data.forms || []);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Forms</h2>
      <a href="/new">Create New Form</a>
      <div>
        {forms.map(f => (
          <div key={f._id} style={{ border:'1px solid #ddd', padding:10, marginTop:10 }}>
            <div><strong>{f.summary || f.prompt}</strong></div>
            <div>Created: {new Date(f.createdAt).toLocaleString()}</div>
            <div><a href={`/form/${f._id}`} target="_blank">Public Link</a></div>
          </div>
        ))}
      </div>
    </div>
  );
}
