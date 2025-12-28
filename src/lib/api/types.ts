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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface CheckLimitResponse {
  success: boolean;
  canSubmit: boolean;
  nextAllowedTime?: string;
  message: string;
}