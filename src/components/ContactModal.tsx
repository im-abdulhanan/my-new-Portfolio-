import React, { useState } from 'react'
import { HiX, HiCheckCircle } from 'react-icons/hi'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    projectType: 'Web Experience',
    budget: "Let's Discuss",
    details: '',
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const handleResetAndClose = () => {
    setIsSubmitted(false)
    setFormData({
      fullName: '',
      email: '',
      company: '',
      projectType: 'Web Experience',
      budget: "Let's Discuss",
      details: '',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-2xl transition-all duration-500 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 my-auto overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-300"
          aria-label="Close dialog"
        >
          <HiX className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Success Screen */
          <div className="text-center py-8 space-y-6 animate-scaleIn">
            <div className="flex justify-center">
              <HiCheckCircle className="w-16 h-16 text-[#990000] animate-bounce" />
            </div>

            <div className="space-y-3">
              <h3 className="font-thunder text-4xl sm:text-6xl text-white uppercase tracking-tighter font-normal">
                REQUEST <span className="text-[#990000]">RECEIVED</span>
              </h3>
              <p className="font-technical text-sm sm:text-base text-neutral-300 tracking-wide font-normal max-w-md mx-auto">
                Thank you for reaching out.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs sm:text-sm font-technical text-neutral-400 leading-relaxed tracking-wide max-w-md mx-auto space-y-2">
              <p>Your inquiry has been received successfully.</p>
              <p>I'll review your project details and get back to you shortly.</p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-8 py-3.5 rounded-full bg-white text-black font-technical uppercase text-xs tracking-widest font-semibold hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <>
            {/* Header & Subtitle */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-technical tracking-[0.35em] uppercase text-[#990000] font-semibold block">
                GET IN TOUCH
              </span>
              <h2 className="font-thunder text-4xl sm:text-5xl text-white uppercase tracking-tighter font-normal">
                INITIATE <span className="text-[#990000]">COLLABORATION</span>
              </h2>
              <p className="font-technical text-xs sm:text-sm text-neutral-400 tracking-wide">
                Tell me about your vision. I'll get back to you within 24–48 hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                    Full Name <span className="text-[#990000]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Mercer"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                    Email Address <span className="text-[#990000]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Company / Organization */}
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                    Company <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Studio"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all"
                  />
                </div>

                {/* Project Type Dropdown */}
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                    Project Type <span className="text-[#990000]">*</span>
                  </label>
                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all cursor-pointer"
                  >
                    <option value="Web Experience">Web Experience</option>
                    <option value="Full Stack Application">Full Stack Application</option>
                    <option value="AI Integration">AI Integration</option>
                    <option value="UI / UX Design">UI / UX Design</option>
                    <option value="Security Consulting">Security Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Project Budget Dropdown */}
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                    Budget <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all cursor-pointer"
                  >
                    <option value="Under $1,000">Under $1,000</option>
                    <option value="$1,000–$5,000">$1,000–$5,000</option>
                    <option value="$5,000–$10,000">$5,000–$10,000</option>
                    <option value="$10,000+">$10,000+</option>
                    <option value="Let's Discuss">Let's Discuss</option>
                  </select>
                </div>
              </div>

              {/* Project Details Textarea */}
              <div className="space-y-2">
                <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                  Project Details <span className="text-[#990000]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Tell me about your project, goals, timeline, and anything else you'd like me to know..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-thunder uppercase text-xl tracking-wider font-normal hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Initiate Project
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-technical uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Premium Footer Note */}
              <p className="text-[10px] font-technical text-neutral-500 uppercase tracking-widest text-center pt-2 border-t border-neutral-900">
                I'll personally review your inquiry and respond as soon as possible.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
