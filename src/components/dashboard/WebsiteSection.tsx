'use client';

import React, { useState } from 'react';
import { Globe, Loader2, ExternalLink, Calendar, TrendingUp, ImageOff, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WebsiteRequestForm from './WebsiteRequestForm';
import { useRequests, useCheckLimit, useWebsites } from '@/lib/api/hooks';
import { Website, WebsiteStatus } from '@/lib/api/types';

const statusColors = {
  [WebsiteStatus.CREATED]: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  [WebsiteStatus.IN_PROGRESS]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [WebsiteStatus.REVIEW]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [WebsiteStatus.COMPLETED]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [WebsiteStatus.DEPLOYED]: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  [WebsiteStatus.CANCELLED]: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const WebsitePreview = ({ url, name }: { url?: string; name: string }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!url || imageError) {
    return (
      <div className="w-full h-32 sm:h-40 md:h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-md flex items-center justify-center border-b border-white/10">
        <div className="text-center space-y-2">
          <ImageOff className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/30 mx-auto" />
          <p className="text-white/40 text-xs sm:text-sm">No preview available</p>
        </div>
      </div>
    );
  }

  // Using Microlink API for screenshots
  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <div className="relative w-full h-32 sm:h-40 md:h-48 bg-black/40 rounded-md overflow-hidden border-b border-white/10">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-white/40 animate-spin" />
        </div>
      )}
      <img
        src={screenshotUrl}
        alt={`Preview of ${name}`}
        className="w-full h-full object-cover object-top"
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
      {!imageError && !imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      )}
    </div>
  );
};

const ClientNotesPopover = ({ notes }: { notes: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black hover:bg-white/90 transition-colors flex items-center justify-center text-xs font-bold"
      >
        i
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-64 sm:w-72 pointer-events-none z-50"
          >
            <div className="bg-white rounded-md p-3 sm:p-4 shadow-2xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                <p className="text-xs sm:text-sm font-semibold text-gray-900">Message from Admin</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{notes}</p>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WebsiteCard = ({ website }: { website: Website }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-md hover:bg-white/10 transition-all duration-300 group overflow-hidden"
    >
      {/* Website Preview */}
      <WebsitePreview url={website.deploymentUrl} name={website.name} />

      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-white/90 transition-colors truncate">
              {website.name}
            </h3>
          </div>
          <div className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border whitespace-nowrap ${statusColors[website.status]}`}>
            {website.status.replace('_', ' ')}
          </div>
        </div>

        {/* Assigned Admin Section */}
        {(website.assignedAdmin || website.clientNotes) && (
          <div className="mb-3 p-2.5 sm:p-3 bg-white/5 rounded-md border border-white/10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs text-white/40 mb-0.5">Assigned Admin</p>
                  <p className="text-xs sm:text-sm font-medium text-white/90 truncate">
                    {website.assignedAdmin || 'Not assigned'}
                  </p>
                </div>
              </div>
              {website.clientNotes && (
                <ClientNotesPopover notes={website.clientNotes} />
              )}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <p className="text-[10px] sm:text-xs text-white/40 mb-1">Project Type</p>
            <p className="text-xs sm:text-sm text-white/90 truncate">{website.projectType}</p>
          </div>
          {website.createdAt && (
            <div>
              <p className="text-[10px] sm:text-xs text-white/40 mb-1">Created</p>
              <p className="text-xs sm:text-sm text-white/90">{new Date(website.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Milestones */}
        {website.milestones && website.milestones.length > 0 && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-white/5 rounded-lg">
            <p className="text-[10px] sm:text-xs text-white/60 mb-2">Recent Milestones</p>
            <div className="space-y-1">
              {website.milestones.slice(0, 3).map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 ${milestone.completed ? 'bg-green-400' : 'bg-white/30'}`} />
                  <span className={`truncate ${milestone.completed ? 'text-white/90' : 'text-white/60'}`}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          {website.deploymentUrl && (
            <a
              href={website.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 sm:px-4 py-2 bg-white text-black rounded-lg font-medium text-xs sm:text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Visit Website</span>
            </a>
          )}
          {website.repositoryUrl && (
            <a
              href={website.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-lg font-medium text-xs sm:text-sm hover:bg-white/20 transition-colors border border-white/10 text-center"
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const WebsitesSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // React Query hooks
  const { data: requests = [], isLoading: requestsLoading } = useRequests();
  const { data: websites = [], isLoading: websitesLoading } = useWebsites();
  const { data: limitData, isLoading: limitLoading } = useCheckLimit();

  const canSubmit = limitData?.canSubmit ?? true;
  const isLoading = requestsLoading || limitLoading || websitesLoading;

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError('');
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess('');
    setTimeout(() => setError(''), 5000);
  };

  const handleOpenForm = () => {
    if (!canSubmit && limitData?.nextAllowedTime) {
      const nextTime = new Date(limitData.nextAllowedTime);
      const now = new Date();
      const hoursLeft = Math.ceil((nextTime.getTime() - now.getTime()) / (1000 * 60 * 60));
      handleError(`You can submit another request in ${hoursLeft} hours. Please try again later.`);
      return;
    }
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">My Websites</h1>
          <p className="text-sm sm:text-base text-white/60">Manage and monitor all your website projects</p>
        </div>
        <motion.button
          whileHover={{ scale: canSubmit ? 1.05 : 1 }}
          whileTap={{ scale: canSubmit ? 0.95 : 1 }}
          onClick={handleOpenForm}
          disabled={!canSubmit}
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium shadow-lg transition-all group relative overflow-hidden w-full sm:w-auto text-sm sm:text-base ${
            canSubmit 
              ? 'bg-white text-black hover:bg-gray-100 shadow-white/10 cursor-pointer' 
              : 'bg-white/20 text-white/40 cursor-not-allowed'
          }`}
        >
          <span className="relative z-10">Request Website</span>
          {canSubmit && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </motion.button>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm sm:text-base"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-sm sm:text-base"
        >
          {success}
        </motion.div>
      )}

      {/* Websites Grid or Empty State */}
      {websites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {websites.map((website) => (
            <WebsiteCard key={website._id} website={website} />
          ))}
        </div>
      ) : (
        <motion.div 
          className="flex items-center justify-center min-h-[60vh] sm:min-h-[calc(100vh-16rem)] bg-black/20 backdrop-blur-xl rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center space-y-6 sm:space-y-8 max-w-md px-6 sm:px-4">
            <motion.div 
              className="relative inline-block"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
            >
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 border border-white/10">
                <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-white/40" />
              </div>
            </motion.div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">No Websites Yet</h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Start your journey by requesting your first website. Our team will review your request and get in touch with you shortly.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: canSubmit ? 1.05 : 1 }}
              whileTap={{ scale: canSubmit ? 0.95 : 1 }}
              onClick={handleOpenForm}
              disabled={!canSubmit}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium shadow-lg transition-all inline-flex items-center gap-2 group relative overflow-hidden text-sm sm:text-base ${
                canSubmit 
                  ? 'bg-white text-black hover:bg-gray-100 shadow-white/10 cursor-pointer' 
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              <span className="relative z-10">Request Your First Website</span>
              {canSubmit && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </motion.button>

            {!canSubmit && limitData?.nextAllowedTime && (
              <p className="text-white/40 text-xs sm:text-sm">
                You can submit another request on{' '}
                {new Date(limitData.nextAllowedTime).toLocaleString()}.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Website Request Form Modal */}
      <WebsiteRequestForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </motion.div>
  );
};

export default WebsitesSection;