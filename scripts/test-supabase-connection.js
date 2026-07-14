#!/usr/bin/env node

/**
 * Supabase Connection & Endpoint Test Script
 *
 * Tests:
 *  1. proxy.ts existence (Next.js 16+ uses proxy.ts instead of middleware.ts)
 *     — checks that the auth & route protection proxy is present.
 *  2. Supabase project reachability (with timeout detection for paused projects)
 *  3. REST API connectivity & key validation
 *  4. Each table: exists, readable, has data
 *  5. Checks for missing columns (like is_hidden)
 *  6. Gallery & projects data integrity
 *  7. Auth endpoint
 *  8. Local Next.js dev server
 *
 * Compatible with Next.js 16+ which uses proxy.ts for middleware.
 *
 * Usage:
 *   node scripts/test-supabase-connection.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── Load .env.local ─────────────────────────────────────────────────
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const value = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  });
  console.log('✅ Loaded .env.local\n');
} else {
  console.error('❌ .env.local not found at:', envPath);
  process.exit(1);
}

// ─── Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const REQUEST_TIMEOUT = 10000; // 10 seconds

if (!SUPABASE_URL || SUPABASE_URL === 'https://dummy.supabase.co') {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing or set to dummy value');
  process.exit(1);
}
if (!SUPABASE_KEY || SUPABASE_KEY === 'dummy-key') {
  console.error(
    '❌ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is missing or set to dummy value',
  );
  process.exit(1);
}

console.log('📡 Supabase URL:', SUPABASE_URL);
console.log(
  '🔑 Key format:',
  SUPABASE_KEY.startsWith('eyJ')
    ? 'JWT (anon key)'
    : SUPABASE_KEY.startsWith('sb_publishable_')
      ? 'Publishable key (new format)'
      : 'Unknown format',
);
console.log('🔑 Key preview:', SUPABASE_KEY.substring(0, 25) + '...');
console.log('');

// ─── HTTP Helper ─────────────────────────────────────────────────────
function supabaseRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${endpoint}`);
    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      port: 443,
      timeout: REQUEST_TIMEOUT,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, data: parsed, headers: res.headers });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('TIMEOUT'));
    });
    req.on('error', (err) => {
      if (err.code === 'ECONNRESET' || err.message === 'TIMEOUT') {
        reject(new Error('TIMEOUT'));
      } else {
        reject(err);
      }
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function supabaseAuthRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/auth/v1/${endpoint}`);
    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      port: 443,
      timeout: REQUEST_TIMEOUT,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, data: parsed });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('TIMEOUT'));
    });
    req.on('error', (err) => {
      if (err.code === 'ECONNRESET' || err.message === 'TIMEOUT') {
        reject(new Error('TIMEOUT'));
      } else {
        reject(err);
      }
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── Results Tracking ────────────────────────────────────────────────
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: [],
};

function pass(test, detail = '') {
  results.passed++;
  results.details.push({ test, status: 'PASS', detail });
  console.log(`  ✅ ${test}${detail ? ' — ' + detail : ''}`);
}

function fail(test, detail = '') {
  results.failed++;
  results.details.push({ test, status: 'FAIL', detail });
  console.log(`  ❌ ${test}${detail ? ' — ' + detail : ''}`);
}

function warn(test, detail = '') {
  results.warnings++;
  results.details.push({ test, status: 'WARN', detail });
  console.log(`  ⚠️  ${test}${detail ? ' — ' + detail : ''}`);
}

// ─── Test Functions ──────────────────────────────────────────────────

async function testConnectivity() {
  console.log('\n━━━ 1. CONNECTIVITY TEST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const res = await supabaseRequest('projects?select=count&limit=0');
    if (res.status === 200) {
      pass('REST API reachable', `HTTP ${res.status}`);
      return true;
    } else if (res.status === 401) {
      fail(
        'REST API auth failed',
        `HTTP 401 — API key is invalid or expired. Key format: ${SUPABASE_KEY.substring(0, 15)}...`,
      );
      return false;
    } else if (res.status === 404) {
      fail(
        'REST API 404',
        `'projects' table may not exist. Run SQL migrations.`,
      );
      return true; // API is reachable, just table missing
    } else {
      fail(
        'REST API unexpected response',
        `HTTP ${res.status}: ${JSON.stringify(res.data).substring(0, 200)}`,
      );
      return false;
    }
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      fail(
        'REST API TIMEOUT',
        'Connection timed out after 10s. Your Supabase project is likely PAUSED.\n' +
          '      👉 Go to https://supabase.com/dashboard/projects\n' +
          "      👉 Select your project and click 'Resume project'\n" +
          '      👉 Free-tier projects auto-pause after 7 days of inactivity',
      );
    } else {
      fail('REST API connectivity', `Network error: ${err.message}`);
    }
    return false;
  }
}

async function testAuthEndpoint() {
  console.log('\n━━━ 2. AUTH ENDPOINT TEST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const res = await supabaseAuthRequest('settings');
    if (res.status === 200) {
      pass(
        'Auth endpoint reachable',
        `Email auth: ${res.data?.external?.email ?? 'unknown'}`,
      );
    } else {
      fail(
        'Auth endpoint',
        `HTTP ${res.status}: ${JSON.stringify(res.data).substring(0, 200)}`,
      );
    }
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      fail('Auth endpoint TIMEOUT', 'Project likely paused (see above)');
    } else {
      fail('Auth endpoint', `Network error: ${err.message}`);
    }
  }
}

const TABLES = [
  'projects',
  'gallery_images',
  'skills',
  'profile',
  'tech_stack',
  'social_stories',
  'ratings',
  'about_general',
  'about_experience',
  'about_education',
  'about_skills',
  'about_interests',
  'project_contributors',
];

async function testTables() {
  console.log('\n━━━ 3. TABLE EXISTENCE & DATA CHECK ━━━━━━━━━━━━━━━━━━━━━');
  for (const table of TABLES) {
    try {
      const res = await supabaseRequest(`${table}?select=*&limit=5`);
      if (res.status === 200) {
        const count = Array.isArray(res.data) ? res.data.length : 0;
        if (count > 0) {
          pass(`Table '${table}'`, `Has data (${count}+ rows)`);
        } else {
          warn(`Table '${table}'`, `EXISTS but EMPTY — no rows`);
        }
      } else if (res.status === 404) {
        fail(`Table '${table}'`, `NOT FOUND (404) — run SQL migrations`);
      } else if (res.status === 401 || res.status === 403) {
        fail(
          `Table '${table}'`,
          `ACCESS DENIED (${res.status}) — RLS or key issue`,
        );
      } else {
        fail(
          `Table '${table}'`,
          `HTTP ${res.status}: ${JSON.stringify(res.data).substring(0, 150)}`,
        );
      }
    } catch (err) {
      if (err.message === 'TIMEOUT') {
        fail(`Table '${table}'`, 'TIMEOUT — project paused');
        return;
      }
      fail(`Table '${table}'`, `Error: ${err.message}`);
    }
  }
}

async function testProjectsColumns() {
  console.log('\n━━━ 4. PROJECTS COLUMN CHECK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const criticalColumns = [
    'is_hidden',
    'slug',
    'featured',
    'is_coming_soon',
    'is_currently_working',
    'tech_stack',
    'image_url',
  ];

  for (const col of criticalColumns) {
    try {
      const res = await supabaseRequest(`projects?select=${col}&limit=1`);
      if (res.status === 200) {
        pass(`Column 'projects.${col}'`, 'exists');
      } else {
        const errMsg =
          typeof res.data === 'object'
            ? JSON.stringify(res.data)
            : String(res.data);
        if (errMsg.includes('does not exist') || res.status === 400) {
          fail(
            `Column 'projects.${col}'`,
            `MISSING — run: ALTER TABLE projects ADD COLUMN IF NOT EXISTS ${col} ...`,
          );
        } else {
          fail(
            `Column 'projects.${col}'`,
            `HTTP ${res.status}: ${errMsg.substring(0, 150)}`,
          );
        }
      }
    } catch (err) {
      if (err.message === 'TIMEOUT') return;
      fail(`Column 'projects.${col}'`, err.message);
    }
  }
}

async function testGalleryImages() {
  console.log('\n━━━ 5. GALLERY IMAGES DETAIL CHECK ━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const res = await supabaseRequest(
      'gallery_images?select=*&order=display_order.asc&limit=10',
    );
    if (res.status === 200 && Array.isArray(res.data)) {
      if (res.data.length === 0) {
        warn(
          'Gallery images',
          "EMPTY — images won't show. Add data via admin or SQL.",
        );
      } else {
        pass('Gallery images', `Found ${res.data.length} images`);
        res.data.forEach((img, i) => {
          const urlPreview = img.image_url
            ? img.image_url.substring(0, 60) + '...'
            : 'NULL';
          console.log(
            `    ${i + 1}. ${img.alt_text || '(no alt)'} → ${urlPreview}`,
          );
        });
      }
    } else {
      fail('Gallery images', `HTTP ${res.status}`);
    }
  } catch (err) {
    if (err.message === 'TIMEOUT') return;
    fail('Gallery images', err.message);
  }
}

async function testProjectsData() {
  console.log('\n━━━ 6. PROJECTS DATA CHECK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    // Raw project count
    const rawRes = await supabaseRequest(
      'projects?select=id,title,slug,featured,is_hidden&limit=20',
    );
    if (rawRes.status === 200 && Array.isArray(rawRes.data)) {
      if (rawRes.data.length > 0) {
        pass('Projects in DB', `${rawRes.data.length} total`);
        rawRes.data.forEach((p, i) => {
          console.log(
            `    ${i + 1}. "${p.title}" [slug: ${p.slug || 'NULL'}] [featured: ${p.featured}] [hidden: ${p.is_hidden}]`,
          );
        });
      } else {
        warn('Projects in DB', 'EMPTY — add projects via admin panel or SQL');
        return;
      }
    } else {
      fail(
        'Projects query',
        `HTTP ${rawRes.status}: ${JSON.stringify(rawRes.data).substring(0, 200)}`,
      );
      return;
    }

    // Works page query
    const worksRes = await supabaseRequest(
      'projects?select=id,title&is_hidden=eq.false&order=display_order.asc&limit=10',
    );
    if (worksRes.status === 200 && Array.isArray(worksRes.data)) {
      if (worksRes.data.length > 0) {
        pass(
          'Works page query (is_hidden=false)',
          `${worksRes.data.length} visible`,
        );
      } else {
        warn(
          'Works page query',
          '0 results — is_hidden column missing or all hidden',
        );
      }
    } else {
      fail(
        'Works page query',
        `HTTP ${worksRes.status} — is_hidden column likely missing`,
      );
    }

    // Featured projects
    const featuredRes = await supabaseRequest(
      'projects?select=id,title&featured=eq.true&is_hidden=eq.false&limit=10',
    );
    if (featuredRes.status === 200 && Array.isArray(featuredRes.data)) {
      if (featuredRes.data.length > 0) {
        pass(
          'Featured projects query',
          `${featuredRes.data.length} featured visible`,
        );
      } else {
        warn('Featured projects query', '0 results');
      }
    } else {
      fail('Featured projects query', `HTTP ${featuredRes.status}`);
    }
  } catch (err) {
    if (err.message === 'TIMEOUT') return;
    fail('Projects data check', err.message);
  }
}

async function testAuthLogin() {
  console.log('\n━━━ 7. AUTH LOGIN TEST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const res = await supabaseAuthRequest('token?grant_type=password', 'POST', {
      email: 'test@test.com',
      password: 'test_invalid_password_12345',
    });

    if (res.status === 400) {
      const msg =
        res.data?.error_description || res.data?.msg || res.data?.error || '';
      if (
        msg.toLowerCase().includes('invalid') ||
        msg.toLowerCase().includes('credentials')
      ) {
        pass(
          'Auth login endpoint',
          'Working (rejected invalid creds as expected)',
        );
      } else {
        warn('Auth login endpoint', `400 response: ${msg}`);
      }
    } else if (res.status === 422) {
      pass('Auth login endpoint', 'Working (validation error for test input)');
    } else {
      warn(
        'Auth login endpoint',
        `HTTP ${res.status}: ${JSON.stringify(res.data).substring(0, 200)}`,
      );
    }
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      fail('Auth login endpoint', 'TIMEOUT — project paused');
    } else {
      fail('Auth login endpoint', err.message);
    }
  }
}

async function testNextAppRunning() {
  console.log('\n━━━ 8. LOCAL NEXT.JS APP CHECK ━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await new Promise((resolve) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'HEAD',
        timeout: 3000,
      },
      (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          pass(
            'Next.js dev server',
            `Running on :3000 (HTTP ${res.statusCode})`,
          );
        } else {
          warn('Next.js dev server', `HTTP ${res.statusCode}`);
        }
        resolve();
      },
    );
    req.on('error', () => {
      warn('Next.js dev server', "Not running — start with 'npm run dev'");
      resolve();
    });
    req.on('timeout', () => {
      req.destroy();
      warn('Next.js dev server', 'Timeout on localhost:3000');
      resolve();
    });
    req.end();
  });
}

async function testMiddleware() {
  console.log('\n━━━ 9. MIDDLEWARE & CONFIG CHECK ━━━━━━━━━━━━━━━━━━━━━━━━');

  // Check proxy.ts (Next.js 16+ uses proxy.ts instead of middleware.ts)
  const proxyPath = path.resolve(__dirname, '..', 'src', 'proxy.ts');
  if (fs.existsSync(proxyPath)) {
    pass('src/proxy.ts', 'exists — handles auth & route protection');
  } else {
    fail('src/proxy.ts', "MISSING — auth & admin route protection won't work");
  }

  // Check .env.local has required vars
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
  ];
  for (const v of requiredVars) {
    if (
      process.env[v] &&
      process.env[v] !== 'dummy' &&
      !process.env[v].includes('dummy')
    ) {
      pass(`ENV ${v}`, 'set');
    } else {
      fail(`ENV ${v}`, 'MISSING or dummy value');
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     SUPABASE CONNECTION & ENDPOINT TEST SUITE          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  await testMiddleware();

  const isReachable = await testConnectivity();

  if (isReachable) {
    await testAuthEndpoint();
    await testTables();
    await testProjectsColumns();
    await testGalleryImages();
    await testProjectsData();
    await testAuthLogin();
  } else {
    console.log('\n  ⏭️  Skipping API tests — project unreachable\n');
  }

  await testNextAppRunning();

  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                     TEST SUMMARY                       ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(
    `║  ✅ Passed:   ${String(results.passed).padStart(3)}                                    ║`,
  );
  console.log(
    `║  ❌ Failed:   ${String(results.failed).padStart(3)}                                    ║`,
  );
  console.log(
    `║  ⚠️  Warnings: ${String(results.warnings).padStart(3)}                                    ║`,
  );
  console.log('╚══════════════════════════════════════════════════════════╝');

  if (results.failed > 0) {
    console.log('\n🔧 RECOMMENDED FIXES:');
    results.details
      .filter((d) => d.status === 'FAIL')
      .forEach((d, i) => {
        console.log(`   ${i + 1}. ${d.test}: ${d.detail}`);
      });
  }

  if (results.warnings > 0) {
    console.log('\n💡 WARNINGS:');
    results.details
      .filter((d) => d.status === 'WARN')
      .forEach((d, i) => {
        console.log(`   ${i + 1}. ${d.test}: ${d.detail}`);
      });
  }

  console.log('');
  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(2);
});
