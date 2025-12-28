import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Loader2, Edit2, X, Eye, CheckCircle2, XCircle, Phone, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRequests } from '@/lib/api/hooks';
import { WebsiteRequest } from '@/lib/api/types';
import EditRequestModal from './EditRequestModal';

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    icon: Clock,
  },
  IN_REVIEW: {
    label: 'In Review',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    icon: FileText,
  },
  CONTACTED: {
    label: 'Contacted',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    icon: Phone,
  },
  APPROVED: {
    label: 'Approved',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    icon: XCircle,
  },
};

const projectTypeLabels = {
  BUSINESS: 'Business',
  ECOMMERCE: 'E-Commerce',
  PORTFOLIO: 'Portfolio',
  BLOG: 'Blog',
  LANDING_PAGE: 'Landing Page',
  OTHER: 'Other',
};

const RequestsSection = () => {
  const [selectedRequest, setSelectedRequest] = useState<WebsiteRequest | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: requests = [], isLoading } = useRequests();

  const handleEdit = (request: WebsiteRequest) => {
    setSelectedRequest(request);
    setShowEditModal(true);
  };

  const handleViewDetails = (request: WebsiteRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const getTimeRemaining = (editableUntil: string) => {
    const now = new Date();
    const deadline = new Date(editableUntil);
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
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
      className="space-y-4 sm:space-y-6 px-3 sm:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">My Requests</h1>
        <p className="text-sm sm:text-base text-white/60">Track and manage all your website requests</p>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <motion.div 
          className="flex items-center justify-center min-h-[60vh] sm:min-h-[calc(100vh-16rem)] bg-black/20 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/10 mx-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center space-y-4 sm:space-y-6 max-w-md px-4">
            <motion.div 
              className="relative inline-block"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
            >
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
              <div className="relative flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/5 border border-white/10">
                <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-white/40" />
              </div>
            </motion.div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">No Requests Yet</h3>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                You haven't submitted any website requests yet. Head to the "My Websites" section to get started.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {requests.map((request, index) => {
            const status = statusConfig[request.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            
            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-neutral-900/80 via-neutral-900/60 to-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-sm p-4 sm:p-6 hover:border-white/20 hover:shadow-lg hover:shadow-white/5 transition-all group"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-white/10 blur-xl rounded-md" />
                        <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">{request.projectName}</h3>
                        <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{request.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm ${status.bgColor} border ${status.borderColor} flex items-center gap-1.5 sm:gap-2`}>
                            <StatusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${status.color}`} />
                            <span className={`text-xs sm:text-sm font-medium ${status.color}`}>{status.label}</span>
                          </div>
                          
                          <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm bg-white/5 border border-white/10">
                            <span className="text-xs sm:text-sm text-white/60">{projectTypeLabels[request.projectType]}</span>
                          </div>
                          
                          {request.pagesRequired && (
                            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm bg-white/5 border border-white/10">
                              <span className="text-xs sm:text-sm text-white/60">{request.pagesRequired} pages</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-white/50 sm:pl-15">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">Submitted {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {request.isEditable && (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Edit: {getTimeRemaining(request.editableUntil)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(request)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">View</span>
                    </motion.button>
                    
                    {request.isEditable && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(request)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg"
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Edit</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <EditRequestModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        request={selectedRequest}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 sm:p-5 flex items-center justify-between z-10">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-0.5 sm:mb-1 truncate">Request Details</h2>
                <p className="text-neutral-400 text-xs sm:text-sm truncate">Submitted on {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-neutral-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-neutral-800 rounded-lg flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-2 sm:mb-3">Current Status</h3>
                <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${statusConfig[selectedRequest.status as keyof typeof statusConfig].bgColor} border ${statusConfig[selectedRequest.status as keyof typeof statusConfig].borderColor}`}>
                  {React.createElement(statusConfig[selectedRequest.status as keyof typeof statusConfig].icon, {
                    className: `w-4 h-4 sm:w-5 sm:h-5 ${statusConfig[selectedRequest.status as keyof typeof statusConfig].color}`
                  })}
                  <span className={`font-medium text-sm sm:text-base ${statusConfig[selectedRequest.status as keyof typeof statusConfig].color}`}>
                    {statusConfig[selectedRequest.status as keyof typeof statusConfig].label}
                  </span>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-2 sm:mb-3">Project Information</h3>
                <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider">Project Name</label>
                    <p className="text-sm sm:text-base text-white font-medium mt-1">{selectedRequest.projectName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider">Project Type</label>
                    <p className="text-sm sm:text-base text-white font-medium mt-1">{projectTypeLabels[selectedRequest.projectType]}</p>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider">Description</label>
                    <p className="text-sm sm:text-base text-white/80 mt-1 leading-relaxed">{selectedRequest.description}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-2 sm:mb-3">Contact Information</h3>
                <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <User className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="text-xs text-white/40 uppercase tracking-wider">Name</label>
                      <p className="text-sm sm:text-base text-white font-medium truncate">{selectedRequest.contactName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="text-xs text-white/40 uppercase tracking-wider">Email</label>
                      <p className="text-sm sm:text-base text-white font-medium truncate">{selectedRequest.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Phone className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="text-xs text-white/40 uppercase tracking-wider">Phone</label>
                      <p className="text-sm sm:text-base text-white font-medium truncate">{selectedRequest.contactPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-2 sm:mb-3">Additional Details</h3>
                <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {selectedRequest.pagesRequired && (
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Pages Required</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1">{selectedRequest.pagesRequired}</p>
                    </div>
                  )}
                  {selectedRequest.selectedPlan && (
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Selected Plan</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1">{selectedRequest.selectedPlan}</p>
                    </div>
                  )}
                  {selectedRequest.features.length > 0 && (
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Features</label>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                        {selectedRequest.features.map((feature, idx) => (
                          <span key={idx} className="px-2 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm text-white/80">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedRequest.referenceLinks.length > 0 && (
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Reference Links</label>
                      <div className="space-y-1 mt-2">
                        {selectedRequest.referenceLinks.map((link, idx) => (
                          <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:text-blue-300 text-xs sm:text-sm underline truncate">
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedRequest.recommendedTemplate && (
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Recommended Template</label>
                      <p className="text-sm sm:text-base text-white font-medium mt-1">{selectedRequest.recommendedTemplate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-2 sm:mb-3">Timeline</h3>
                <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                    <span className="text-white/60">Submitted</span>
                    <span className="text-white font-medium text-right">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                    <span className="text-white/60">Last Updated</span>
                    <span className="text-white font-medium text-right">{new Date(selectedRequest.updatedAt).toLocaleString()}</span>
                  </div>
                  {selectedRequest.isEditable && (
                    <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-white/10 gap-2">
                      <span className="text-yellow-400">Edit Window Expires</span>
                      <span className="text-yellow-400 font-medium text-right">{getTimeRemaining(selectedRequest.editableUntil)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default RequestsSection;