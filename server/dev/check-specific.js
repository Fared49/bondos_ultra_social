#!/usr/bin/env node
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bondos_test';
const email = process.env.EMAIL;
const pwd = process.env.PWD;

async function main() {
  if (!email || !pwd) {
    console.error('Usage: EMAIL=... PWD=... node check-specific.js');
    process.exit(2);
  }
  await mongoose.connect(uri);
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    console.error('User not found');
    process.exit(1);
  }
  console.log('Compare result:', await user.comparePassword(pwd));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
