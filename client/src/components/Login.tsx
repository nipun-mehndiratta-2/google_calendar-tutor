import { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { emailSchema, passwordSchema, validateField } from '../validation';

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [disabled,setDisabled] = useState(false);

  const handleLogin = async () => {
    try {
      const emailError = validateField(email, emailSchema);
      const passwordError = validateField(password, passwordSchema);
      if (emailError || passwordError) {
        setErrors({ email: emailError, password: passwordError });
        return;
      }
      setDisabled(true);
      const response = await login({ email, password });
      localStorage.setItem('token', response.data.token);
      if (response?.status === 200) {
        navigate("/");
      }
      setDisabled(false);
      onLogin();
    } catch (error) {
      setDisabled(false);
      const errorMessage = error?.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      console.error('Login failed', error);
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setErrors({ ...errors, email: '' });
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setErrors({ ...errors, password: '' });
  };

  return (
    <div className="bg-cyan-400 min-h-screen flex justify-center items-center">
      <div className="bg-white flex flex-col items-center rounded-xl p-5 max-w-xs md:p-12 md:w-[550px] md:max-w-[550px]">
        <img src='https://www.evallo.org/static/media/evallo-nav-logo.5958887b54798ca6abe74fc1add0728c.svg'/>
        <span className='text-cyan-700 mt-5 text-center'>Tutoring Operations
are Simplified Here.</span>
        <input
          placeholder="Email"
          className={`border border-gray-300 min-w-full p-3 rounded shadow mt-10 outline-cyan-400 ${errors.email ? 'border-red-500' : ''}`}
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={() => setErrors({ ...errors, email: validateField(email, emailSchema) })}
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
        <input
          placeholder="Password"
          className={`min-w-full p-3 border border-gray-300 rounded shadow mt-2 outline-cyan-400 ${errors.password ? 'border-red-500' : ''}`}
          type="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          onBlur={() => setErrors({ ...errors, password: validateField(password, passwordSchema) })}
        />
        {errors.password && <span className="text-red-500">{errors.password}</span>}
        <button className="bg-cyan-400 rounded-lg text-white min-w-full min-h-12 mt-5" onClick={handleLogin} disabled={disabled}>Continue</button>
      </div>
    </div>
  );
}
