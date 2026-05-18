import React from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';

interface ContactFormProps {
  captchaQuestion?: string;
}

export const ContactForm: React.FC = () => {
  const [captchaVersion, setCaptchaVersion] = React.useState(0);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    message: '',
    captcha_input: '',
    fax_number: '', // Honeypot field: Invisible to humans, bots fill it automatically!
  });

  const refreshCaptcha = () => {
    setCaptchaVersion((prev) => prev + 1);
    setData('captcha_input', ''); // Reset the input value
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('contact.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Message sent successfully! I will get back to you soon.');
        reset();
        refreshCaptcha(); // Force a new captcha code for safety
      },
      onError: () => {
        toast.error('Verification failed. Please try again.');
        refreshCaptcha(); // Rotate captcha so old one cannot be brute-forced
      }
    });
  };

  // Fully themeable, dark-mode ready inputs
  const inputBase =
    'w-full bg-white dark:bg-[#111] border border-black dark:border-white/20 px-4 py-3 text-[15px] text-black dark:text-white focus:outline-none focus:bg-[#FFF8DC] dark:focus:bg-zinc-900 focus:border-[#FA76FF] dark:focus:border-[#FA76FF] transition-all duration-200';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      
      {/* ANTI-BOT HONEYPOT FIELD: Stays hidden from humans */}
      <div style={{ display: 'none', opacity: 0, height: 0, pointerEvents: 'none' }}>
        <label htmlFor="fax_number">Skip this: fax number</label>
        <input
          id="fax_number"
          type="text"
          value={data.fax_number}
          onChange={(e) => setData('fax_number', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase block mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          maxLength={100}
          placeholder="Your full name"
          className={inputBase}
          disabled={processing}
        />
        {errors.name && <p className="text-red-600 dark:text-red-400 text-[12px] mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.name}</p>}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase block mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          maxLength={255}
          placeholder="you@example.com"
          className={inputBase}
          disabled={processing}
        />
        {errors.email && <p className="text-red-600 dark:text-red-400 text-[12px] mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.email}</p>}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase block mb-2">
          Message Content
        </label>
        <textarea
          id="message"
          rows={5}
          value={data.message}
          onChange={(e) => setData('message', e.target.value)}
          maxLength={1000}
          placeholder="Tell me about your project, timeline, and objectives."
          className={`${inputBase} resize-none`}
          disabled={processing}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.message ? (
            <p className="text-red-600 dark:text-red-400 text-[12px] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.message}</p>
          ) : (
            <span />
          )}
          <span className="text-[11px] text-gray-400">{data.message.length}/1000</span>
        </div>
      </div>

      {/* CUSTOM CAPTCHA WRAPPER */}
      <div className="bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-300 dark:border-white/10 p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400 min-w-[110px]">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-zinc-700">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wide uppercase text-gray-900 dark:text-gray-300">
              Security
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Type the code</p>
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-[auto_auto_1fr] items-center gap-2.5 pl-0 md:pl-4 border-l-0 md:border-l border-gray-200 dark:border-zinc-700">
          {/* Dynamic Server Captcha Canvas */}
          <div className="relative bg-white p-1 border border-black/20 rounded select-none flex items-center justify-center overflow-hidden h-[54px] w-[140px] md:w-[170px]">
            <img 
              src={`/captcha/image?v=${captchaVersion}`} 
              alt="Security Verification"
              className="h-full w-full object-contain filter dark:brightness-95"
              loading="eager"
            />
          </div>

          {/* Refresh Captcha Trigger */}
          <button
            type="button"
            onClick={refreshCaptcha}
            disabled={processing}
            className="w-12 h-[54px] flex items-center justify-center border border-black/20 dark:border-white/20 bg-white dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded focus:outline-none cursor-pointer"
            title="Get another code"
          >
            <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="relative w-full">
            <input
              type="text"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck="false"
              value={data.captcha_input}
              onChange={(e) => setData('captcha_input', e.target.value)}
              placeholder="Enter code"
              disabled={processing}
              className="w-full h-[54px] bg-white dark:bg-[#111] border border-black dark:border-white/20 px-4 py-2 font-mono text-center font-bold text-[18px] uppercase tracking-wider focus:outline-none text-black dark:text-white transition-all duration-150 placeholder-gray-300 dark:placeholder-zinc-700 rounded focus:bg-[#FFF8DC] dark:focus:bg-zinc-900"
              required
            />
          </div>
        </div>
      </div>
      
      {errors.captcha_input && (
        <p className="text-red-600 dark:text-red-400 text-[12px] mt-[-12px] flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {errors.captcha_input}
        </p>
      )}

      {/* Submit Trigger */}
      <button
        type="submit"
        disabled={processing}
        className="relative overflow-hidden bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-[11px] font-bold uppercase tracking-wider border border-black dark:border-white self-start group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <span className="relative z-10 group-hover:text-black transition-colors flex items-center gap-2">
          {processing ? 'Processing...' : 'Submit inquiry →'}
        </span>
        {!processing && (
          <span className="absolute inset-0 bg-[#FA76FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
        )}
      </button>
    </form>
  );
};
