import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
  // Kaunsa question khula hai uski state store karne ke liye
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "Are these courses self-paced or live?",
      answer: "We offer a mixture of both structure systems. Most core programs have pre-recorded crisp video units, coupled with mandatory weekly interactive live Q&A support masterclasses led by the assigned industry mentors."
    },
    {
      question: "Will I receive a verified certificate upon completion?",
      answer: "Yes, absolutely. Once you complete 100% of the lessons, pass the automated course quizzes, and submit your final architecture capstone project, a verified dynamic certificate will be issued to your account dashboard."
    },
    {
      question: "Is there a refund policy structure available?",
      answer: "We offer a 7-day unconditional money-back guarantee parameter. If you feel the curriculum does not align with your tech learning track, you can raise an automated refund request from your dashboard settings."
    },
    {
      question: "Can I access the learning materials on mobile?",
      answer: "Yes, our entire UI environment is fully responsive. You can comfortably access videos, documentation, dashboard progress grids, and quizzes on any smartphone, tablet, or desktop viewport."
    }
  ];

  const toggleFAQ = (index) => {
    // Agar pehle se wahi khula hai toh band kardo, nahi toh naya index kholo
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50 py-20 lg:py-24 border-t border-b border-slate-200/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mx-auto">
            <HelpCircle size={12} className="text-indigo-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Everything you need to know about our learning tracks, certificates, and operational architecture.
          </p>
        </div>

        {/* Accordion List Container */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
              >
                {/* Trigger Button Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  <span className="text-sm sm:text-base tracking-tight">{faq.question}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-slate-400 transform transition-transform duration-200 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} 
                  />
                </button>

                {/* Collapsible Panel Content */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 border-t border-slate-100' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
} 

export default FAQ;