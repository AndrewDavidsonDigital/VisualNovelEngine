import fs from 'fs';
try {
  const version = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' })).version;
  const compiled = new Date().toISOString();
  fs.writeFileSync('./src/assets/game.version.json', JSON.stringify({ version, compiled }), { encoding: 'utf-8' });
} catch {
  fs.writeFileSync('./src/assets/game.version.json', JSON.stringify({ version: '0.0.0' }), { encoding: 'utf-8' }); 
}