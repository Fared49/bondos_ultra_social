#!/usr/bin/env node
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bondos_test';

async function main() {
  await mongoose.connect(uri);
  const emails = ['tester2@example.com', 'smoke@example.com'];
  for (const email of emails) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found for', email);
      continue;
    }
    const testPassword = email === 'smoke@example.com' ? 'mypassword' : 'password1';
    console.log('Found user:', { username: user.username, email: user.email });
    console.log('Stored password hash (len):', user.password && user.password.length);
    console.log('Stored password hash sample:', user.password && user.password.substring(0, 30));
    const ok = await user.comparePassword(testPassword);
    const okDirect = bcrypt.compareSync(testPassword, user.password);
    console.log('comparePassword with "%s":', testPassword, ok, '(direct bcrypt.compareSync:', okDirect + ')');
  }
  process.exit(0);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
