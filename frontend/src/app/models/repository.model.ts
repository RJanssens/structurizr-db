export interface Repository {
  id: number;
  uuid: string;
  gitlabProjectId?: number;
  name: string;
  url: string;
  namespacePath?: string;
  description?: string;
  defaultBranch?: string;
  visibility?: string;
  webUrl?: string;
  sshUrl?: string;
  httpUrl?: string;
  lastActivityAt?: string;
  gitlabCreatedAt?: string;
  isArchived: boolean;
  isEnabledForScanning: boolean;
  topics?: string;
  languages?: string;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Summary statistics
  applicationCount?: number;
  scanCount?: number;
  lastScanAt?: string;
  // Related collections
  applications?: any[];
  recentScans?: RepositoryScan[];
}

export interface RepositoryScan {
  id: number;
  uuid: string;
  repositoryId: number;
  repositoryName?: string;
  repositoryUrl?: string;
  scannedBranch: string;
  commitHash?: string;
  scanStatus: string;
  scanStartedAt: string;
  scanCompletedAt?: string;
  scanDurationSeconds?: number;
  applicationsFound?: number;
  technologiesFound?: number;
  interfacesFound?: number;
  scanType: string;
  initiatedBy?: string;
  scanNotes?: string;
  errorMessage?: string;
  errorDetails?: string;
  scanConfiguration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryStatistics {
  totalRepositories: number;
  enabledRepositories: number;
  archivedRepositories: number;
  repositoriesWithoutApplications: number;
  repositoriesByNamespace: { [key: string]: number };
}

export interface ScanStatistics {
  totalScans: number;
  scansByStatus: { [key: string]: number };
  scansByRepository: {
    repositoryId: number;
    repositoryName: string;
    scanCount: number;
  }[];
  averageScanDurationSeconds: number;
  completedScansCount: number;
  totalApplicationsFound: number;
  totalTechnologiesFound: number;
  totalInterfacesFound: number;
  avgDurationCompletedScans: number;
}
