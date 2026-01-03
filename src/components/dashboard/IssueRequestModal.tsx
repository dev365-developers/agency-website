import React from 'react';
import { 
  X, 
  Send, 
  Loader2, 
  Bug, 
  FileEdit, 
  CreditCard, 
  HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { 
  useCreateSupportRequest, 
  useWebsites 
} from '@/lib/api/hooks';
import { 
  SupportCategory
} from '@/lib/api/types';

interface IssueRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IssueRequestModal = ({ isOpen, onClose }: IssueRequestModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const createSupport = useCreateSupportRequest();
  const { data: websites = [], isLoading: websitesLoading } = useWebsites();
  const selectedCategory = watch('category');

  const categories = [
    { value: SupportCategory.BUG, label: 'Bug Report', icon: Bug, color: 'purple' },
    { value: SupportCategory.CHANGE_REQUEST, label: 'Change Request', icon: FileEdit, color: 'blue' },
    { value: SupportCategory.BILLING, label: 'Billing Issue', icon: CreditCard, color: 'green' },
    { value: SupportCategory.GENERAL, label: 'General Inquiry', icon: HelpCircle, color: 'orange' }
  ];

  const onSubmit = async (data: any) => {
    try {
      await createSupport.mutateAsync(data);
      toast.success('Support request submitted!', {
        description: 'We\'ll get back to you within 24-48 hours',
      });
      reset();
      onClose();
    } catch (error: any) {
      toast.error('Failed to submit request', {
        description: error.message || 'Please try again later',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Create Support Request</h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1">We're here to help you resolve any issues</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Website Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                Select Website <span className="text-red-400">*</span>
              </label>
              <select
                {...register('websiteId', { required: 'Please select a website' })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black border border-white/10 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                disabled={websitesLoading || websites.length === 0}
              >
                <option value="">Choose a website...</option>
                {websites.map((website: any) => (
                  <option key={website._id} value={website._id}>
                    {website.name}
                  </option>
                ))}
              </select>
              {errors.websiteId && (
                <p className="mt-1 text-xs text-red-400">{errors.websiteId.message as string}</p>
              )}
              {websites.length === 0 && !websitesLoading && (
                <p className="mt-1 text-xs text-yellow-400">No websites found. Please create a website request first.</p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                Issue Type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.value;
                  
                  return (
                    <label
                      key={category.value}
                      className={`
                        flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 border rounded-lg cursor-pointer transition-all
                        ${isSelected 
                          ? `bg-${category.color}-500/20 border-${category.color}-500/50` 
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={category.value}
                        {...register('category', { required: 'Please select an issue type' })}
                        className="sr-only"
                      />
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isSelected ? `text-${category.color}-400` : 'text-white/60'}`} />
                      <span className={`text-[10px] sm:text-xs text-center ${isSelected ? 'text-white' : 'text-white/70'}`}>
                        {category.label}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-red-400">{errors.category.message as string}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('subject', { 
                  required: 'Subject is required',
                  maxLength: { value: 150, message: 'Subject must be less than 150 characters' }
                })}
                placeholder="Brief description of your issue"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black border border-white/10 rounded-lg text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-400">{errors.subject.message as string}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                {...register('message', { 
                  required: 'Message is required',
                  maxLength: { value: 3000, message: 'Message must be less than 3000 characters' }
                })}
                rows={5}
                placeholder="Describe your issue in detail..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black border border-white/10 rounded-lg text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-400">{errors.message.message as string}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createSupport.isPending || websites.length === 0}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {createSupport.isPending ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="hidden sm:inline">Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IssueRequestModal;