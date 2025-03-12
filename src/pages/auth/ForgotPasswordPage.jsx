import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Per favore, inserisci la tua email.' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const { success, error } = await resetPassword(email);
      
      if (success) {
        setMessage({
          type: 'success',
          text: 'Abbiamo inviato un link per reimpostare la password alla tua email. Controlla la tua casella di posta.'
        });
        setEmail('');
      } else {
        setMessage({
          type: 'error',
          text: error || 'Si è verificato un errore. Riprova più tardi.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Si è verificato un errore. Riprova più tardi.'
      });
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hai dimenticato la password?</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Non preoccuparti, ti invieremo le istruzioni per reimpostarla.
        </p>
      </div>
      
      {message.text && (
        <Alert 
          variant={message.type}
          className="mb-6"
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@esempio.com"
          required
          icon={
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
            </svg>
          }
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={loading}
        >
          Invia istruzioni
        </Button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ricordi la tua password?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Torna al login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
