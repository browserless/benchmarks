import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import runBenchmark from './runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadProviders() {
  const providersDir = join(__dirname, 'providers');
  const files = await readdir(providersDir);

  // Filter for .js files only
  const providerFiles = files.filter(file => file.endsWith('.js'));

  const providers = [];

  for (const file of providerFiles) {
    const providerName = file.replace('.js', '');
    const providerPath = join(providersDir, file);

    try {
      // Dynamic import of the provider module
      const provider = await import(providerPath);

      // Validate that the provider has the required exports
      if (typeof provider.setup !== 'function') {
        console.warn(`⚠️  Provider "${providerName}" is missing setup() function, skipping...`);
        continue;
      }

      providers.push({
        name: providerName,
        setup: provider.setup,
        teardown: provider.teardown || (async () => { }),
      });

      console.log(`✓ Loaded provider: ${providerName}`);
    } catch (error) {
      console.error(`✗ Failed to load provider "${providerName}":`, error.message);
    }
  }

  return providers;
}

async function main() {
  console.log('🔍 Loading providers...\n');

  const providers = await loadProviders();

  if (providers.length === 0) {
    console.error('❌ No valid providers found!');
    process.exit(1);
  }

  console.log(`\n📊 Found ${providers.length} provider(s)\n`);
  console.log('='.repeat(50));

  // Run benchmarks for each provider
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];

    console.log(`\n[${i + 1}/${providers.length}] Running benchmark for: ${provider.name}`);
    console.log('='.repeat(50));

    try {
      // Run the benchmark
      await runBenchmark(provider.setup, provider.teardown, provider.name);
    } catch (error) {
      console.error(`❌ Error running benchmark for "${provider.name}":`, error.message);
    }

    if (i < providers.length - 1) {
      console.log('\n' + '='.repeat(50));
    }
  }

  console.log('\n✅ All benchmarks completed!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
