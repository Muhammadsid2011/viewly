import React, { useState } from 'react';
import { User, AtSign, Mail, Lock } from "lucide-react"

export default function CreateAccount() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  })

  const fields = [
    { label: 'FULL NAME', icon: User, placeholder: 'Enter your full name', type: 'text' },
    { label: 'USERNAME', icon: AtSign, placeholder: 'Choose a username', type: 'text' },
    { label: 'EMAIL ADDRESS', icon: Mail, placeholder: 'Enter your email', type: 'email' },
    { label: 'PASSWORD', icon: Lock, placeholder: 'Create a password', type: 'password' },
  ];

  const handleChange = (e, label) => {
    if (label === 'FULL NAME') {
      setForm((prev) => ({ ...prev, fullName: e.target.value }))
    }
    if (label === 'USERNAME') {
      setForm((prev) => ({ ...prev, username: e.target.value }))
    }
    if (label === 'EMAIL ADDRESS') {
      setForm((prev) => ({ ...prev, email: e.target.value }))
    }
    if (label === 'PASSWORD') {
      setForm((prev) => ({ ...prev, password: e.target.value }))
    }
    console.log(form)
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 font-sans text-[#f8d7d2]">
      <div className="w-full max-w-[500px] bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#f8d7d2]">Viewly</h1>
          <h2 className="text-xl font-medium text-[#f8d7d2]/80">Create your account</h2>
          <p className="text-[#f8d7d2]/60 mt-2">Join the premiere streaming experience.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.map((field) => (
            <div key={field.label} className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-[#f8d7d2]/50 uppercase">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f8d7d2]/40">
                  <field.icon />
                </div>
                <input
                  onChange={e => handleChange(e, field.label)}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full bg-[#262626] border border-[#404040] text-[#f8d7d2] rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#f8d7d2]/20 transition-all placeholder:text-[#f8d7d2]/30"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleClick}
            type="submit"
            className="w-full bg-[#f8d7d2] text-[#1a1a1a] font-bold py-3.5 rounded-lg hover:bg-[#f8d7d2]/90 transition-colors mt-8"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
