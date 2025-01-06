import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../services/axiosClient';

export const useUser = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get('/auth/me');
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return { user, loading, error };
};

export default useUser;