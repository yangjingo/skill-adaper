/**
 * Shared path helpers for discovery-related commands.
 */

import * as fs from 'fs';
import * as path from 'path';

export function findOpenClawSkillsPath(): string | null {
  const possiblePaths = [
    path.join(process.env.USERPROFILE || '', '.openclaw', 'skills'),
    path.join(process.env.APPDATA || '', 'openclaw', 'skills'),
    path.join(process.env.HOME || '', '.openclaw', 'skills'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Find OpenClaw workspace directory
 * Contains AGENTS.md, SOUL.md, MEMORY.md, USER.md, skills/
 */
export function findOpenClawWorkspacePath(): string | null {
  const possiblePaths = [
    path.join(process.env.USERPROFILE || '', '.openclaw', 'workspace'),
    path.join(process.env.APPDATA || '', 'openclaw', 'workspace'),
    path.join(process.env.HOME || '', '.openclaw', 'workspace'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function findClaudeCodeSkillsPath(): string | null {
  const possiblePaths = [
    path.join(process.env.USERPROFILE || '', '.claude'),
    path.join(process.env.APPDATA || '', 'claude'),
    path.join(process.env.HOME || '', '.claude'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Find Claude Code plugins cache directory
 * Skills are installed in ~/.claude/plugins/cache/<marketplace>/<plugin-name>/<version>/skills/
 */
export function findClaudeCodePluginsPath(): string | null {
  const basePaths = [
    process.env.USERPROFILE || '',
    process.env.APPDATA || '',
    process.env.HOME || '',
  ];
  for (const base of basePaths) {
    if (!base) continue;
    const pluginsPath = path.join(base, '.claude', 'plugins', 'cache');
    if (fs.existsSync(pluginsPath)) return pluginsPath;
  }
  return null;
}

/**
 * Get all installed Claude Code plugins/skills from plugins cache
 */
export function getClaudeCodePlugins(): { name: string; path: string; marketplace: string }[] {
  const plugins: { name: string; path: string; marketplace: string }[] = [];
  const pluginsCachePath = findClaudeCodePluginsPath();

  if (!pluginsCachePath) return plugins;

  try {
    const installedPluginsPath = path.join(path.dirname(pluginsCachePath), 'installed_plugins.json');
    if (fs.existsSync(installedPluginsPath)) {
      const installedPlugins = JSON.parse(fs.readFileSync(installedPluginsPath, 'utf-8'));
      if (installedPlugins.plugins) {
        for (const [pluginId, installations] of Object.entries(installedPlugins.plugins)) {
          const installs = installations as Array<{ installPath: string; scope: string }>;
          if (installs && installs.length > 0) {
            const install = installs[0];
            const name = pluginId.split('@')[0];
            const marketplace = pluginId.split('@')[1] || 'unknown';
            plugins.push({
              name,
              path: install.installPath,
              marketplace
            });
          }
        }
      }
    }
  } catch {
    // Fallback: scan directory structure
    try {
      const marketplaces = fs.readdirSync(pluginsCachePath);
      for (const marketplace of marketplaces) {
        const marketplacePath = path.join(pluginsCachePath, marketplace);
        if (!fs.statSync(marketplacePath).isDirectory()) continue;

        const pluginDirs = fs.readdirSync(marketplacePath);
        for (const pluginDir of pluginDirs) {
          const pluginPath = path.join(marketplacePath, pluginDir);
          if (!fs.statSync(pluginPath).isDirectory()) continue;

          const versions = fs.readdirSync(pluginPath);
          if (versions.length > 0) {
            const latestVersion = versions[0];
            const skillPath = path.join(pluginPath, latestVersion);
            plugins.push({
              name: pluginDir,
              path: skillPath,
              marketplace
            });
          }
        }
      }
    } catch {
      // Ignore fallback errors
    }
  }

  return plugins;
}
