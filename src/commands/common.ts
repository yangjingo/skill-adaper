import * as readline from 'readline';

const COMMUNITY_SKILLS_FEED_URL = 'https://github.com/leow3lab/ascend-skills';
const COMMUNITY_CURATED_SKILLS_URL = 'https://github.com/leow3lab/awesome-ascend-skills';

export function promptYesNo(question: string, defaultValue = true): Promise<boolean> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return Promise.resolve(false);
  }

  const suffix = defaultValue ? '[Y/n]' : '[y/N]';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(`${question} ${suffix} `, answer => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      if (!normalized) {
        resolve(defaultValue);
        return;
      }
      resolve(['y', 'yes'].includes(normalized));
    });
  });
}

export function printCommunityLinks(mode: 'radar' | 'targets'): void {
  if (mode === 'radar') {
    console.log('\n?? Community Radar:');
    console.log(`   Shared skills feed: ${COMMUNITY_SKILLS_FEED_URL}`);
    console.log(`   Curated list:       ${COMMUNITY_CURATED_SKILLS_URL}`);
    console.log('\n? Your turn: polish one skill and share it with: sa share <skill-name>');
    return;
  }

  console.log('\n?? Community Targets:');
  console.log(`   ${COMMUNITY_SKILLS_FEED_URL}`);
  console.log(`   ${COMMUNITY_CURATED_SKILLS_URL}`);
}
