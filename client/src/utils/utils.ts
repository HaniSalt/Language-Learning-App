import axios from 'axios';
import { auth } from '../firebase/firebase';
const API_URL = 'http://localhost:8080/api';

export const authenticatedRequest = async (method, endpoint, data?) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  
  const token = await user.getIdToken();
  
  return axios({
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data
  });
};