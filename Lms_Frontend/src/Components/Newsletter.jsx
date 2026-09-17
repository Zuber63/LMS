import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-white py-16 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/60 p-8 sm:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
          
          <div className="max-w-xl mx-auto space-y-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Get Free Coding Tutorials Direct To Your Inbox
            </h3>
            <p className="text-sm text-slate-500">
              Join 5,000+ developers receiving our curated weekly breakdown of frontend tricks, UI architectures, and career tips.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-sm pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-md shadow-indigo-100 whitespace-nowrap">
                Subscribe Now
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-emerald-600 font-bold text-sm bg-emerald-50 max-w-sm mx-auto p-4 rounded-xl border border-emerald-100">
              <CheckCircle size={18} />
              <span>Awesome! Check your inbox for confirmation.</span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Newsletter;