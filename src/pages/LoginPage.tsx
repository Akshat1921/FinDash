import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }

            const response = await axios.post('http://localhost:8090/auth/signin', { 
                email: username,  // Changed from 'username' to 'email'
                password 
            });
            
            console.log('Login successful:', response.data);
            
            // Store authentication data if needed
            const responseData = response.data as any;
            console.log('Full response data:', responseData);
            
            if (responseData?.jwt) {  // Changed from 'token' to 'jwt' to match backend response
                localStorage.setItem('authToken', responseData.jwt);
                console.log('Token stored in localStorage');
                
                // Check if user is admin and redirect accordingly
                try {
                    const { jwtDecode } = await import('jwt-decode');
                    const decoded: any = jwtDecode(responseData.jwt);
                    console.log('Decoded JWT:', decoded);
                    console.log('User authorities:', decoded.authorities);
                    
                    // Check authorities claim instead of role
                    if (decoded.authorities && decoded.authorities.includes('ROLE_ADMIN')) {
                        console.log('Admin user detected, redirecting to /admin');
                        navigate('/admin');
                    } else {
                        console.log('Regular user detected, redirecting to /stocks');
                        navigate('/stocks');
                    }
                } catch (decodeError) {
                    console.error('JWT decode error:', decodeError);
                    navigate('/stocks'); // Default fallback
                }
            } else {
                console.log('No JWT token in response, redirecting to /stocks');
                navigate('/stocks');
            }
        } catch (error: any) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-white/80">
                            Sign in to your FinDash account
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-3 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg 
                                         text-white placeholder-white/50
                                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                                         transition duration-200"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg 
                                         text-white placeholder-white/50
                                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                                         transition duration-200"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-lg p-3">
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-white/10 
                                     text-white font-medium py-3 px-4 rounded-lg border border-blue-500/30
                                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                                     transition-all duration-200 ease-in-out
                                     disabled:cursor-not-allowed disabled:border-white/20"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4">
                            <p className="text-sm text-white/80">
                                Don't have an account?{' '}
                                <Link 
                                    to="/signup" 
                                    className="font-medium text-blue-300 hover:text-blue-200 
                                             transition duration-200"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
