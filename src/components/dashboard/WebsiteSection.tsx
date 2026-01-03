'use client';

import React, { useState } from 'react';
import { Globe, Loader2, ExternalLink, ImageOff, RefreshCw, Calendar, CreditCard, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WebsiteRequestForm from './WebsiteRequestForm';
import { useRequests, useCheckLimit, useWebsites } from '@/lib/api/hooks';
import { Website, WebsiteStatus, BillingStatus } from '@/lib/api/types';

const statusColors = {
  [WebsiteStatus.CREATED]: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  [WebsiteStatus.IN_PROGRESS]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [WebsiteStatus.REVIEW]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [WebsiteStatus.COMPLETED]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [WebsiteStatus.DEPLOYED]: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  [WebsiteStatus.CANCELLED]: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const billingStatusColors = {
  [BillingStatus.PENDING]: 'text-gray-400',
  [BillingStatus.ACTIVE]: 'text-green-400',
  [BillingStatus.OVERDUE]: 'text-orange-400',
  [BillingStatus.SUSPENDED]: 'text-red-400',
};

const WebsitePreview = ({ url, name }: { url?: string; name: string }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!url || imageError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center rounded-md">
        <div className="text-center space-y-2">
          <ImageOff className="w-8 h-8 md:w-10 md:h-10 text-white/30 mx-auto" />
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
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white/40 animate-spin" />
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
  // Show billing for all DEPLOYED websites
  const hasBilling = website.status === WebsiteStatus.DEPLOYED && website.billing;
  const billingActive = hasBilling;

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    // Shorter format for mobile
    return window.innerWidth < 640 
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCycle = (cycle?: string) => {
    if (!cycle) return '';
    return cycle.charAt(0).toUpperCase() + cycle.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 bg-white/5 transition-all duration-300 rounded-md flex flex-col md:flex-row overflow-hidden"
    >
      {/* Left Side - Image - Smaller on mobile */}
      <div className="w-full md:w-96 h-32 md:h-auto flex-shrink-0 p-2 md:p-4">
        <WebsitePreview url={website.deploymentUrl} name={website.name} />
      </div>

      {/* Right Side - Content */}
      <div className="flex-1 p-3 md:p-6 flex flex-col">
        {/* Header with Visit Button - More compact on mobile */}
        <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-xl font-bold text-white mb-0.5 md:mb-1 truncate">
              {website.name}
            </h3>
            <p className="text-xs md:text-sm text-white/60 line-clamp-1 md:line-clamp-2">
              {website.description || 'No description provided'}
            </p>
          </div>
          {website.deploymentUrl && (
            <a
              href={website.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1.5 md:px-4 md:py-2 bg-white text-black hover:bg-gray-100 rounded-md font-medium text-xs md:text-sm transition-all flex items-center gap-1.5 md:gap-2 flex-shrink-0"
            >
              <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Visit</span>
            </a>
          )}
        </div>

        {/* Details Grid - More compact on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4">
          {/* Status */}
          <div className="flex items-start gap-2">
            <div className="p-1.5 md:p-2 rounded-md bg-white/5 flex-shrink-0">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Status</div>
              <div className={`inline-flex px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-medium border ${statusColors[website.status]}`}>
                {website.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Project Type */}
          <div className="flex items-start gap-2">
            <div className="p-1.5 md:p-2 rounded-md bg-white/5 flex-shrink-0">
              <Globe className="w-3 h-3 md:w-4 md:h-4 text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Type</div>
              <div className="text-xs md:text-sm font-medium text-white truncate">{website.projectType}</div>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-start gap-2 col-span-2 md:col-span-1">
            <div className="p-1.5 md:p-2 rounded-md bg-white/5 flex-shrink-0">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Created</div>
              <div className="text-xs md:text-sm font-medium text-white">{formatDate(website.createdAt)}</div>
            </div>
          </div>

          {/* Domain (if exists) */}
          {website.domain && (
            <div className="flex items-start gap-2 col-span-2 md:col-span-1">
              <div className="p-1.5 md:p-2 rounded-md bg-white/5 flex-shrink-0">
                <Globe className="w-3 h-3 md:w-4 md:h-4 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Domain</div>
                <div className="text-xs md:text-sm font-medium text-white truncate">{website.domain}</div>
              </div>
            </div>
          )}
        </div>

        {/* Billing Section - Only show for DEPLOYED websites - More compact on mobile */}
        {hasBilling && billingActive && (
          <div className="mt-auto pt-3 md:pt-4 border-t border-white/10">
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
              <CreditCard className="w-3 h-3 md:w-4 md:h-4 text-white/60" />
              <h4 className="text-xs md:text-sm font-semibold text-white">Billing</h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              {/* Billing Status */}
              <div className="flex items-start gap-1.5">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Status</div>
                  <div className={`text-xs md:text-sm font-semibold ${billingStatusColors[website.billing.status]}`}>
                    {website.billing.status}
                  </div>
                </div>
              </div>

              {/* Plan & Price */}
              {website.billing.plan && (
                <div className="flex items-start gap-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Plan</div>
                    <div className="text-xs md:text-sm font-medium text-white truncate">
                      {website.billing.plan}
                      {website.billing.price && (
                        <span className="text-white/60 ml-1 text-[10px] md:text-xs">
                          ₹{website.billing.price}/{website.billing.billingCycle?.substring(0, 2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Cycle */}
              {website.billing.billingCycle && (
                <div className="flex items-start gap-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Cycle</div>
                    <div className="text-xs md:text-sm font-medium text-white">
                      {formatCycle(website.billing.billingCycle)}
                    </div>
                  </div>
                </div>
              )}

              {/* Next Due / Last Payment */}
              <div className="flex items-start gap-1.5">
                <div className="flex-1 min-w-0">
                  {website.billing.dueAt ? (
                    <>
                      <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Next Due</div>
                      <div className="text-xs md:text-sm font-medium text-white">
                        {formatDate(website.billing.dueAt)}
                      </div>
                    </>
                  ) : website.billing.lastPaymentAt ? (
                    <>
                      <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">Last Payment</div>
                      <div className="text-xs md:text-sm font-medium text-white">
                        {formatDate(website.billing.lastPaymentAt)}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Warning messages for overdue/suspended - More compact on mobile */}
            {website.billing.status === BillingStatus.OVERDUE && website.billing.graceEndsAt && (
              <div className="mt-2 md:mt-3 p-2 md:p-3 bg-orange-500/10 border border-orange-500/30 rounded-md flex items-start gap-1.5 md:gap-2">
                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] md:text-xs font-medium text-orange-400">Payment Overdue</div>
                  <div className="text-[10px] md:text-xs text-orange-300/80 mt-0.5">
                    Grace ends: {formatDate(website.billing.graceEndsAt)}
                  </div>
                </div>
              </div>
            )}

            {website.billing.status === BillingStatus.SUSPENDED && (
              <div className="mt-2 md:mt-3 p-2 md:p-3 bg-red-500/10 border border-red-500/30 rounded-md flex items-start gap-1.5 md:gap-2">
                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] md:text-xs font-medium text-red-400">Service Suspended</div>
                  <div className="text-[10px] md:text-xs text-red-300/80 mt-0.5">
                    Contact support to reactivate
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - More compact on mobile */}
      <div className="border-b border-white/10 bg-black px-3 md:px-6 lg:px-8 py-2 md:py-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-base md:text-2xl font-bold">My Websites</h1>
            <p className="text-[10px] md:text-sm text-white/60 mt-0.5 md:mt-1 hidden sm:block">
              Manage and monitor all your website projects
            </p>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => refetch()}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-md font-medium transition-all text-xs md:text-sm"
            >
              <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
              Refresh
            </button>
            <button
              onClick={handleOpenForm}
              disabled={!canSubmit}
              className={`flex items-center gap-1.5 px-2 md:px-4 py-1.5 md:py-2 rounded-md font-medium transition-all text-xs md:text-sm ${
                canSubmit 
                  ? 'bg-white text-black hover:bg-gray-100 cursor-pointer' 
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              <Globe className="h-3 w-3 md:h-4 md:w-4" />
              <span>Request</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Websites List - More compact spacing on mobile */}
      <div className="flex-1 overflow-auto px-3 md:px-6 lg:px-8 py-3 md:py-6">
        {websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 md:py-12 border border-white/10 bg-white/5 rounded-md">
            <Globe className="h-8 w-8 md:h-12 md:w-12 text-white/20 mb-3 md:mb-4" />
            <div className="text-sm md:text-base text-white/60">No websites found</div>
            <div className="text-xs md:text-sm text-white/40 mt-1">
              You haven't created any websites yet
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
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