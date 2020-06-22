import fs from 'fs';
import path from 'path';
import { renderImage } from '../src/renderer';

fs.writeFileSync(
  path.join(__dirname, '../tmp/normal.png'),
  renderImage('たのしいメーカー', 'たのしいメーカーです。遊んでください。')
);
fs.writeFileSync(
  path.join(__dirname, '../tmp/long.png'),
  renderImage(
    'ほげほげほげふがふがふがふがふがふが',
    'ぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよぴよ'
  )
);
fs.writeFileSync(
  path.join(__dirname, '../tmp/emoji.png'),
  renderImage('こんにちは🎉✨✨', '☺☺こんばんはこんばんは🎉✨✨こんばんはこんばんは🎉✨✨')
);

console.log('see ./tmp');
