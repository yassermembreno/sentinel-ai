# Graph Report - .  (2026-07-24)

## Corpus Check
- Corpus is ~2,965 words - fits in a single context window. You may not need a graph.

## Summary
- 447 nodes · 515 edges · 26 communities (23 shown, 3 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Customer Domain Core
- Customer Dev Tooling
- Monorepo Infrastructure
- Customer TSConfig
- Root Monorepo Config
- Validation Package Config
- NestJS Runtime Deps
- App Bootstrap and DB
- Customer Package Meta
- Customer NPM Scripts
- Validation Strategies
- Turbo Pipeline
- Validation ESLint
- Validation TSConfig
- Customer Build Config
- Sentinel AI Vision
- Base TSConfig
- Nest CLI Config
- ESLint Config
- Runtime Path Aliases
- AI Gateway Stub
- Billing Service Stub
- DB Migrations
- Ticket Service Stub
- Web App Stub
- CreateCustomer DTO

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `scripts` - 20 edges
3. `CustomerEntity` - 11 edges
4. `scripts` - 11 edges
5. `Customer` - 10 edges
6. `CustomerService` - 9 edges
7. `Sentinel AI` - 9 edges
8. `jest` - 8 edges
9. `CustomerResponseDto` - 8 edges
10. `compilerOptions` - 8 edges

## Surprising Connections (you probably didn't know these)
- `packages/* workspace pattern` --conceptually_related_to--> `packages/contracts`  [INFERRED]
  pnpm-workspace.yaml → README.md
- `packages/* workspace pattern` --conceptually_related_to--> `packages/ai-core`  [INFERRED]
  pnpm-workspace.yaml → README.md
- `packages/* workspace pattern` --conceptually_related_to--> `packages/observability`  [INFERRED]
  pnpm-workspace.yaml → README.md
- `packages/* workspace pattern` --conceptually_related_to--> `packages/config`  [INFERRED]
  pnpm-workspace.yaml → README.md
- `pnpm workspaces` --references--> `pnpm Workspace Configuration`  [INFERRED]
  README.md → pnpm-workspace.yaml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Sentinel AI Request Flow** — readme_user, readme_web_application, readme_ai_gateway, readme_ai_agent_runtime, readme_customer_api, readme_billing_api, readme_ticket_api, readme_databases [EXTRACTED 1.00]
- **pnpm Monorepo Workspace Layout** — pnpm_workspace_apps_glob, pnpm_workspace_apps_services_glob, pnpm_workspace_packages_glob, readme_apps_web, readme_apps_ai_gateway, readme_apps_services_customer, readme_packages_contracts [INFERRED 0.85]
- **Sentinel AI Exploration Goals** — readme_ai_agent_architectures, readme_tool_calling_patterns, readme_rag_systems, readme_ai_security_risks, readme_owasp_top_10_llm_applications, readme_production_hardening_patterns [EXTRACTED 1.00]

## Communities (26 total, 3 thin omitted)

### Community 0 - "Customer Domain Core"
Cohesion: 0.08
Nodes (26): CustomerResponseDto, CustomerRepository, CustomerService, Injectable, CustomerValidationService, Injectable, CustomerController, Controller (+18 more)

### Community 1 - "Customer Dev Tooling"
Cohesion: 0.04
Nodes (49): devDependencies, dotenv, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals (+41 more)

### Community 2 - "Monorepo Infrastructure"
Cohesion: 0.06
Nodes (39): Customer Service README, NestJS, NestJS Mau, NestJS TypeScript Starter Repository, Node.js, Docker Compose Infrastructure, postgres service, postgres:17 (+31 more)

### Community 3 - "Customer TSConfig"
Cohesion: 0.07
Nodes (28): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+20 more)

### Community 4 - "Root Monorepo Config"
Cohesion: 0.07
Nodes (26): author, description, devDependencies, prettier, turbo, typescript, turbo, typescript (+18 more)

### Community 5 - "Validation Package Config"
Cohesion: 0.08
Nodes (25): author, dependencies, zod, exports, ./strategies/*.js, files, dist, keywords (+17 more)

### Community 6 - "NestJS Runtime Deps"
Cohesion: 0.08
Nodes (25): dependencies, class-transformer, class-validator, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express, @nestjs/typeorm (+17 more)

### Community 7 - "App Bootstrap and DB"
Cohesion: 0.11
Nodes (15): AppModule, Module, CustomerModule, Module, HealthController, Controller, Get, HealthModule (+7 more)

### Community 8 - "Customer Package Meta"
Cohesion: 0.10
Nodes (19): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+11 more)

### Community 9 - "Customer NPM Scripts"
Cohesion: 0.10
Nodes (20): scripts, build, format, lint, migration:generate, migration:revert, migration:run, prestart (+12 more)

### Community 10 - "Validation Strategies"
Cohesion: 0.16
Nodes (8): CreateCustomerInput, createCustomerSchema, ValidationFailedError, ValidationIssue, SafeValidationStrategy, UnsafeValidationStrategy, ValidationResult, ValidationStrategy

### Community 11 - "Turbo Pipeline"
Cohesion: 0.11
Nodes (18): ^build, ^lint, .next/**, ^typecheck, dependsOn, outputs, cache, dependsOn (+10 more)

### Community 12 - "Validation ESLint"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, globals, typescript, typescript-eslint (+7 more)

### Community 13 - "Validation TSConfig"
Cohesion: 0.13
Nodes (14): compilerOptions, declaration, declarationMap, module, outDir, paths, rootDir, sourceMap (+6 more)

### Community 14 - "Customer Build Config"
Cohesion: 0.18
Nodes (10): compilerOptions, incremental, rootDir, exclude, extends, dist, test, node_modules (+2 more)

### Community 15 - "Sentinel AI Vision"
Cohesion: 0.20
Nodes (11): Sentinel AI README, AI Agent Architectures, AI Security Risks, Enterprise AI Support Agent, Explore AI in Real Software Architectures, OWASP Top 10 for LLM Applications, Production Hardening Patterns, RAG Systems (+3 more)

### Community 16 - "Base TSConfig"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, noUncheckedIndexedAccess, skipLibCheck, strict, target

### Community 17 - "Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 19 - "Runtime Path Aliases"
Cohesion: 0.40
Nodes (4): compilerOptions, paths, ./dist/*, @customer/*

### Community 20 - "AI Gateway Stub"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 21 - "Billing Service Stub"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 23 - "Ticket Service Stub"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 24 - "Web App Stub"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **214 isolated node(s):** `name`, `version`, `private`, `name`, `version` (+209 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Customer Dev Tooling` to `Customer Package Meta`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NestJS Runtime Deps` to `Customer Package Meta`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `scripts` connect `Customer NPM Scripts` to `Customer Package Meta`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _214 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Customer Domain Core` be split into smaller, more focused modules?**
  _Cohesion score 0.08408163265306122 - nodes in this community are weakly interconnected._
- **Should `Customer Dev Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Monorepo Infrastructure` be split into smaller, more focused modules?**
  _Cohesion score 0.06342780026990553 - nodes in this community are weakly interconnected._