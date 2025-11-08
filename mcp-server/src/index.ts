#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.STRUCTURIZR_API_URL || "http://localhost:8080/api";

class StructurizrMCPServer {
  private server: Server;
  private api: AxiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: "structurizr-architecture-scanner",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupPromptHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "list_applications",
          description: "List all applications in the architecture landscape",
          inputSchema: {
            type: "object",
            properties: {
              department: {
                type: "string",
                description: "Filter by department (optional)",
              },
              sharedOnly: {
                type: "boolean",
                description: "Only return shared components (optional)",
              },
            },
          },
        },
        {
          name: "get_application",
          description: "Get detailed information about a specific application",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                description: "Application ID",
              },
              uuid: {
                type: "string",
                description: "Application UUID (alternative to id)",
              },
            },
            oneOf: [{ required: ["id"] }, { required: ["uuid"] }],
          },
        },
        {
          name: "search_applications",
          description: "Search applications by name or description",
          inputSchema: {
            type: "object",
            properties: {
              term: {
                type: "string",
                description: "Search term",
              },
            },
            required: ["term"],
          },
        },
        {
          name: "create_application",
          description: "Create a new application entry",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Application name",
              },
              description: {
                type: "string",
                description: "Application description",
              },
              repositoryUrl: {
                type: "string",
                description: "GitLab repository URL",
              },
              department: {
                type: "string",
                description: "Department responsible",
              },
              author: {
                type: "string",
                description: "Author/creator",
              },
              isSharedComponent: {
                type: "boolean",
                description: "Is this a shared component?",
              },
            },
            required: ["name"],
          },
        },
        {
          name: "get_technology_stack",
          description: "Get technology stack for an application",
          inputSchema: {
            type: "object",
            properties: {
              applicationId: {
                type: "number",
                description: "Application ID",
              },
            },
            required: ["applicationId"],
          },
        },
        {
          name: "find_applications_by_technology",
          description: "Find applications using a specific technology",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Technology name (e.g., 'Spring Boot')",
              },
              version: {
                type: "string",
                description: "Technology version (optional)",
              },
            },
            required: ["name"],
          },
        },
        {
          name: "get_application_interfaces",
          description: "Get interfaces (connections) for an application",
          inputSchema: {
            type: "object",
            properties: {
              applicationId: {
                type: "number",
                description: "Application ID",
              },
            },
            required: ["applicationId"],
          },
        },
        {
          name: "get_version_history",
          description: "Get version history for an application",
          inputSchema: {
            type: "object",
            properties: {
              applicationId: {
                type: "number",
                description: "Application ID",
              },
            },
            required: ["applicationId"],
          },
        },
        {
          name: "get_statistics",
          description: "Get overall architecture landscape statistics",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_all_departments",
          description: "Get list of all departments in the landscape",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_all_technologies",
          description: "Get list of all technologies used across the landscape",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "list_repositories",
          description: "List all GitLab repositories",
          inputSchema: {
            type: "object",
            properties: {
              namespace: {
                type: "string",
                description: "Filter by namespace/group (optional)",
              },
              enabledOnly: {
                type: "boolean",
                description: "Only return enabled repositories (optional)",
              },
              archivedOnly: {
                type: "boolean",
                description: "Only return archived repositories (optional)",
              },
            },
          },
        },
        {
          name: "get_repository",
          description: "Get detailed information about a specific repository",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                description: "Repository ID",
              },
              uuid: {
                type: "string",
                description: "Repository UUID (alternative to id)",
              },
            },
            oneOf: [{ required: ["id"] }, { required: ["uuid"] }],
          },
        },
        {
          name: "search_repositories",
          description: "Search repositories by name or description",
          inputSchema: {
            type: "object",
            properties: {
              term: {
                type: "string",
                description: "Search term",
              },
            },
            required: ["term"],
          },
        },
        {
          name: "create_repository",
          description: "Create a new repository entry",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Repository name",
              },
              url: {
                type: "string",
                description: "Repository URL",
              },
              namespacePath: {
                type: "string",
                description: "Namespace/group path",
              },
              description: {
                type: "string",
                description: "Repository description",
              },
              defaultBranch: {
                type: "string",
                description: "Default branch name",
              },
              visibility: {
                type: "string",
                description: "Visibility (public, private, internal)",
              },
            },
            required: ["name", "url"],
          },
        },
        {
          name: "get_repository_statistics",
          description: "Get repository statistics",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "list_repository_scans",
          description: "List repository scans",
          inputSchema: {
            type: "object",
            properties: {
              repositoryId: {
                type: "number",
                description: "Filter by repository ID (optional)",
              },
              status: {
                type: "string",
                description: "Filter by scan status (optional)",
              },
            },
          },
        },
        {
          name: "get_repository_scan",
          description: "Get detailed information about a specific scan",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                description: "Scan ID",
              },
              uuid: {
                type: "string",
                description: "Scan UUID (alternative to id)",
              },
            },
            oneOf: [{ required: ["id"] }, { required: ["uuid"] }],
          },
        },
        {
          name: "create_repository_scan",
          description: "Create a new repository scan entry",
          inputSchema: {
            type: "object",
            properties: {
              repositoryId: {
                type: "number",
                description: "Repository ID to scan",
              },
              scannedBranch: {
                type: "string",
                description: "Branch to scan",
              },
              scanType: {
                type: "string",
                description: "Scan type (FULL, INCREMENTAL, METADATA_ONLY)",
              },
              initiatedBy: {
                type: "string",
                description: "Who initiated the scan",
              },
            },
            required: ["repositoryId", "scannedBranch"],
          },
        },
        {
          name: "get_scan_statistics",
          description: "Get repository scan statistics",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "list_applications": {
            let url = "/applications";
            if (args.sharedOnly) {
              url = "/applications/shared-components";
            } else if (args.department) {
              url = `/applications/department/${args.department}`;
            }
            const response = await this.api.get(url);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_application": {
            const url = args.uuid
              ? `/applications/uuid/${args.uuid}`
              : `/applications/${args.id}`;
            const response = await this.api.get(url);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "search_applications": {
            const response = await this.api.get("/applications/search", {
              params: { term: args.term },
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "create_application": {
            const response = await this.api.post("/applications", args);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_technology_stack": {
            const response = await this.api.get(
              `/technology-stack/application/${args.applicationId}`
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "find_applications_by_technology": {
            const params: any = { name: args.name };
            if (args.version) {
              params.version = args.version;
            }
            const response = await this.api.get("/technology-stack/search", {
              params,
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_application_interfaces": {
            const response = await this.api.get(
              `/interfaces/application/${args.applicationId}`
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_version_history": {
            const response = await this.api.get(
              `/versions/application/${args.applicationId}`
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_statistics": {
            const response = await this.api.get("/applications/statistics");
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_all_departments": {
            const response = await this.api.get("/applications/departments");
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_all_technologies": {
            const response = await this.api.get("/technology-stack/technologies");
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "list_repositories": {
            let url = "/repositories";
            if (args.enabledOnly) {
              url = "/repositories/enabled";
            } else if (args.archivedOnly) {
              url = "/repositories/archived";
            } else if (args.namespace) {
              url = `/repositories/namespace/${args.namespace}`;
            }
            const response = await this.api.get(url);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_repository": {
            const url = args.uuid
              ? `/repositories/uuid/${args.uuid}`
              : `/repositories/${args.id}`;
            const response = await this.api.get(url);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "search_repositories": {
            const response = await this.api.get("/repositories/search", {
              params: { term: args.term },
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "create_repository": {
            const response = await this.api.post("/repositories", args);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_repository_statistics": {
            const response = await this.api.get("/repositories/statistics");
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "list_repository_scans": {
            let url = "/repository-scans";
            if (args.repositoryId) {
              url = `/repository-scans/repository/${args.repositoryId}`;
            } else if (args.status) {
              url = `/repository-scans/status/${args.status}`;
            }
            const response = await this.api.get(url);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_repository_scan": {
            const url = args.uuid
              ? `/repository-scans/uuid/${args.uuid}`
              : `/repository-scans/${args.id}`;
            const response = await this.api.get(url);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "create_repository_scan": {
            const scanData: any = {
              repositoryId: args.repositoryId,
              scannedBranch: args.scannedBranch,
              scanStatus: "PENDING",
            };
            if (args.scanType) {
              scanData.scanType = args.scanType;
            }
            if (args.initiatedBy) {
              scanData.initiatedBy = args.initiatedBy;
            }
            const response = await this.api.post("/repository-scans", scanData);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          case "get_scan_statistics": {
            const response = await this.api.get("/repository-scans/statistics");
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.data, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ""}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupResourceHandlers(): void {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: "structurizr://applications",
          name: "All Applications",
          description: "List of all applications in the architecture landscape",
          mimeType: "application/json",
        },
        {
          uri: "structurizr://shared-components",
          name: "Shared Components",
          description: "List of shared/reusable components",
          mimeType: "application/json",
        },
        {
          uri: "structurizr://statistics",
          name: "Statistics",
          description: "Overall architecture landscape statistics",
          mimeType: "application/json",
        },
        {
          uri: "structurizr://departments",
          name: "Departments",
          description: "List of all departments",
          mimeType: "application/json",
        },
        {
          uri: "structurizr://technologies",
          name: "Technologies",
          description: "List of all technologies used",
          mimeType: "application/json",
        },
      ],
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;

      try {
        let data: any;

        switch (uri) {
          case "structurizr://applications": {
            const response = await this.api.get("/applications");
            data = response.data;
            break;
          }

          case "structurizr://shared-components": {
            const response = await this.api.get("/applications/shared-components");
            data = response.data;
            break;
          }

          case "structurizr://statistics": {
            const response = await this.api.get("/applications/statistics");
            data = response.data;
            break;
          }

          case "structurizr://departments": {
            const response = await this.api.get("/applications/departments");
            data = response.data;
            break;
          }

          case "structurizr://technologies": {
            const response = await this.api.get("/technology-stack/technologies");
            data = response.data;
            break;
          }

          default:
            throw new Error(`Unknown resource: ${uri}`);
        }

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: any) {
        throw new Error(
          `Failed to read resource ${uri}: ${error.message}`
        );
      }
    });
  }

  private setupPromptHandlers(): void {
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: [
        {
          name: "analyze_application",
          description: "Analyze an application's architecture and dependencies",
          arguments: [
            {
              name: "application_name",
              description: "Name of the application to analyze",
              required: true,
            },
          ],
        },
        {
          name: "find_technology_usage",
          description: "Find all applications using a specific technology",
          arguments: [
            {
              name: "technology",
              description: "Technology name (e.g., 'Spring Boot', 'PostgreSQL')",
              required: true,
            },
          ],
        },
        {
          name: "generate_architecture_overview",
          description: "Generate an overview of the entire architecture landscape",
          arguments: [],
        },
        {
          name: "identify_dependencies",
          description: "Identify dependencies for an application",
          arguments: [
            {
              name: "application_name",
              description: "Name of the application",
              required: true,
            },
          ],
        },
      ],
    }));

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "analyze_application": {
          const appName = args?.application_name as string;
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Please analyze the application "${appName}" from the Structurizr architecture database. Include:
1. Basic information (name, description, department, repository)
2. Technology stack with versions
3. Outbound and inbound interfaces
4. Version history
5. Any notable patterns or concerns
6. Recommendations for improvement

Use the MCP tools to gather this information.`,
                },
              },
            ],
          };
        }

        case "find_technology_usage": {
          const technology = args?.technology as string;
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Find all applications using ${technology} in the architecture landscape. For each application, show:
1. Application name and description
2. Version of ${technology} being used
3. Department responsible
4. Whether it's a shared component

Then provide:
- Summary statistics (how many apps, different versions in use)
- Version distribution analysis
- Recommendations for standardization if multiple versions are in use`,
                },
              },
            ],
          };
        }

        case "generate_architecture_overview": {
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Generate a comprehensive overview of the architecture landscape. Include:
1. Overall statistics (total applications, shared components, departments)
2. List of all departments and their application counts
3. Most commonly used technologies
4. List of shared components and what they're used for
5. Key architectural patterns observed
6. Recommendations for improvement

Use the MCP tools to gather all necessary information.`,
                },
              },
            ],
          };
        }

        case "identify_dependencies": {
          const appName = args?.application_name as string;
          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Identify all dependencies for the application "${appName}". Show:
1. Direct dependencies (outbound interfaces)
2. Consumers (inbound interfaces)
3. Shared components it uses
4. Technology dependencies
5. A dependency graph visualization in Mermaid format
6. Analysis of coupling and potential risks`,
                },
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Structurizr MCP server running on stdio");
  }
}

const server = new StructurizrMCPServer();
server.run().catch(console.error);
