import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);

    // Simulated API / Server Submission Delay
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      toast.success("Message sent successfully! 🚀");
    }, 1200);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="min-h-screen bg-slate-50 pt-28 pb-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Have questions about our courses, enterprise plans, or need career guidance? Drop us a message and our team will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Cards Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
              
              <div className="space-y-2 relative z-10">
                <h3 className="text-xl font-bold">Contact Information</h3>
                <p className="text-indigo-100 text-xs sm:text-sm">
                  Fill out the form or reach out to us directly using the details below.
                </p>
              </div>

              <div className="space-y-6 relative z-10 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm text-amber-300">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Chat to us</p>
                    <p className="font-bold text-white">royalsaifi63@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm text-amber-300">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Call us</p>
                    <p className="font-bold text-white">+91 8851081499</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm text-amber-300">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Office</p>
                    <p className="font-bold text-white">Faridabad, India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm text-amber-300">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Working Hours</p>
                    <p className="font-bold text-white">Mon - Sat: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form / Success Card Section */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm transition-all">
            
            {isSubmitted ? (
              /* Success UI Screen */
              <div className="py-12 px-4 text-center space-y-6 animate-fadeIn">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={42} className="stroke-[2.5]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Message Received Successfully!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you <span className="font-bold text-slate-800">{formData.name}</span>! We have received your inquiry regarding <span className="italic text-indigo-600 font-medium">"{formData.subject || 'General Inquiry'}"</span>. Our support team will reach out to you at <span className="font-semibold text-slate-800">{formData.email}</span> shortly.
                  </p>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleResetForm}
                    className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>Send Another Message</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              /* Regular Contact Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Zuber Saifi"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl px-4 py-3.5 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Email <span className="text-rose-500">*</span></label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="royalsaifi63@gmail.com"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl px-4 py-3.5 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 8851081499"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl px-4 py-3.5 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Course Inquiry / Enterprise"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl px-4 py-3.5 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Message <span className="text-rose-500">*</span></label>
                  <textarea 
                    rows="4" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl p-4 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;