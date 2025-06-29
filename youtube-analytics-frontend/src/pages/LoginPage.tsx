import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await login({ email, password });
      console.log('Login response:', response); 
      const { token, user } = response;
    
      if (token) {
        localStorage.setItem('token', token);         
        localStorage.setItem('userEmail', user.email); 
        navigate('/dashboard');
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login 
          </button >

          <p className="text-sm text-center mt-4">
  Don't have an account?
  <button
    onClick={() => navigate('/register')}
    className="text-blue-600 ml-1 hover:underline"
    type="button"
  >
    Register
  </button>
</p>
        </form>
      </div>
    </div>
  );
}
