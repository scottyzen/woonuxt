import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'update-woonuxt.mjs');
const git = (cwd, ...args) => execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', ...args], { cwd, stdio: 'pipe' });
const write = (root, path, content) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};
const read = (root, path) => readFileSync(join(root, path), 'utf8');
const lines = (n) => Array.from({ length: n }, (_, i) => `line ${i + 1}`).join('\n') + '\n';
const setVersion = (root, version) => write(root, 'woonuxt_base/package.json', JSON.stringify({ version }));

let tmp;
let upstream;

// Each test gets a fork at 4.30.2 and the local upstream gets tagged releases on demand.
const makeFork = () => {
  const fork = mkdtempSync(join(tmp, 'fork-'));
  cpSync(upstream.at402, fork, { recursive: true });
  mkdirSync(join(fork, 'scripts'));
  cpSync(SCRIPT, join(fork, 'scripts/update-woonuxt.mjs'));
  return fork;
};

const update = (fork, ...args) =>
  spawnSync('node', ['scripts/update-woonuxt.mjs', '--no-install', ...args], {
    cwd: fork,
    encoding: 'utf8',
    env: { ...process.env, WOONUXT_REPO_URL: upstream.dir },
  });

before(() => {
  tmp = mkdtempSync(join(tmpdir(), 'woonuxt-update-test-'));
  const dir = join(tmp, 'upstream');
  mkdirSync(dir);
  git(dir, 'init', '-q');

  setVersion(dir, '4.30.2');
  write(dir, 'woonuxt_base/app/a.vue', lines(30));
  write(dir, 'woonuxt_base/app/b.vue', lines(30));
  write(dir, 'woonuxt_base/app/removed.vue', 'gone soon\n');
  write(dir, 'woonuxt_base/app/gql/default.ts', 'generated v1\n');
  write(dir, 'nuxt.config.ts', 'config v1\n');
  git(dir, 'add', '-A');
  git(dir, 'commit', '-qm', 'base');
  git(dir, 'tag', '4.30.2');
  const at402 = join(tmp, 'at402');
  cpSync(dir, at402, { recursive: true });

  setVersion(dir, '4.30.3');
  write(dir, 'woonuxt_base/app/a.vue', lines(30).replace('line 1\n', 'upstream line 1\n'));
  write(dir, 'woonuxt_base/app/b.vue', lines(30).replace('line 30\n', 'upstream line 30\n'));
  write(dir, 'woonuxt_base/app/new.vue', 'new file\n');
  write(dir, 'woonuxt_base/app/gql/default.ts', 'generated v2\n');
  write(dir, 'nuxt.config.ts', 'config v2\n');
  git(dir, 'rm', '-q', 'woonuxt_base/app/removed.vue');
  git(dir, 'add', '-A');
  git(dir, 'commit', '-qm', 'release');
  git(dir, 'tag', '4.30.3');

  upstream = { dir, at402 };
  rmSync(join(at402, '.git'), { recursive: true, force: true });
});

after(() => rmSync(tmp, { recursive: true, force: true }));

describe('update-woonuxt', () => {
  it('updates untouched files, adds new ones and removes deleted ones', () => {
    const fork = makeFork();
    const result = update(fork);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(JSON.parse(read(fork, 'woonuxt_base/package.json')).version, '4.30.3');
    assert.match(read(fork, 'woonuxt_base/app/a.vue'), /upstream line 1/);
    assert.equal(read(fork, 'woonuxt_base/app/new.vue'), 'new file\n');
    assert.equal(read(fork, 'nuxt.config.ts'), 'config v2\n');
    assert.throws(() => read(fork, 'woonuxt_base/app/removed.vue'));
  });

  it('never overwrites generated files', () => {
    const fork = makeFork();
    update(fork);
    assert.equal(read(fork, 'woonuxt_base/app/gql/default.ts'), 'generated v1\n');
  });

  it('merges local edits that do not overlap with upstream', () => {
    const fork = makeFork();
    write(fork, 'woonuxt_base/app/b.vue', lines(30).replace('line 15\n', 'my line 15\n'));
    const result = update(fork);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const merged = read(fork, 'woonuxt_base/app/b.vue');
    assert.match(merged, /my line 15/);
    assert.match(merged, /upstream line 30/);
  });

  it('leaves conflict markers and exits non-zero on overlapping edits', () => {
    const fork = makeFork();
    write(fork, 'woonuxt_base/app/a.vue', lines(30).replace('line 1\n', 'my line 1\n'));
    const result = update(fork);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /CONFLICTS/);
    assert.match(read(fork, 'woonuxt_base/app/a.vue'), /<<<<<<< local/);
  });

  it('keeps files the fork deleted and customised removals', () => {
    const fork = makeFork();
    rmSync(join(fork, 'woonuxt_base/app/b.vue'));
    write(fork, 'woonuxt_base/app/removed.vue', 'customised\n');
    const result = update(fork);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.throws(() => read(fork, 'woonuxt_base/app/b.vue'));
    assert.equal(read(fork, 'woonuxt_base/app/removed.vue'), 'customised\n');
  });

  it('writes nothing on --dry-run', () => {
    const fork = makeFork();
    const result = update(fork, '--dry-run');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(JSON.parse(read(fork, 'woonuxt_base/package.json')).version, '4.30.2');
    assert.throws(() => read(fork, 'woonuxt_base/app/new.vue'));
  });

  it('reports up to date when already on the target tag', () => {
    const fork = makeFork();
    const result = update(fork, '--tag', '4.30.2');
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Already up to date/);
  });
});
