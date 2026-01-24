import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../lib/appwrite';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Hardcoded map for simple username experience
        let email = username;
        if (username === 'uudu_admin') {
            email = 'uudu_admin@example.com';
        }

        try {
            // Check if there's an existing session and delete it to force new login
            // or we could just catch the "already logged in" error.
            // Let's try to create a session.
            try {
               await account.createEmailPasswordSession(email, password);
            } catch (sessionError) {
                // If creation fails, maybe we are already logged in?
                // Or maybe wrong password.
                // Appwrite throws 401 for wrong credentials.
                // If 409 (Conflict), it means already logged in.
                if (sessionError.code === 401) {
                    throw new Error("Invalid credentials");
                }
                // If generic error, rethrow
                throw sessionError;
            }
            
            // Set session storage flag to mark this tab as authenticated
            sessionStorage.setItem('uudu_admin_session', 'true');
            navigate('/edit');
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800" style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}>
                    Admin Login
                </h1>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#99564c] focus:border-transparent outline-none transition-all"
                            placeholder="uudu_admin"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#99564c] focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#99564c] text-white font-bold py-3 rounded-lg hover:bg-[#7a453d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
