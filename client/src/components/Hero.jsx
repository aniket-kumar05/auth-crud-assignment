import React from 'react';
import { ShieldCheck, Database, KeyRound, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 border-b border-slate-800/60 py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck size={14} /> Production Ready Auth & REST API
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          E-Commerce Product Catalog
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Full-stack platform built with React, Redux Toolkit, Express, MongoDB, express-validator & JWT Refresh Token Rotation.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-indigo-400"/> JWT Access + Refresh Cookies</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-indigo-400"/> express-validator Protection</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-indigo-400"/> Product CRUD Operations</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
