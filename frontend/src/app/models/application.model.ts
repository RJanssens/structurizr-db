export interface Application {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  repositoryId?: number;
  repositoryUrl?: string;
  department?: string;
  author?: string;
  dateCreated?: string;
  isSharedComponent: boolean;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  lastScannedAt?: string;
  technologyStack?: TechnologyStack[];
  outboundInterfaces?: ApplicationInterface[];
  inboundInterfaces?: ApplicationInterface[];
  users?: ApplicationUser[];
  metadata?: ApplicationMetadata[];
}

export interface TechnologyStack {
  id: number;
  applicationId: number;
  name: string;
  version?: string;
  category?: string;
  description?: string;
  detectionSource?: string;
  createdAt: string;
}

export interface ApplicationInterface {
  id: number;
  uuid: string;
  sourceApplicationId: number;
  sourceApplicationName?: string;
  targetApplicationId?: number;
  targetApplicationName?: string;
  name: string;
  description?: string;
  protocol?: string;
  destination?: string;
  port?: number;
  direction: string;
  authenticationMethod?: string;
  detectionSource?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationUser {
  id: number;
  applicationId: number;
  userName: string;
  userType?: string;
  role?: string;
  description?: string;
  createdAt: string;
}

export interface ApplicationMetadata {
  id: number;
  applicationId: number;
  key: string;
  value: string;
  valueType: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationVersion {
  id: number;
  applicationId: number;
  versionNumber: number;
  scannedBranch: string;
  commitHash?: string;
  description?: string;
  department?: string;
  technologyStackSnapshot?: string;
  interfacesSnapshot?: string;
  scanNotes?: string;
  scannedAt: string;
  scannedBy?: string;
}

export interface ApplicationStatistics {
  totalApplications: number;
  sharedComponents: number;
  departments: number;
}
