import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';

export default function Dashboard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    api.get('/auth/me').then(r => setMe(r.data)).catch(()=>{});
  }, []);

  if (!me) return <div>Cargando...</div>;
  return (
    <div>
      <h2>Hola {me.user.email}</h2>
      <p>Bio: {me.profile?.bio}</p>
    </div>
  );
}