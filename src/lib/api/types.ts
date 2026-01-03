// lib/api/types.ts

export interface WebsiteRequest {
  _id: string;
  projectName: string;
  description: string;
  projectType: ProjectType;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  pagesRequired?: number;
  features: string[];
  referenceLinks: string[];
  recommendedTemplate?: string;
  selectedPlan?: string;
  status: RequestStatus;
  editableUntil: string;
  createdAt: string;
  updatedAt: string;
  isEditable: boolean;
}

export enum BillingStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  OVERDUE = 'OVERDUE',
  SUSPENDED = 'SUSPENDED',
}

export interface PaymentHistory {
  amount: number;
  date: string;
  method?: string;
  transactionId?: string;
}

export interface Billing {
  status: BillingStatus;
  plan?: string;
  price?: number;
  billingCycle?: 'monthly' | 'quarterly' | 'yearly';
  activatedAt?: string;
  dueAt?: string;
  lastPaymentAt?: string;
  graceEndsAt?: string;
  suspendedAt?: string;
  paymentHistory?: PaymentHistory[];
}

export interface Website {
  _id: string;
  userId: string;
  requestId: string;
  name: string;
  description?: string;
  projectType: string;
  status: WebsiteStatus;
  assignedAdmin?: string;
  domain?: string;
  deploymentUrl?: string;
  repositoryUrl?: string;
  pagesCompleted?: number;
  totalPages?: number;
  completionPercentage?: number;
  adminNotes?: string;
  clientNotes?: string;
  milestones?: Milestone[];
  billing: Billing;
  startedAt?: string;
  completedAt?: string;
  deployedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  title: string;
  completed: boolean;
  completedAt?: string;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  CONTACTED = 'CONTACTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum WebsiteStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  DEPLOYED = 'DEPLOYED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectType {
  BUSINESS = 'BUSINESS',
  ECOMMERCE = 'ECOMMERCE',
  PORTFOLIO = 'PORTFOLIO',
  BLOG = 'BLOG',
  LANDING_PAGE = 'LANDING_PAGE',
  OTHER = 'OTHER',
}

export enum BillingPlan {
  BASIC = 'basic',
  PRO = 'pro',
  CUSTOM = 'custom',
}

export interface CreateWebsiteRequestDTO {
  projectName: string;
  description: string;
  projectType: ProjectType;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  pagesRequired?: number;
  features: string[];
  referenceLinks: string[];
  recommendedTemplate?: string;
  selectedPlan?: string;
}

export interface UpdateBillingDTO {
  plan?: string;
  price?: number;
  billingCycle?: 'monthly' | 'quarterly' | 'yearly';
  status?: BillingStatus;
}

export interface RecordPaymentDTO {
  amount: number;
  method?: string;
  transactionId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  plan?: string;
  message?: string;
  error?: string;
}

export interface CheckLimitResponse {
  success: boolean;
  canSubmit: boolean;
  nextAllowedTime?: string;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface WebsiteStats {
  total: number;
  byStatus: {
    [key in WebsiteStatus]: number;
  };
  byBillingStatus: {
    [key in BillingStatus]: number;
  };
  activeProjects: number;
  completedProjects: number;
  overduePayments: number;
}

export enum SupportCategory {
  BUG = 'BUG',
  CHANGE_REQUEST = 'CHANGE_REQUEST',
  BILLING = 'BILLING',
  GENERAL = 'GENERAL',
}

export enum SupportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export enum SupportPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface SupportRequest {
  _id: string;
  userId: string;
  websiteId: string;
  category: SupportCategory;
  subject: string;
  message: string;
  status: SupportStatus;
  priority?: SupportPriority;
  assignedAdmin?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  website?: {
    _id: string;
    name: string;
    status: WebsiteStatus;
    deploymentUrl?: string;
  };
}

export interface CreateSupportRequestDTO {
  websiteId: string;
  category: SupportCategory;
  subject: string;
  message: string;
}

export interface SupportRequestResponse extends ApiResponse<SupportRequest> {}

export interface SupportRequestsResponse extends ApiResponse<SupportRequest[]> {
  count: number;
}