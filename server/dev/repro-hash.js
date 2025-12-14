#!/usr/bin/env node
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bondos_test';

async function main() {
  await mongoose.connect(uri);
  const email = `repro${Date.now()}@example.com`;
  const password = 'ReproPass1';
  const user = new User({ username: `repro${Date.now()}`, email, password });
  await user.save();
  const got = await User.findOne({ email }).select('+password');
  console.log('saved hash len', got.password.length);
  console.log('compare saved password:', await got.comparePassword(password));
  // update refresh token and save (simulate register flow)
  got.refreshToken = 'rtoken';
  await got.save();
  const after = await User.findOne({ email }).select('+password');
  console.log('after save hash len', after.password.length);
  console.log('compare after save:', await after.comparePassword(password));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
