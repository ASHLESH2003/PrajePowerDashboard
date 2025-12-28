import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { SpinnerIcon } from './icons/Icons';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TRICK: Convert username 'admin' to 'admin@example.com'
      // This matches the user you created in Supabase
      const emailToSubmit = `${username}@example.com`;

      const { error } = await supabase.auth.signInWithPassword({
        email: emailToSubmit,
        password: password,
      });

      if (error) {
        throw error;
      }

      // No need to manually redirect. 
      // The AuthProvider in App.tsx listens to the state change 
      // and will automatically show the Dashboard.

    } catch (err: any) {
      console.error('Login Error:', err.message);
      setError('Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      {/*           LOGO/HEADER BLOCK (Moved Outside the Card)
                    Now using h-[150px] as requested.
        */}
      <div className="text-center mb-8">
        <img
          src="/FinalLogo.png"
          alt="Admin Logo"
          // UPDATED CLASSNAME: Using h-[150px] as requested
          className="mx-auto h-[145px] w-auto mb-4 rounded-lg"
        />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Praje Power</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Admin Dashboard Login</p>
      </div>


      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <SpinnerIcon className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;