import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportStatus, SupportCategory, SupportRequest } from '@/lib/api/types';

interface RequestCardProps {
  request: SupportRequest;
  index: number;
}

const RequestCard = ({ request, index }: RequestCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: SupportStatus) => {
    switch (status) {
      case SupportStatus.OPEN:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case SupportStatus.IN_PROGRESS:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case SupportStatus.RESOLVED:
        return 'text-green-400 bg-green-500/10 border-green-500/30';
    }
  };

  const getCategoryLabel = (category: SupportCategory) => {
    const labels = {
      [SupportCategory.BUG]: 'Bug',
      [SupportCategory.CHANGE_REQUEST]: 'Change',
      [SupportCategory.BILLING]: 'Billing',
      [SupportCategory.GENERAL]: 'General',
    };
    return labels[category];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-white/10 bg-white/5 rounded-lg p-3 sm:p-4 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white/70">
              {getCategoryLabel(request.category)}
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{request.subject}</h4>
          <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">
            {request.website?.name} • {formatDate(request.createdAt)}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-white/60" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/60" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-white/70 whitespace-pre-wrap">{request.message}</p>
              {request.website?.deploymentUrl && (
                <a
                  href={request.website.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
                >
                  View Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RequestCard;