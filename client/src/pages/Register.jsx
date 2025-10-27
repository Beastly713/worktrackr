import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Note: We use /api/users/register
      // The vite proxy will forward this to http://localhost:5001/api/users/register
      await axios.post('/api/users/register', { email, password });

      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Enter your email"
          required
          style={{ padding: '0.5rem' }}
        />
        <input
          type="password"
          name="password"
          _ value={password} onChange={onChange} placeholder="Enter your password" required style={{ padding: '0.5rem' }} /> <button type="submit" disabled={isLoading} style={{ padding: '0.5rem', cursor: 'pointer' }}> {isLoading ? 'Submitting...' : 'Register'} </button> </form> </div> ); };

export default Register;