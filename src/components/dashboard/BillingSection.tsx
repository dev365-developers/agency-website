import React, { useState } from 'react';
import { CreditCard, AlertCircle, ChevronDown, ChevronUp, Mail, Phone, Calendar, DollarSign, Info, Loader2, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useWebsitesByPlan } from '@/lib/api/hooks';
import { Website, BillingStatus, BillingPlan } from '@/lib/api/types';
import { toast } from 'sonner';

const BillingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');

  const { data: websites = [], isLoading } = useWebsitesByPlan(selectedPlan);

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!', {
        description: `${label} has been copied`,
        duration: 2000,
      });
    }).catch(() => {
      toast.error('Failed to copy', {
        description: 'Please try again',
        duration: 2000,
      });
    });
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getBillingStatusColor = (status: BillingStatus) => {
    switch (status) {
      case BillingStatus.ACTIVE:
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case BillingStatus.PENDING:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case BillingStatus.OVERDUE:
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case BillingStatus.SUSPENDED:
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/10 bg-black px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">Billing</h1>
            <p className="text-xs sm:text-sm text-white/60 mt-0.5 sm:mt-1 hidden sm:block">
              Manage your subscriptions and billing information
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Plan Change Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 sm:p-6"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Want to upgrade or downgrade your plan?
                </h3>
                <p className="text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">
                  Plan changes are handled manually by our team to ensure a smooth transition.
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                  <button
                    onClick={() => handleCopyToClipboard('billing@dev365.in', 'Email')}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">agency.dev365@gmail.com</span>
                  </button>
                  <button
                    onClick={() => handleCopyToClipboard('+919876543210', 'Phone number')}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>+91-9002970210</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Plan Tabs */}
          <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="w-full">
            <TabsList className="inline-flex gap-1 bg-white/5 border border-white/10 p-1">
              <TabsTrigger 
                value="basic"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm"
              >
                Basic
              </TabsTrigger>
              <TabsTrigger 
                value="pro"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm"
              >
                Pro
              </TabsTrigger>
              <TabsTrigger 
                value="custom"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm"
              >
                Custom
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="mt-4 sm:mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-white/40 animate-spin" />
                </div>
              ) : websites.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 border border-white/10 bg-white/5 rounded-lg"
                >
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 text-white/20 mb-3 sm:mb-4" />
                  <p className="text-white/60 text-xs sm:text-sm">
                    No websites found on this plan
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {websites.map((website, index) => (
                    <WebsiteCard key={website._id} website={website} index={index} />
                  ))}
                </div>
              )}
            </div>
          </Tabs>

          {/* Payment Policy Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6"
          >
            <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />
              <span>What happens if payment is missed?</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/70">
              Your website will be temporarily paused if payment is not received within the grace period. 
              Access is restored immediately after payment confirmation.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const WebsiteCard = ({ website, index }: { website: Website; index: number }) => {
  const [showHistory, setShowHistory] = useState(false);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getBillingStatusColor = (status: BillingStatus) => {
    switch (status) {
      case BillingStatus.ACTIVE:
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case BillingStatus.PENDING:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case BillingStatus.OVERDUE:
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case BillingStatus.SUSPENDED:
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getCycleLabel = (cycle?: string) => {
    if (!cycle) return '';
    return cycle.charAt(0).toUpperCase() + cycle.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-white/10 bg-white/5 rounded-lg p-4 sm:p-6"
    >
      {/* Website Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-0.5 sm:mb-1 truncate">{website.name}</h3>
          {website.description && (
            <p className="text-xs sm:text-sm text-white/60 line-clamp-2">{website.description}</p>
          )}
        </div>
        <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs font-medium border ${getBillingStatusColor(website.billing.status)} flex-shrink-0`}>
          {website.billing.status}
        </div>
      </div>

      {/* Billing Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Billing Status */}
        <div className="space-y-0.5 sm:space-y-1">
          <div className="text-xs text-white/50">Billing Status</div>
          <div className={`text-xs sm:text-sm font-semibold ${getBillingStatusColor(website.billing.status).split(' ')[0]}`}>
            {website.billing.status}
          </div>
        </div>

        {/* Plan & Price */}
        {website.billing.plan && (
          <div className="space-y-0.5 sm:space-y-1">
            <div className="text-xs text-white/50">Plan</div>
            <div className="text-xs sm:text-sm font-medium text-white">
              {website.billing.plan}
              {website.billing.price && website.billing.billingCycle && (
                <span className="text-white/60 ml-1 text-xs">
                  ({formatCurrency(website.billing.price)}/{website.billing.billingCycle.substring(0, 2)})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Billing Cycle */}
        {website.billing.billingCycle && (
          <div className="space-y-0.5 sm:space-y-1">
            <div className="text-xs text-white/50">Cycle</div>
            <div className="text-xs sm:text-sm font-medium text-white">
              {getCycleLabel(website.billing.billingCycle)}
            </div>
          </div>
        )}

        {/* Next Due Date */}
        {website.billing.dueAt && (
          <div className="space-y-0.5 sm:space-y-1">
            <div className="text-xs text-white/50">Next Due Date</div>
            <div className="text-xs sm:text-sm font-medium text-white">
              {formatDate(website.billing.dueAt)}
            </div>
          </div>
        )}
      </div>

      {/* Warning Messages */}
      {website.billing.status === BillingStatus.OVERDUE && website.billing.graceEndsAt && (
        <Alert className="mb-3 sm:mb-4 bg-orange-500/10 border-orange-500/30">
          <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400" />
          <AlertDescription className="text-orange-300">
            <div className="font-medium text-xs sm:text-sm">Payment Overdue</div>
            <div className="text-xs mt-0.5 sm:mt-1">
              Grace period ends: {formatDate(website.billing.graceEndsAt)}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {website.billing.status === BillingStatus.SUSPENDED && (
        <Alert className="mb-3 sm:mb-4 bg-red-500/10 border-red-500/30">
          <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            <div className="font-medium text-xs sm:text-sm">Service Suspended</div>
            <div className="text-xs mt-0.5 sm:mt-1">
              Please contact support to reactivate your service
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment History */}
      {website.billing.paymentHistory && website.billing.paymentHistory.length > 0 && (
        <Collapsible open={showHistory} onOpenChange={setShowHistory}>
          <CollapsibleTrigger className="flex items-center gap-2 text-xs sm:text-sm text-white/70 hover:text-white transition-colors">
            {showHistory ? (
              <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            Payment History ({website.billing.paymentHistory.length})
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 sm:mt-4">
            <div className="space-y-2">
              {website.billing.paymentHistory.map((payment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-2 sm:px-3 rounded-sm border border-white/10"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-white/80 truncate">
                      {formatDate(payment.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-medium text-white">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 sm:py-1 rounded">
                      Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </motion.div>
  );
};

export default BillingSection;