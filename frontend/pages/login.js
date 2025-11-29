// /frontend/pages/login.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import BASE_API_URL, { setAuthToken } from '../utils/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await axios.post(
                `${BASE_API_URL}/auth/login`,
                { email, password }
            );

            setAuthToken(data.token);
            router.push('/dashboard'); 

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
                
                <form onSubmit={submitHandler} className="space-y-4">
                    {/* Email and Password inputs */}
                    {/* (Use the input fields from the previous response for styling) */}
                    <div>
                        <label htmlFor="email">Email address</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    Don't have an account? 
                    <button onClick={() => router.push('/signup')} className="font-medium text-blue-600 ml-1">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}