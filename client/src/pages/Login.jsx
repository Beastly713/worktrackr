import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

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
      // Call the login API
      const response = await axios.post('/api/users/login', { email, password });

      // On success, call the global login function
      login(response.data); 

      toast.success('Logged in successfully!');
      navigate('/'); // Navigate to the Dashboard
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
      <h2>Login</h2>
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
          value={password}
          onChange={onChange}
          placeholder="Enter your password"
          required
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '0.5rem', cursor: 'pointer' }}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;