#!/usr/bin/env node
import { MongoMemoryServer } from 'mongodb-memory-server';

async function main() {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI found, starting in-memory MongoDB for smoke test...');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    process.env.MONGODB_URI = uri;
  } else {
    console.log('Using provided MONGODB_URI:', uri);
  }
  process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  console.log('MONGODB_URI set to', uri);

  // Import server after MONGODB_URI and JWT secrets are set. The server
  // module will call `start()` automatically when NODE_ENV !== 'test'.
  await import('../src/index.js');

  console.log('Server module imported; it should start automatically (check logs).');
}

main().catch((err) => {
  console.error('Failed to start smoke test server:', err);
  process.exit(1);
});
