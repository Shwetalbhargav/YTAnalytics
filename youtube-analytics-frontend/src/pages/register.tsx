import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await register({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/login?registered=true');
    } catch (err) {
      setError('Registration failed. Please try a different email.');
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-8 max-w-md mx-auto bg-white rounded shadow space-y-4 mt-10">
      <h2 className="text-xl font-bold text-center">Register</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <input
        className="border p-2 w-full rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="border p-2 w-full rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  );
}
