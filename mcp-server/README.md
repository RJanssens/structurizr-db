# Structurizr MCP Server

A Model Context Protocol (MCP) server for interacting with the Structurizr Architecture Scanner backend. This allows Claude Desktop, Claude Code CLI, and other MCP clients to directly query and manipulate your architecture landscape.

## What is MCP?

Model Context Protocol (MCP) is an open protocol that enables AI assistants to securely interact with external data sources and tools. This MCP server exposes the Structurizr Architecture Scanner API as MCP tools, resources, and prompts.

## Features

### Tools (11 available)
Tools allow Claude to execute operations:

1. **list_applications** - List all applications (with optional filtering)
2. **get_application** - Get detailed info about a specific application
3. **search_applications** - Search applications by name or description
4. **create_application** - Create a new application entry
5. **get_technology_stack** - Get tech stack for an application
6. **find_applications_by_technology** - Find apps using a specific technology
7. **get_application_interfaces** - Get interfaces/connections for an app
8. **get_version_history** - Get version history for an application
9. **get_statistics** - Get overall landscape statistics
10. **get_all_departments** - Get list of all departments
11. **get_all_technologies** - Get list of all technologies used

### Resources (5 available)
Resources provide read-only access to data:

1. **structurizr://applications** - All applications
2. **structurizr://shared-components** - Shared components
3. **structurizr://statistics** - Landscape statistics
4. **structurizr://departments** - All departments
5. **structurizr://technologies** - All technologies

### Prompts (4 available)
Prompts provide pre-configured analysis workflows:

1. **analyze_application** - Comprehensive application analysis
2. **find_technology_usage** - Technology usage analysis
3. **generate_architecture_overview** - Full landscape overview
4. **identify_dependencies** - Dependency analysis

## Installation

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Configure Environment

Set the API URL (defaults to `http://localhost:8080/api`):

```bash
export STRUCTURIZR_API_URL=http://localhost:8080/api
```

## Usage with Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "structurizr": {
      "command": "node",
      "args": ["/absolute/path/to/structurizr-db/mcp-server/build/index.js"],
      "env": {
        "STRUCTURIZR_API_URL": "http://localhost:8080/api"
      }
    }
  }
}
```

After adding this configuration, restart Claude Desktop.

## Usage with Claude Code CLI

Add to your MCP settings file (`~/.config/claude/mcp_settings.json`):

```json
{
  "mcpServers": {
    "structurizr": {
      "command": "node",
      "args": ["/absolute/path/to/structurizr-db/mcp-server/build/index.js"],
      "env": {
        "STRUCTURIZR_API_URL": "http://localhost:8080/api"
      }
    }
  }
}
```

## Example Interactions

Once configured, you can interact with Claude naturally:

### Example 1: List Applications
```
You: "Show me all applications in the architecture landscape"

Claude will use the list_applications tool to fetch and display all applications.
```

### Example 2: Technology Analysis
```
You: "Which applications are using Spring Boot 3.x?"

Claude will use find_applications_by_technology to search for Spring Boot usage.
```

### Example 3: Using Prompts
```
You: "Use the analyze_application prompt for 'KeyCloak'"

Claude will execute a comprehensive analysis including tech stack, interfaces,
version history, and recommendations.
```

### Example 4: Dependency Analysis
```
You: "What are the dependencies for the Customer Service application?"

Claude will fetch the application, analyze its outbound/inbound interfaces,
and present a dependency graph.
```

### Example 5: Creating Applications
```
You: "Create a new application entry for 'Payment Gateway' in the Finance department"

Claude will use create_application to add it to the database.
```

## Available Tools Reference

### list_applications
```typescript
{
  department?: string;      // Filter by department
  sharedOnly?: boolean;     // Only shared components
}
```

### get_application
```typescript
{
  id?: number;              // Application ID
  uuid?: string;            // Or UUID
}
```

### search_applications
```typescript
{
  term: string;             // Search term
}
```

### create_application
```typescript
{
  name: string;             // Required
  description?: string;
  repositoryUrl?: string;
  department?: string;
  author?: string;
  isSharedComponent?: boolean;
}
```

### get_technology_stack
```typescript
{
  applicationId: number;
}
```

### find_applications_by_technology
```typescript
{
  name: string;             // Technology name
  version?: string;         // Optional version filter
}
```

### get_application_interfaces
```typescript
{
  applicationId: number;
}
```

### get_version_history
```typescript
{
  applicationId: number;
}
```

## Resources Reference

All resources return JSON data:

- `structurizr://applications` - Array of all applications
- `structurizr://shared-components` - Array of shared components
- `structurizr://statistics` - Statistics object
- `structurizr://departments` - Array of department names
- `structurizr://technologies` - Array of technology names

## Prompts Reference

### analyze_application
**Arguments:** `application_name` (required)

Performs comprehensive analysis including tech stack, interfaces, version history, and recommendations.

### find_technology_usage
**Arguments:** `technology` (required)

Analyzes usage of a specific technology across the landscape with version distribution.

### generate_architecture_overview
**Arguments:** None

Generates a full landscape overview with statistics, patterns, and recommendations.

### identify_dependencies
**Arguments:** `application_name` (required)

Identifies all dependencies with visualization and risk analysis.

## Development

### Watch Mode
```bash
npm run watch
```

### Testing
```bash
# Start the backend first
cd ..
docker-compose up -d backend postgres

# In another terminal
cd mcp-server
npm run dev
```

### Debugging

The server logs to stderr. You can see logs in Claude Desktop's developer console or in your terminal when using Claude Code CLI.

## Architecture

```
Claude Desktop/CLI
       ↓
    MCP Protocol (stdio)
       ↓
  MCP Server (Node.js)
       ↓
    HTTP REST API
       ↓
Spring Boot Backend
       ↓
   PostgreSQL
```

## Troubleshooting

### "Connection failed" error

1. Ensure the Spring Boot backend is running
2. Verify `STRUCTURIZR_API_URL` is correct
3. Check that the API is accessible from your machine

### "Tool not found" error

1. Ensure the MCP server is built (`npm run build`)
2. Verify the path in your MCP configuration is absolute and correct
3. Restart Claude Desktop/CLI after configuration changes

### Backend connection issues

```bash
# Test API connectivity
curl http://localhost:8080/api/applications

# Check if backend is running
docker-compose ps
```

## Contributing

Contributions welcome! Please ensure:
1. TypeScript types are properly defined
2. Error handling is comprehensive
3. Documentation is updated

## License

[Your License]
