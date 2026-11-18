#!/usr/bin/env node

/**
 * Regenerate skills registry.json from SKILL.md files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.join(__dirname, '..');
const registryPath = path.join(packageRoot, 'registry.json');
const curatedRoot = path.join(packageRoot, 'registry', 'curated');
const communityRoot = path.join(packageRoot, 'registry', 'community');

function readFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try {
    const parsed = YAML.parse(match[1]);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'SKILL.md')))
    .map((d) => d.name)
    .sort();
}

function cleanObject(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) continue;
    out[k] = v;
  }
  return out;
}

function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === 'string' && v.trim().length > 0);
}

function slugToDisplayName(slug) {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function buildEntry(name, source, updatedAt) {
  const skillPath = path.join(packageRoot, 'registry', source, name, 'SKILL.md');
  const fm = readFrontmatter(skillPath);
  const metadata = fm?.metadata?.agentos && typeof fm.metadata.agentos === 'object'
    ? fm.metadata.agentos
    : undefined;

  return cleanObject({
    id: source === 'curated' ? `com.framers.skill.${name}` : `com.community.skill.${name}`,
    name,
    displayName:
      typeof fm.name === 'string' && fm.name.trim().length > 0
        ? fm.name
        : slugToDisplayName(name),
    version: typeof fm.version === 'string' && fm.version ? fm.version : '1.0.0',
    path: `registry/${source}/${name}`,
    description: typeof fm.description === 'string' ? fm.description : '',
    category: typeof fm.category === 'string' && fm.category ? fm.category : 'uncategorized',
    namespace: typeof fm.namespace === 'string' && fm.namespace ? fm.namespace : 'wunderland',
    verified: source === 'curated',
    source,
    verifiedAt: source === 'curated' ? updatedAt : undefined,
    keywords: toStringArray(fm.tags),
    requiredSecrets: toStringArray(fm.requires_secrets),
    requiredTools: toStringArray(fm.requires_tools),
    metadata: metadata && typeof metadata === 'object' ? metadata : undefined,
  });
}

function generateRegistry() {
  const updated = new Date().toISOString();
  const curatedNames = listSkillDirs(curatedRoot);
  const communityNames = listSkillDirs(communityRoot);

  const curated = curatedNames.map((name) => buildEntry(name, 'curated', updated));
  const community = communityNames.map((name) => buildEntry(name, 'community', updated));

  return {
    version: '1.0.0',
    updated,
    categories: {
      curated: curatedNames,
      community: communityNames,
    },
    skills: {
      curated,
      community,
    },
    stats: {
      totalSkills: curated.length + community.length,
      curatedCount: curated.length,
      communityCount: community.length,
    },
  };
}

const registry = generateRegistry();
fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

console.log('✅ Skills registry updated');
console.log(`   curated: ${registry.stats.curatedCount}`);
console.log(`   community: ${registry.stats.communityCount}`);
console.log(`   total: ${registry.stats.totalSkills}`);
