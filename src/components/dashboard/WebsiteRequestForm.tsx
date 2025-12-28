import React, { useState } from "react";
import { X, Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { ProjectType, CreateWebsiteRequestDTO } from "@/lib/api/types";
import { useCreateRequest } from "@/lib/api/hooks";
import { toast } from "sonner";

interface FormData {
  projectName: string;
  description: string;
  projectType: ProjectType;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  pagesRequired: string;
  features: string;
  referenceLinks: string;
  recommendedTemplate: string;
  selectedPlan: string;
}

interface WebsiteRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const MultiStepWebsiteRequestForm: React.FC<WebsiteRequestFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const createRequestMutation = useCreateRequest();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    description: "",
    projectType: ProjectType.BUSINESS,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    pagesRequired: "",
    features: "",
    referenceLinks: "",
    recommendedTemplate: "",
    selectedPlan: "",
  });

  const totalSteps = 3;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.projectName.trim()) {
          onError("Project name is required");
          return false;
        }
        if (!formData.description.trim()) {
          onError("Description is required");
          return false;
        }
        return true;
      case 2:
        if (!formData.contactName.trim()) {
          onError("Contact name is required");
          return false;
        }
        if (!formData.contactEmail.trim()) {
          onError("Contact email is required");
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
          onError("Please provide a valid email");
          return false;
        }
        if (!formData.contactPhone.trim()) {
          onError("Contact phone is required");
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    const toastId = toast.loading("Submitting request...", {
      description: "Please wait while we process your request",
    });
    try {
      const submitData: CreateWebsiteRequestDTO = {
        projectName: formData.projectName,
        description: formData.description,
        projectType: formData.projectType,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        pagesRequired: formData.pagesRequired
          ? parseInt(formData.pagesRequired)
          : undefined,
        features: formData.features
          ? formData.features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        referenceLinks: formData.referenceLinks
          ? formData.referenceLinks
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean)
          : [],
        recommendedTemplate: formData.recommendedTemplate || undefined,
        selectedPlan: formData.selectedPlan || undefined,
      };

      await createRequestMutation.mutateAsync(submitData);
      toast.success("Request submitted successfully!", {
        id: toastId,
        description: "We'll contact you soon",
        duration: 5000,
      });

      onSuccess("Request submitted successfully! We'll contact you soon.");

      // Reset form
      setFormData({
        projectName: "",
        description: "",
        projectType: ProjectType.BUSINESS,
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        pagesRequired: "",
        features: "",
        referenceLinks: "",
        recommendedTemplate: "",
        selectedPlan: "",
      });
      setCurrentStep(1);
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit request";
      toast.error("Failed to submit request", {
        id: toastId,
        description: errorMessage,
        duration: 5000,
      });
      onError(errorMessage);
    }
  };

  const handleClose = () => {
    if (!createRequestMutation.isPending) {
      setCurrentStep(1);
      onClose();
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Project Details";
      case 2:
        return "Contact Information";
      case 3:
        return "Additional Details";
      default:
        return "";
    }
  };

  const getStepSubtitle = (step: number) => {
    switch (step) {
      case 1:
        return "Tell us about your project requirements";
      case 2:
        return "How can we reach you?";
      case 3:
        return "Optional information to help us serve you better";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl w-full max-w-2xl shadow-2xl animate-fadeIn max-h-[95vh] sm:max-h-none overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 sm:p-5 flex items-center justify-between z-10">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                {getStepTitle(currentStep)}
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm line-clamp-1">
                {getStepSubtitle(currentStep)}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={createRequestMutation.isPending}
              className="text-neutral-400 hover:text-white transition-colors disabled:opacity-50 p-1.5 sm:p-2 hover:bg-neutral-800 rounded-lg flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-3 sm:px-5 pt-4 sm:pt-5">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${
                        step < currentStep
                          ? "bg-white text-black"
                          : step === currentStep
                          ? "bg-white text-black ring-2 sm:ring-4 ring-white/20"
                          : "bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {step < currentStep ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        step
                      )}
                    </div>
                  </div>
                  {step < 3 && (
                    <div className="flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          step < currentStep
                            ? "bg-white w-full"
                            : "bg-neutral-800 w-0"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-neutral-500 mb-4 sm:mb-5">
              <span
                className={currentStep >= 1 ? "text-white font-medium" : ""}
              >
                Project
              </span>
              <span
                className={currentStep >= 2 ? "text-white font-medium" : ""}
              >
                Contact
              </span>
              <span
                className={currentStep >= 3 ? "text-white font-medium" : ""}
              >
                Details
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-3 sm:mx-5 mb-3 sm:mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Form Content */}
          <div className="px-3 sm:px-5 pb-4 sm:pb-5">
            <div className="min-h-[300px] sm:min-h-[350px]">
              {/* Step 1: Project Details */}
              {currentStep === 1 && (
                <div className="space-y-3 sm:space-y-4 animate-slideIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                        Project Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        maxLength={100}
                        disabled={createRequestMutation.isPending}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                        placeholder="My Awesome Website"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                        Project Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        disabled={createRequestMutation.isPending}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                      >
                        <option value={ProjectType.BUSINESS} className="bg-neutral-900">Business</option>
                        <option value={ProjectType.ECOMMERCE} className="bg-neutral-900">E-Commerce</option>
                        <option value={ProjectType.PORTFOLIO} className="bg-neutral-900">Portfolio</option>
                        <option value={ProjectType.BLOG} className="bg-neutral-900">Blog</option>
                        <option value={ProjectType.LANDING_PAGE} className="bg-neutral-900">Landing Page</option>
                        <option value={ProjectType.OTHER} className="bg-neutral-900">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      maxLength={2000}
                      rows={5}
                      disabled={createRequestMutation.isPending}
                      className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 resize-none transition-all disabled:opacity-50"
                      placeholder="Describe your website project in detail..."
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-3 sm:space-y-4 animate-slideIn">
                  <div>
                    <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                      Contact Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      disabled={createRequestMutation.isPending}
                      className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                        Contact Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        disabled={createRequestMutation.isPending}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                        Contact Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        disabled={createRequestMutation.isPending}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[10px] sm:text-xs font-bold">i</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-xs sm:text-sm mb-0.5 sm:mb-1">
                          Why do we need this information?
                        </p>
                        <p className="text-neutral-400 text-[10px] sm:text-xs leading-relaxed">
                          We'll use your contact details to send you project
                          updates and discuss your requirements in detail.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <div className="space-y-3 sm:space-y-4 animate-slideIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                        Pages Required
                      </label>
                      <input
                        type="number"
                        name="pagesRequired"
                        value={formData.pagesRequired}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        disabled={createRequestMutation.isPending}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                        placeholder="5"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                        Preferred Plan
                        <div className="relative group">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500/20 flex items-center justify-center cursor-help">
                            <span className="text-blue-400 text-[10px] sm:text-xs font-bold">i</span>
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 sm:w-64 p-2 sm:p-3 bg-neutral-900 border border-blue-500/30 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <p className="text-blue-400 font-medium text-[10px] sm:text-xs mb-1">
                              About Plan Selection
                            </p>
                            <p className="text-neutral-300 text-[10px] sm:text-xs leading-relaxed">
                              Your plan selection is just for reference. The
                              final plan will be determined through mutual
                              discussion based on your specific requirements. No
                              payment will be taken at this stage.
                            </p>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500/30"></div>
                          </div>
                        </div>
                      </label>
                      <select
                        name="selectedPlan"
                        value={formData.selectedPlan}
                        onChange={handleInputChange}
                        disabled={createRequestMutation.isPending}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                      >
                        <option value="" className="bg-neutral-900">Select a plan...</option>
                        <option value="BASIC" className="bg-neutral-900">Basic</option>
                        <option value="PRO" className="bg-neutral-900">Pro</option>
                        <option value="ENTERPRISE" className="bg-neutral-900">Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                      Features (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      disabled={createRequestMutation.isPending}
                      className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                      placeholder="Contact form, Blog, E-commerce"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                      Reference Links (comma-separated URLs)
                    </label>
                    <input
                      type="text"
                      name="referenceLinks"
                      value={formData.referenceLinks}
                      onChange={handleInputChange}
                      disabled={createRequestMutation.isPending}
                      className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                      placeholder="https://example.com, https://inspiration.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                      Recommended Template
                    </label>
                    <input
                      type="text"
                      name="recommendedTemplate"
                      value={formData.recommendedTemplate}
                      onChange={handleInputChange}
                      disabled={createRequestMutation.isPending}
                      className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-xs sm:text-sm placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-50"
                      placeholder="Modern Business, Minimal Portfolio"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-neutral-800">
              <div className="flex-1">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={createRequestMutation.isPending}
                    className="px-3 sm:px-5 py-2 sm:py-2.5 border border-neutral-700 bg-neutral-800 text-white text-xs sm:text-sm rounded-lg font-medium hover:bg-neutral-700 transition-all disabled:opacity-50 flex items-center gap-1.5 sm:gap-2"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Back</span>
                  </button>
                )}
              </div>

              <div className="text-[10px] sm:text-xs text-neutral-500 font-medium">
                Step {currentStep} of {totalSteps}
              </div>

              <div className="flex-1 flex justify-end">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={createRequestMutation.isPending}
                    className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white text-black text-xs sm:text-sm rounded-lg font-medium hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center gap-1.5 sm:gap-2 shadow-lg"
                  >
                    <span className="hidden xs:inline">Next Step</span>
                    <span className="xs:hidden">Next</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={createRequestMutation.isPending}
                    className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white text-black text-xs sm:text-sm rounded-lg font-medium hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center gap-1.5 sm:gap-2 shadow-lg"
                  >
                    {createRequestMutation.isPending ? (
                      <>
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        <span className="hidden xs:inline">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden xs:inline">Submit Request</span>
                        <span className="xs:hidden">Submit</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MultiStepWebsiteRequestForm;