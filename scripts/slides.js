const {spawn} = require('child_process');
const path = require('path');

const file = path.resolve(__dirname, '..', 'docs', 'slides.html');
const platform = process.platform;

const run = (cmd, args) => spawn(cmd, args, {stdio: 'ignore', detached: true, shell: false});

try {
  if (platform === 'win32') {
    run('cmd', ['/c', 'start', '', file]).unref();
  } else if (platform === 'darwin') {
    run('open', [file]).unref();
  } else {
    run('xdg-open', [file]).unref();
  }
  console.log(`Opened slides: ${file}`);
} catch (err) {
  console.log(`Failed to auto-open slides. Open this file manually: ${file}`);
}
