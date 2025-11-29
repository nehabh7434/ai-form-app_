import axios from 'axios';
import { useEffect, useState } from 'react';
import FormRenderer from '../../components/FormRenderer';

export default function PublicForm({ query }) {
  const [schema, setSchema] = useState(null);
  useEffect(()=> {
    const id = query.id || (typeof window !== 'undefined' && window.location.pathname.split('/').pop());
    axios.get(process.env.NEXT_PUBLIC_API + '/api/forms/' + id).then(r => setSchema(r.data.form.schema));
  }, [query]);

  if (!schema) return <div>Loading...</div>;
  return (
    <div style={{ padding:20 }}>
      <h2>{schema.title || 'Form'}</h2>
      <FormRenderer schema={schema} />
    </div>
  );
}

export async function getServerSideProps({ query }) { return { props: { query } }; }
