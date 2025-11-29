import { useState } from 'react';
import axios from 'axios';
import BASE_API_URL, { setAuthToken } from '../utils/auth';
import { useRouter } from 'next/router';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSignup(e) {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post(`${BASE_API_URL}/api/auth/signup`, {
                email,
                password
            });

            const { token } = res.data;

            setAuthToken(token);
            alert("Signup successful!");

            router.push('/dashboard');

        } catch (err) {
            console.error("SIGNUP ERROR:", err.response?.data || err);
            setError(err.response?.data?.error || "Signup failed.");
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Create Account</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSignup}>
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                /><br/>

                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                /><br/>

                <button type="submit">Sign Up</button>
            </form>

            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
}
