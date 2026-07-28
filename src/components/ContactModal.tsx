import React, { useState, useEffect } from 'react'
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
    projectType: 'Portfolio Website',
    budget: "Let's Discuss",
    timeline: 'Flexible',
    details: '',
  })

  const [loadedAt, setLoadedAt] = useState<number>(() => Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Initialize loadedAt timestamp whenever dialog opens
  useEffect(() => {
    if (isOpen) {
      setLoadedAt(Date.now())
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Build payload matching exact backend schema contract
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      company: formData.company,
      projectType: formData.projectType,
      budget: formData.budget,
      projectDetails: formData.details,
      website: '',
      loadedAt: loadedAt,
    }

    console.log("Submitting payload:", payload)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      console.log("API Response:", data)
      setIsSubmitted(true)
    } catch (err) {
      console.error("Submission error:", err)
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetAndClose = () => {
    setIsSubmitted(false)
    setFormData({
      fullName: '',
      email: '',
      company: '',
      projectType: 'Portfolio Website',
      budget: "Let's Discuss",
      timeline: 'Flexible',
      details: '',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-2xl transition-all duration-500 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-300 z-30"
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
            <div className="space-y-2 text-left border-b border-neutral-900 pb-4 pr-10">
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Full Name & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 text-left">
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

                <div className="space-y-1.5 text-left">
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

              {/* Row 2: Company & Project Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 text-left">
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

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                    Project Type <span className="text-[#990000]">*</span>
                  </label>
                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all cursor-pointer"
                  >
                    <option value="Portfolio Website">Portfolio Website</option>
                    <option value="Business Website">Business Website</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="SaaS Dashboard">SaaS Dashboard</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Web Application">Web Application</option>
                    <option value="AI Integration">AI Integration</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Estimated Budget & Project Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                    Estimated Budget <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all cursor-pointer"
                  >
                    <option value="Let's Discuss">Let's Discuss</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500 – $1,500">$500 – $1,500</option>
                    <option value="$1,500 – $5,000">$1,500 – $5,000</option>
                    <option value="$5,000+">$5,000+</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                    Project Timeline <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all cursor-pointer"
                  >
                    <option value="ASAP">ASAP</option>
                    <option value="1–2 Weeks">1–2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2–3 Months">2–3 Months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Project Details Textarea */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-technical uppercase tracking-wider text-neutral-300 block">
                  Project Details <span className="text-[#990000]">*</span>
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Tell me about your project, goals, timeline, and anything else you'd like me to know..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-white text-xs font-technical focus:outline-none focus:border-neutral-500 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Sticky Action Buttons */}
              <div className="sticky bottom-0 bg-neutral-950/95 backdrop-blur-md pt-4 pb-2 z-20 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-technical uppercase text-xs tracking-widest font-semibold hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Initiate Project'}
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-technical uppercase tracking-widest text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Premium Footer Note */}
              <p className="text-[10px] font-technical text-neutral-500 uppercase tracking-widest text-center pt-1">
                I'll personally review your inquiry and respond as soon as possible.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ContactModal
