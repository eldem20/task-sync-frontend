import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './WelcomePage.css';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true); 
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const switchMode = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLogin(!isLogin);
        setError(''); 
        setEmail('');
        setPassword('');
        setName('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsSubmitting(false);
            return;
        }

        if (!isLogin && !name) {
            setError('Please enter your name');
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('🔐 AuthPage: отправляем запрос');
            
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
            }
            
            console.log('✅ AuthPage: запрос успешен');
            const token = localStorage.getItem('accessToken');
            const user = localStorage.getItem('user');
            
            console.log('🔍 AuthPage: проверяем сохранение:', {
                hasToken: !!token,
                hasUser: !!user
            });
            
            if (token && user) {
                console.log('🔄 AuthPage: данные сохранены, делаем редирект на /home');
                navigate('/home', { replace: true });
            } else {
                console.error('❌ AuthPage: данные не сохранились!');
                setError('Authentication failed - data not saved');
                setIsSubmitting(false);
            }
            
        } catch (err: any) {
            console.error('❌ AuthPage: ошибка', err);
            setError(err.message || 'Authentication failed');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="welcome-page">
            <div className="container">
               <div className="decorations">
                    <img className="decor decor-1" src='/dec1.png' alt="Decoration 1" />
                    <div className="decor decor-2"></div>
                    <div className="decor decor-3"></div>
                    <img className="decor decor-4" src='/calend.png' alt="Calendar" />
                    <img className="decor decor-5" src='/ava.png' alt="Avatar" />
                    <img className="decor decor-6" src='/pink.png' alt="Pink decoration" />
                    <img className="decor decor-7" src='/flower.png' alt="Flower" />
                    <div className="decor decor-8"></div>
                    <div className="decor decor-9"></div>
                    <div className="decor decor-10"></div>
                    <div className="decor decor-11"></div>
                    <img className="decor decor-12" src='/coffee.png' alt="Coffee" />
                    <div className="decor decor-13"></div>
                    <div className="decor decor-14"></div>
                    <div className="decor decor-15"></div>
                </div>
                
                <div className="illustration-container">
                    <img
                        src="/avatar.png"
                        alt="Task Sync Illustration"
                        className="main-illustration"
                    />
                </div>

                <form onSubmit={handleSubmit} className='form'>
                    <h2 className="auth-title">
                        {isLogin ? 'Login' : 'Registration'}
                    </h2>
                    
                    {!isLogin && (
                        <input 
                            type="text" 
                            placeholder="Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="auth-input"
                        />
                    )}
                    
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="auth-input"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={isSubmitting}
                        className="auth-input"
                    />
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button 
                        className="primary-button" 
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                    
                    <a 
                        href="#" 
                        onClick={switchMode} 
                        className="switch-link"
                        style={{ 
                            pointerEvents: isSubmitting ? 'none' : 'auto', 
                            opacity: isSubmitting ? 0.5 : 1 
                        }}
                    >
                        {isLogin ? 'Registration' : 'Login'}
                    </a>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;