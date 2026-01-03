import React, { useState } from 'react';
import { 
  Mail, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Clock,
  CheckCircle,
  Loader2,
  Bug,
  Send,
  Phone,
  Plus,
   Menu,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useSupportRequests } from '@/lib/api/hooks';
import { SupportStatus } from '@/lib/api/types';
import SupportSidebar from './SupportSidebar';
import IssueRequestModal from './IssueRequestModal';
import RequestCard from './RequestCard';

const SupportSection = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [showModal, setShowModal] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const { data: supportRequests = [], isLoading: requestsLoading } = useSupportRequests();

  const openRequests = supportRequests.filter(req => req.status === SupportStatus.OPEN);
  const inProgressRequests = supportRequests.filter(req => req.status === SupportStatus.IN_PROGRESS);
  const resolvedRequests = supportRequests.filter(req => req.status === SupportStatus.RESOLVED);

  const handleCopyToClipboard = (text:any, label:any) => {
    navigator.clipboard.writeText(text).then(() => {
            toast.success(`${label} copied to clipboard!`, {
              duration: 2000,
            });
          }).catch(() => {
            toast.error('Failed to copy', {
              description: 'Please try again',
              duration: 2000,
            });
          });
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:agency.dev365@gmail.com?subject=Support Request';
  };

  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/919002970210?text=Hi, I need help with my website', '_blank');
  };

const faqs = [
  {
    question: 'How do payments work?',
    answer:
      "Payments are processed monthly, quarterly, or yearly based on your selected plan. You'll receive an invoice via email before each payment is due. We accept bank transfers, UPI, and online payment methods.",
  },
  {
    question: "What happens if I don't pay on time?",
    answer:
      'If payment is not received by the due date, your account will enter a grace period. During this time, your website remains active. If payment is still not received after the grace period ends, your service will be temporarily suspended until payment is received.',
  },
  {
    question: 'How do I change my plan?',
    answer:
      'Plan changes are handled manually by our team to ensure a smooth transition. Contact us via email at agency.dev365@gmail.com or WhatsApp at +91-9002970210 to discuss your plan change requirements.',
  },
  {
    question: 'How long does support take?',
    answer:
      'We aim to respond to all support requests within 24–48 hours during business hours (Mon–Fri, 10 AM – 6 PM IST). Urgent issues are prioritized and may receive faster responses.',
  },
  {
    question: 'Can I request changes to my website?',
    answer:
      "Yes! Submit a change request through the support form. Depending on your plan, minor changes may be included, while major changes may incur additional fees. We'll discuss the details with you before proceeding.",
  },
  {
    question: 'What information should I include in a bug report?',
    answer:
      'When reporting a bug, please include: (1) What you were trying to do, (2) What actually happened, (3) Steps to reproduce the issue, (4) Browser and device information, (5) Screenshots if possible. This helps us resolve the issue faster.',
  },

  // 🔽 Newly added (recommended)
  {
    question: 'What does my subscription include?',
    answer:
      'Your subscription includes website hosting, maintenance, ongoing support, and minor updates based on your selected plan. Major feature additions or redesigns may require additional charges, which will always be discussed with you beforehand.',
  },
  {
    question: 'Will my website go offline if my subscription is paused?',
    answer:
      'If your subscription is paused due to non-payment, your website may be temporarily restricted. Once payment is confirmed, your website will be restored immediately without any data loss.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time by contacting our support team. We’ll guide you through the process and explain any implications based on your current billing cycle.',
  },
  {
    question: 'Is my website data safe? Do you take backups?',
    answer:
      'Yes. We follow standard best practices to keep your website and data secure. Backups and security measures are in place depending on your hosting setup and selected plan.',
  },
];


  return (
    <div className="flex w-full bg-black overflow-hidden">
      {/* Support Sidebar */}
      <SupportSidebar 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openRequestsCount={openRequests.length}
        showMobile={showMobileSidebar}
        setShowMobile={setShowMobileSidebar}
      />

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 flex flex-col min-w-0 overflow-hidden h-full"
        animate={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : (sidebarCollapsed ? 64 : 256)
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header with Create Issue Button */}
        <div className="border-b border-white/10 bg-black px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between flex-shrink-0">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg mr-3 flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 truncate">
              {activeTab === 'faq' && 'Frequently Asked Questions'}
              {activeTab === 'email' && 'Email Support'}
              {activeTab === 'whatsapp' && 'WhatsApp Support'}
              {activeTab === 'my-issues' && 'My Support Issues'}
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              {activeTab === 'faq' && 'Find quick answers to common questions'}
              {activeTab === 'email' && 'Get detailed help via email'}
              {activeTab === 'whatsapp' && 'Quick chat support on WhatsApp'}
              {activeTab === 'my-issues' && 'Track your support requests'}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-white hover:bg-white/90 text-black text-xs sm:text-sm font-medium rounded-lg transition-colors flex-shrink-0"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Create Issue</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-full space-y-2 sm:space-y-3"
            >
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-white/10 bg-white/5 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setShowFaq(showFaq === index ? null : index)}
                    className="w-full flex items-center justify-between gap-3 p-3 sm:p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-medium text-white">{faq.question}</span>
                    {showFaq === index ? (
                      <ChevronUp className="h-4 w-4 text-white/60 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-white/60 flex-shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showFaq === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2">
                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

{/* Email Support Tab */}
{activeTab === 'email' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full h-full"
  >
      <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Information */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
              Professional Email Support
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Get comprehensive assistance from our expert team. Email support is ideal for detailed issues that require thorough documentation and step-by-step solutions.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="border-l-2 border-white/20 pl-3 sm:pl-4">
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Response Time</h3>
              <p className="text-white/60 text-xs sm:text-sm">
                We aim to respond within 24-48 hours during business hours. Complex issues may require additional time for investigation.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-3 sm:pl-4">
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Best For</h3>
              <p className="text-white/60 text-xs sm:text-sm">
                Bug reports, feature requests, account issues, billing inquiries, and technical problems that need detailed explanation.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-3 sm:pl-4">
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">What to Include</h3>
              <p className="text-white/60 text-xs sm:text-sm">
                Please provide a clear description of your issue, steps to reproduce (if applicable), screenshots, and your account details for faster resolution.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-3 sm:pl-4">
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Why Email?</h3>
              <p className="text-white/60 text-xs sm:text-sm">
                Email provides a documented trail of communication, allows for detailed explanations, and ensures nothing gets lost in conversation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - CTA */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6 p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="text-center pb-3 sm:pb-4 border-b border-white/10">
              <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2">Contact Email</p>
              <button
                onClick={() => handleCopyToClipboard('agency.dev365@gmail.com', 'Email')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 text-white hover:text-white/80 transition-colors mx-auto group"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold break-all group-hover:underline">
                  agency.dev365@gmail.com
                </span>
              </button>
            </div>

            <button
              onClick={() => handleCopyToClipboard('agency.dev365@gmail.com', 'Email')}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors border border-white/20 text-xs sm:text-sm"
            >
              Copy Email Address
            </button>

            <button
              onClick={handleEmailSupport}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-white/90 text-black font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              Send Email Now
            </button>

            <div className="pt-3 sm:pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Mon-Fri, 10 AM - 6 PM IST</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed">
                  <span className="text-white/70 font-medium">Perfect for:</span> Bug reports, feature requests, account & billing issues
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </motion.div>
)}

{/* WhatsApp Support Tab */}
{activeTab === 'whatsapp' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full h-full"
  >
      <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Information */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
              Quick WhatsApp Support
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Need immediate assistance? Connect with our team on WhatsApp for real-time support and quick resolution of your issues.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="border-l-2 border-white/20 pl-3 sm:pl-4">
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Instant Response</h3>
              <p className="text-white/60 text-xs sm:text-sm">
                Get replies within minutes during business hours. Perfect for urgent issues that need immediate attention.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-3 sm:pl-4">
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Best For</h3>
              <p className="text-white/60 text-xs sm:text-sm">
                Quick questions, urgent issues, clarifications, status updates, and situations requiring back-and-forth conversation.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-3 sm:pl-4">
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Before You Contact</h3>
              <p className="text-white/60 text-xs sm:text-sm">
                Have your screenshots ready, prepare a brief description of the issue, and keep your account details handy for verification.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-3 sm:pl-4">
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Why WhatsApp?</h3>
              <p className="text-white/60 text-xs sm:text-sm">
                Real-time messaging allows quick back-and-forth, easy screenshot sharing, and faster problem-solving through instant communication.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - CTA */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6 p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="text-center pb-3 sm:pb-4 border-b border-white/10">
              <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2">WhatsApp Number</p>
              <button
                onClick={() => handleCopyToClipboard('+919002970210', 'Phone number')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 text-white hover:text-white/80 transition-colors mx-auto group"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold group-hover:underline">
                  +91-9002970210
                </span>
              </button>
            </div>

            <button
              onClick={() => handleCopyToClipboard('+919002970210', 'Phone number')}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors border border-white/20 text-xs sm:text-sm"
            >
              Copy Phone Number
            </button>

            <button
              onClick={handleWhatsAppSupport}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white hover:bg-white/90 text-black font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              Start WhatsApp Chat
            </button>

            <div className="pt-3 sm:pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Mon-Fri, 10 AM - 6 PM IST</span>
              </div>
              <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm font-medium">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Usually responds in minutes</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed">
                  <span className="text-white/70 font-medium">💡 Tip:</span> Share screenshots directly in chat for faster resolution
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </motion.div>
)}

          {/* My Issues Tab */}
          {activeTab === 'my-issues' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 sm:space-y-6 w-full"
            >
              {requestsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-white/40 animate-spin" />
                </div>
              ) : (
                <>
                  {supportRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border border-white/10 bg-white/5 rounded-lg">
                      <Bug className="h-10 w-10 sm:h-12 sm:w-12 text-white/20 mb-4" />
                      <p className="text-white/60 text-xs sm:text-sm">No support requests yet</p>
                      <p className="text-white/40 text-[10px] sm:text-xs mt-1">Click "Create Issue" to submit a request</p>
                    </div>
                  ) : (
                    <>
                      {openRequests.length > 0 && (
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                            Open Requests ({openRequests.length})
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            {openRequests.map((request, index) => (
                              <RequestCard key={request._id} request={request} index={index} />
                            ))}
                          </div>
                        </div>
                      )}

                      {inProgressRequests.length > 0 && (
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                            In Progress ({inProgressRequests.length})
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            {inProgressRequests.map((request, index) => (
                              <RequestCard key={request._id} request={request} index={index} />
                            ))}
                          </div>
                        </div>
                      )}

                      {resolvedRequests.length > 0 && (
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                            Resolved ({resolvedRequests.length})
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            {resolvedRequests.map((request, index) => (
                              <RequestCard key={request._id} request={request} index={index} />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Issue Request Modal */}
      <IssueRequestModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default SupportSection;