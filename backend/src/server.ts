import { app } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { seedSafetyTips } from './modules/safety-tips/safetyTips.seed';
import { seedSampleData } from './modules/sample/sample.seed';

async function main() {
  if (env.isProduction && env.jwtSecret === 'dev-only-change-me') {
    throw new Error('Set JWT_SECRET before running in production');
  }

  await connectDatabase();
  await seedSafetyTips();
  if (!env.isProduction) {
    await seedSampleData();
  }

  app.listen(env.port, () => {
    console.log(`SafeLink API listening on port ${env.port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
