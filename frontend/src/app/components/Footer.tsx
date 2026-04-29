import React from 'react';
import { Cpu, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Bridge 86-51</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Empowering the next generation of embedded engineers through advanced modular simulation and bidirectional architectural analysis.
            </p>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Experiments</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Forward Track (8086)</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Reverse Track (8051)</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Interfacing Modules</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Validation Engine</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6">Documentation</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-blue-600 transition-colors">IEEE Standards</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Memory Mapping</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Interrupt Handling</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">API References</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-slate-500 mb-4 font-medium">Get the latest architectural research.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
              <button className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-sm transition-all font-bold">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-bold">
            © 2026 Bridge 86-51 Experimental Systems.
          </p>
          <div className="flex gap-6 text-slate-400">
            <a href="https://github.com/shubuexe" target="_blank" rel="noopener noreferrer">
              <Github size={18} className="hover:text-slate-900 cursor-pointer transition-colors" />
            </a>
            <a href="https://x.com/Shubhampateldev" target="_blank" rel="noopener noreferrer">
              <Twitter size={18} className="hover:text-blue-400 cursor-pointer transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/shubham-patel-735245242/" target="_blank" rel="noopener noreferrer">
              <Linkedin size={18} className="hover:text-blue-700 cursor-pointer transition-colors" />
            </a>
            <a href="mailto:sp955219@gmail.com">
              <Mail size={18} className="hover:text-rose-500 cursor-pointer transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}