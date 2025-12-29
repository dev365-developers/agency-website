import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Loader2, Edit2, X, Eye, CheckCircle2, XCircle, Phone, Mail, User, Search, Filter, RefreshCw } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: requests = [], isLoading, refetch } = useRequests();

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

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = search === '' || 
      request.projectName.toLowerCase().includes(search.toLowerCase()) ||
      request.contactName.toLowerCase().includes(search.toLowerCase()) ||
      request.contactEmail.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === '' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: requests.length,
    PENDING: requests.filter(r => r.status === 'PENDING').length,
    IN_REVIEW: requests.filter(r => r.status === 'IN_REVIEW').length,
    CONTACTED: requests.filter(r => r.status === 'CONTACTED').length,
    APPROVED: requests.filter(r => r.status === 'APPROVED').length,
    REJECTED: requests.filter(r => r.status === 'REJECTED').length,
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
            <h1 className="text-lg sm:text-2xl font-bold">My Requests</h1>
            <p className="text-xs sm:text-sm text-white/60 mt-0.5 sm:mt-1 hidden sm:block">
              Track and manage all your website requests
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-all text-xs sm:text-sm"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Stats */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="p-3 sm:p-4 border border-white/10 bg-white/5 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-white/60 mt-1">Total</div>
          </div>
          <div className="p-3 sm:p-4 border border-white/10 bg-white/5 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold">{stats.PENDING}</div>
            <div className="text-xs text-white/60 mt-1">Pending</div>
          </div>
          <div className="p-3 sm:p-4 border border-white/10 bg-white/5 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold">{stats.IN_REVIEW}</div>
            <div className="text-xs text-white/60 mt-1">In Review</div>
          </div>
          <div className="p-3 sm:p-4 border border-white/10 bg-white/5 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold">{stats.CONTACTED}</div>
            <div className="text-xs text-white/60 mt-1">Contacted</div>
          </div>
          <div className="p-3 sm:p-4 border border-white/10 bg-white/5 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold">{stats.APPROVED}</div>
            <div className="text-xs text-white/60 mt-1">Approved</div>
          </div>
          <div className="p-3 sm:p-4 border border-white/10 bg-white/5 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold">{stats.REJECTED}</div>
            <div className="text-xs text-white/60 mt-1">Rejected</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 border-b border-white/10 bg-black px-4 sm:px-6 lg:px-8 py-2.5 sm:py-4">
        <div className="flex gap-2 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 h-9 sm:h-10 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-2 sm:px-4 py-2 text-xs sm:text-sm focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 text-white h-9 sm:h-10 min-w-[100px] sm:min-w-[140px]"
          >
            <option value="" className="bg-black">All Status</option>
            {Object.keys(statusConfig).map((status) => (
              <option key={status} value={status} className="bg-black">
                {statusConfig[status as keyof typeof statusConfig].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="border border-white/10 bg-white/5 rounded-lg hidden md:block">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Filter className="h-12 w-12 text-white/20 mb-4" />
              <div className="text-white/60">No requests found</div>
              <div className="text-sm text-white/40 mt-1">
                {search || statusFilter ? 'Try adjusting your filters' : 'You haven\'t submitted any requests yet'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs sm:text-sm font-medium text-white/60 px-4 py-3">Project Name</th>
                    <th className="text-left text-xs sm:text-sm font-medium text-white/60 px-4 py-3">Type</th>
                    <th className="text-left text-xs sm:text-sm font-medium text-white/60 px-4 py-3">Contact</th>
                    <th className="text-left text-xs sm:text-sm font-medium text-white/60 px-4 py-3">Status</th>
                    <th className="text-left text-xs sm:text-sm font-medium text-white/60 px-4 py-3">Pages</th>
                    <th className="text-left text-xs sm:text-sm font-medium text-white/60 px-4 py-3">Created</th>
                    <th className="text-left text-xs sm:text-sm font-medium text-white/60 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => {
                    const status = statusConfig[request.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr
                        key={request._id}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-sm text-white">{request.projectName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white/60 text-xs sm:text-sm">
                            {projectTypeLabels[request.projectType]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-xs sm:text-sm text-white">{request.contactName}</div>
                            <div className="text-xs text-white/60">{request.contactEmail}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${status.bgColor} border ${status.borderColor}`}>
                            <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                            <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white/60 text-xs sm:text-sm">
                            {request.pagesRequired || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white/60 text-xs sm:text-sm">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-md font-medium transition-all flex items-center gap-1.5 text-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            
                            {request.isEditable && (
                              <button
                                onClick={() => handleEdit(request)}
                                className="px-3 py-1.5 bg-white text-black hover:bg-gray-100 rounded-md font-medium transition-all flex items-center gap-1.5 text-xs"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Filter className="h-12 w-12 text-white/20 mb-4" />
              <div className="text-white/60 text-sm">No requests found</div>
              <div className="text-xs text-white/40 mt-1">
                {search || statusFilter ? 'Try adjusting your filters' : 'You haven\'t submitted any requests yet'}
              </div>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const status = statusConfig[request.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={request._id}
                  className="border border-white/10 bg-white/5 rounded-lg p-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate text-white">{request.projectName}</h3>
                        <p className="text-xs text-white/60 mt-0.5">{request.contactName}</p>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${status.bgColor} border ${status.borderColor}`}>
                        <StatusIcon className={`w-3 h-3 ${status.color}`} />
                        <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-white/60">
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                      <span>{request.pagesRequired || 'N/A'} pages</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      
                      {request.isEditable && (
                        <button
                          onClick={() => handleEdit(request)}
                          className="flex-1 px-3 py-2 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
    </div>
  );
};

export default RequestsSection;