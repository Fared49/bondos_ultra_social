#!/usr/bin/env node
import bcrypt from 'bcryptjs';
const pw = 'localtest';
const hash = bcrypt.hashSync(pw, 10);
console.log('hash len:', hash.length);
console.log('compare:', bcrypt.compareSync(pw, hash));
