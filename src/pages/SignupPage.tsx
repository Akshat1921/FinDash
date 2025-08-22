import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobileNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validation
            if (!fullName || !email || !password || !confirmPassword || !mobile) {
                setError('Please fill in all fields.');
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters long");
                return;
            }

            const response = await axios.post('http://localhost:8090/auth/signup', {
                fullName,
                email,
                password,
                role: 'ROLE_USER',
                mobile
            });

            console.log('Signup successful:', response.data);
            
            // Store authentication data if needed
            const responseData = response.data as any;
            if (responseData?.jwt) {  // Changed from 'token' to 'jwt' to match backend response
                localStorage.setItem('authToken', responseData.jwt);
            }
            
            navigate('/stocks');
        } catch (error: any) {
            console.error('Signup failed:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || error.response?.data || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-white/70">
                            Join FinDash to track your portfolio
                        </p>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSignup} className="space-y-6">
                        {/* Full Name Input */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-3 py-3 border border-white/20 rounded-lg 
                                         backdrop-blur-xl bg-white/10 text-white 
                                         placeholder-white/50
                                         focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                                         transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-3 py-3 border border-white/20 rounded-lg 
                                         backdrop-blur-xl bg-white/10 text-white 
                                         placeholder-white/50
                                         focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                                         transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-3 border border-white/20 rounded-lg 
                                         backdrop-blur-xl bg-white/10 text-white 
                                         placeholder-white/50
                                         focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                                         transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className="w-full px-3 py-3 border border-white/20 rounded-lg 
                                         backdrop-blur-xl bg-white/10 text-white 
                                         placeholder-white/50
                                         focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                                         transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Mobile Number Input */}
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-white mb-2">
                                Mobile Number
                            </label>
                            <input
                                id="mobile"
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="Enter your mobile number"
                                className="w-full px-3 py-3 border border-white/20 rounded-lg 
                                         backdrop-blur-xl bg-white/10 text-white 
                                         placeholder-white/50
                                         focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                                         transition-all duration-200"
                                required
                            />
                        </div>



                        {/* Error Message */}
                        {error && (
                            <div className="backdrop-blur-xl bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-900/50 backdrop-blur-sm
                                     text-slate-300 font-medium py-3 px-4 rounded-lg border border-gray-800
                                     focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2
                                     transition-all duration-200 ease-in-out
                                     disabled:cursor-not-allowed disabled:text-slate-500"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="text-center pt-4">
                            <p className="text-sm text-white/70">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="font-medium text-white hover:text-white/80
                                             transition-all duration-200"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
