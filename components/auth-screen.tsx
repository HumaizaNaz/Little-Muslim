'use client';

import React from "react"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthScreenProps {
  onAuthSuccess: (user: { id: number; email: string; username: string }) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { email, password }
        : { email, password, username };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      // Store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('auth_token', data.token);

      // Call success callback
      onAuthSuccess(data.user);
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('[v0] Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <Card className="w-full max-w-md p-8 border-2 border-primary/20">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌙</div>
          <h1 className="text-3xl font-bold text-primary mb-2">Little Muslim Explorer</h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Welcome Back!' : 'Start Learning Islam'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 mb-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <Input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="w-full"
          >
            {isLogin ? 'Create Account' : 'Login'}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Your learning progress (stars, badges, achievements) is saved locally on your device. Only your account information is stored in our secure database.
          </p>
        </div>
      </Card>
    </div>
  );
}
