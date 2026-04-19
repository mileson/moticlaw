#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const projectRoot = path.resolve(process.cwd());
const requestedDistDir = (process.env.OPENCLAW_NEXT_DIST_DIR || '').trim();
const distDir = requestedDistDir || '.next';

if (distDir !== '.next' || (process.env.ALLOW_BUILD_WITH_RUNNING_WEB || '').trim() === '1') {
  process.exit(0);
}

function readCommand(command, args) {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    if (typeof error?.stdout === 'string') {
      return error.stdout.trim();
    }
    return '';
  }
}

function listListeningPids() {
  try {
    const stdout = execFileSync('lsof', ['-tiTCP', '-sTCP:LISTEN', '-n', '-P'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return stdout
      .split(/\s+/)
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value, index, items) => items.indexOf(value) === index);
  } catch (error) {
    if (error && typeof error.status === 'number' && error.status === 1) {
      return [];
    }
    return [];
  }
}

function readProcessCwd(pid) {
  const stdout = readCommand('lsof', ['-a', '-p', String(pid), '-d', 'cwd', '-Fn']);
  for (const line of stdout.split(/\r?\n/)) {
    if (line.startsWith('n')) {
      return line.slice(1).trim();
    }
  }
  return '';
}

function readProcessCommand(pid) {
  return readCommand('ps', ['-p', String(pid), '-o', 'command=']);
}

const blockers = [];
for (const pid of listListeningPids()) {
  const cwd = readProcessCwd(pid);
  if (!cwd || path.resolve(cwd) !== projectRoot) {
    continue;
  }
  const command = readProcessCommand(pid);
  if (!command) {
    continue;
  }
  const normalizedCommand = command.toLowerCase();
  if (!normalizedCommand.includes('next') && !normalizedCommand.includes('node') && !normalizedCommand.includes('pnpm')) {
    continue;
  }
  blockers.push({ pid, command });
}

if (blockers.length === 0) {
  process.exit(0);
}

console.error('Refusing to run `next build` against the default `.next` directory while this checkout already has a live web server.');
console.error('');
console.error('Why this is blocked:');
console.error('- `next start` keeps build manifests in memory after boot.');
console.error('- A new `next build` rewrites `.next/static/*`.');
console.error('- The old server can keep rendering old asset hashes, which breaks pages with 500s on `/_next/static/*`.');
console.error('');
console.error('Active listeners from this web workspace:');
for (const blocker of blockers) {
  console.error(`- pid ${blocker.pid}: ${blocker.command}`);
}
console.error('');
console.error('Fix:');
console.error('- Stop and restart the running web server before building, or');
console.error('- build into an isolated dist dir, for example `OPENCLAW_NEXT_DIST_DIR=.next-workflow-ui pnpm build`.');
console.error('');
console.error('If you intentionally want to replace the live build anyway, set `ALLOW_BUILD_WITH_RUNNING_WEB=1` and manage the restart yourself.');

process.exit(1);
