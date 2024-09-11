import fs from 'fs';
try {
  const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  const version = packageJSON['version'];

  const compiled = (new Date).toISOString();

  fs.writeFileSync('./src/assets/game.version.json', JSON.stringify({ version, compiled }), { encoding: 'utf-8' });
} catch (e) {
  fs.writeFileSync('./src/assets/game.version.json', JSON.stringify({ version: '0.0.0' }), { encoding: 'utf-8' }); 
}