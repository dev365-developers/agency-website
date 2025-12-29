'use client';

import React, { useState } from 'react';
import { Globe, Loader2, ExternalLink, ImageOff, User, Mail, Phone, RefreshCw } from 'lucide-react';
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
      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center rounded-md">
        <div className="text-center space-y-2">
          <ImageOff className="w-10 h-10 text-white/30 mx-auto" />
          <p className="text-white/40 text-xs">No preview</p>
        </div>
      </div>
    );
  }

  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <div className="relative w-full h-full bg-black/40 overflow-hidden rounded-md">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
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
    </div>
  );
};

const WebsiteCard = ({ website }: { website: Website }) => {
  // Parse assigned admin string
  const adminParts = website.assignedAdmin ? website.assignedAdmin.split(',').map(part => part.trim()) : [];
  const adminName = adminParts[0] || 'N/A';
  const adminEmail = adminParts[1] || 'N/A';
  const adminPhone = adminParts[2] || 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 bg-white/5 transition-all duration-300 rounded-md flex flex-col md:flex-row overflow-hidden"
    >
      {/* Left Side - Image */}
      <div className="w-full md:w-96 h-48 md:h-auto flex-shrink-0 p-4">
        <WebsitePreview url={website.deploymentUrl} name={website.name} />
      </div>

      {/* Right Side - Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1 truncate">
              {website.name}
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/60">
              <span>{website.projectType}</span>
              <span>•</span>
              <span>Created {new Date(website.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium border whitespace-nowrap ${statusColors[website.status]}`}>
            {website.status.replace('_', ' ')}
          </div>
        </div>

        {/* Assigned Admin Section - 3 columns */}
        {website.assignedAdmin && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-md border border-white/10">
            <div className="text-[10px] sm:text-xs text-white/40 mb-2 sm:mb-3 uppercase tracking-wider">Assigned Admin</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Name */}
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-white/60 mb-0.5">Name</div>
                  <div className="text-xs sm:text-sm font-medium text-white truncate">{adminName}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-white/60 mb-0.5">Email</div>
                  <div className="text-xs sm:text-sm font-medium text-white truncate">{adminEmail}</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-white/60 mb-0.5">Phone</div>
                  <div className="text-xs sm:text-sm font-medium text-white truncate">{adminPhone}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          {website.deploymentUrl && (
            <a
              href={website.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-black hover:bg-gray-100 rounded-md font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-2 flex-1 justify-center"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              Visit Website
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

  const { data: websites = [], isLoading: websitesLoading, refetch } = useWebsites();
  const { data: limitData, isLoading: limitLoading } = useCheckLimit();

  const canSubmit = limitData?.canSubmit ?? true;
  const isLoading = websitesLoading || limitLoading;

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

  // Calculate stats
  const stats = {
    total: websites.length,
    CREATED: websites.filter(w => w.status === WebsiteStatus.CREATED).length,
    IN_PROGRESS: websites.filter(w => w.status === WebsiteStatus.IN_PROGRESS).length,
    REVIEW: websites.filter(w => w.status === WebsiteStatus.REVIEW).length,
    COMPLETED: websites.filter(w => w.status === WebsiteStatus.COMPLETED).length,
    DEPLOYED: websites.filter(w => w.status === WebsiteStatus.DEPLOYED).length,
    CANCELLED: websites.filter(w => w.status === WebsiteStatus.CANCELLED).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/10 bg-black px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">My Websites</h1>
            <p className="text-xs sm:text-sm text-white/60 mt-0.5 sm:mt-1 hidden sm:block">
              Manage and monitor all your website projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-md font-medium transition-all text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={handleOpenForm}
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-all text-xs sm:text-sm ${
                canSubmit 
                  ? 'bg-white text-black hover:bg-gray-100 cursor-pointer' 
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Request Website</span>
              <span className="sm:hidden">Request</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          <div className="p-4 border border-white/10 bg-white/5 rounded-md">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-white/60 mt-1">Total</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5 rounded-md">
            <div className="text-2xl font-bold">{stats.CREATED}</div>
            <div className="text-xs text-white/60 mt-1">Created</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5 rounded-md">
            <div className="text-2xl font-bold">{stats.IN_PROGRESS}</div>
            <div className="text-xs text-white/60 mt-1">In Progress</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5 rounded-md">
            <div className="text-2xl font-bold">{stats.REVIEW}</div>
            <div className="text-xs text-white/60 mt-1">Review</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5 rounded-md">
            <div className="text-2xl font-bold">{stats.DEPLOYED}</div>
            <div className="text-xs text-white/60 mt-1">Deployed</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5 rounded-md">
            <div className="text-2xl font-bold">{stats.CANCELLED}</div>
            <div className="text-xs text-white/60 mt-1">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 sm:mx-6 lg:mx-8 mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-md text-red-300 text-xs sm:text-sm"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 sm:mx-6 lg:mx-8 mt-3 sm:mt-4 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-md text-green-300 text-xs sm:text-sm"
        >
          {success}
        </motion.div>
      )}

      {/* Websites List */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-white/10 bg-white/5 rounded-md">
            <Globe className="h-12 w-12 text-white/20 mb-4" />
            <div className="text-white/60">No websites found</div>
            <div className="text-sm text-white/40 mt-1">
              You haven't created any websites yet
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {websites.map((website) => (
              <WebsiteCard key={website._id} website={website} />
            ))}
          </div>
        )}
      </div>

      {/* Website Request Form Modal */}
      <WebsiteRequestForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default WebsitesSection;