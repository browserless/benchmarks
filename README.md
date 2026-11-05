# Browser Provider Benchmark

A benchmarking tool for comparing performance across multiple browser automation providers (Browserbase, Hyperbrowser, Browserless, and Anchorbrowser).

## Overview

This tool dynamically loads provider configurations and runs performance benchmarks to measure:
- **Connection Time**: Time to connect to the browser WebSocket endpoint
- **Page Creation**: Time to create a new browser page
- **Navigation**: Time to navigate to a target URL

## Installation

Use Node.js **26.x** for development. `.node-version` selects the floating major
for compatible version managers; with nvm, run `nvm install 26 && nvm use 26`.
Node 22.x and 24.x remain compatibility targets for users running these benchmarks
in their own environments; this does not impose a new minimum runtime. Official Linux Node 26
binaries require `libatomic` (Debian/Ubuntu: `libatomic1`).

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd browserbase
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your actual API keys and configuration.

## Environment Variables

### Required Configuration

Create a `.env` file in the project root with the following variables:

#### Benchmark Settings
```bash
# Number of benchmark iterations to run
TOTAL=10

# Target URL to navigate to during benchmarks
URL=https://www.example.com/
```

#### Provider API Keys

**Hyperbrowser**
```bash
HYPERBROWSER_API_KEY=your_hyperbrowser_api_key_here
```

**Browserless**
```bash
BROWSERLESS_API_KEY=your_browserless_api_key_here
```

**Anchorbrowser**
```bash
ANCHORBROWSER_API_KEY=your_anchorbrowser_api_key_here
```

**Browserbase**
```bash
BROWSERBASE_API_KEY=your_browserbase_api_key_here
BROWSERBASE_PROJECT_ID=your_browserbase_project_id_here
```

> **Note**: You only need to configure API keys for the providers you want to benchmark. Providers without valid credentials will be skipped automatically.

## Usage

Run the benchmark suite:

```bash
node index.js
```

The tool will:
1. Automatically discover all provider modules in the `providers/` directory
2. Load and validate each provider
3. Run benchmarks sequentially for each configured provider
4. Display performance metrics in a formatted table

### Sample Output

```
🔍 Loading providers...

✓ Loaded provider: browserbase
✓ Loaded provider: hyperbrowser
✓ Loaded provider: browserless
✓ Loaded provider: anchorbrowser

📊 Found 4 provider(s)

==================================================

[1/4] Running benchmark for: browserbase
==================================================

=== Test Configuration ===
Provider: Browserbase
Browser Version: Chrome/120.0.6099.109
Total Executions : 10
URL: "https://www.example.com/"
==========================

┌─────────────────┬────────────┬─────────┬─────────┐
│ Metrics         │ Average    │ Fastest │ Slowest │
├─────────────────┼────────────┼─────────┼─────────┤
│ Connection      │ 1234.5     │ 1100    │ 1450    │
│ Page Creation   │ 234.2      │ 200     │ 280     │
│ Navigation      │ 567.8      │ 520     │ 620     │
└─────────────────┴────────────┴─────────┴─────────┘
```

## Project Structure

```
.
├── index.js              # Main entry point, dynamic provider loader
├── runner.js             # Benchmark execution logic
├── providers/            # Provider-specific implementations
│   ├── browserbase.js
│   ├── hyperbrowser.js
│   ├── browserless.js
│   └── anchorbrowser.js
├── .env                  # Your local configuration (not committed)
├── .env.example          # Template for environment variables
└── package.json          # Project dependencies
```

## Adding New Providers

To add a new provider:

1. Create a new file in `providers/` (e.g., `providers/newprovider.js`)
2. Export `setup` and optionally `teardown` functions:

```javascript
export const setup = async () => {
  // Initialize your provider and return:
  return {
    browserWSEndpoint: 'ws://your-endpoint',
    provider: 'Your Provider Name'
  };
};

export const teardown = async (setupResult) => {
  // Optional cleanup
};
```

3. Add any required environment variables to `.env`
4. The provider will be automatically discovered and loaded on next run

## Dependencies

- `@browserbasehq/sdk` - Browserbase SDK
- `@hyperbrowser/sdk` - Hyperbrowser SDK
- `puppeteer-core` - Puppeteer without bundled Chromium
- `dotenv` - Environment variable management

## License

See LICENSE file for details.
