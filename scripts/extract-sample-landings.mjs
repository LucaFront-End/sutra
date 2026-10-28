import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.resolve(__dirname, '../SUTRA SEO LANDING_rows.csv');
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/landingFallback.json');

const rl = readline.createInterface({
  input: fs.createReadStream(CSV_PATH),
  crlfDelay: Infinity,
});

let isHeader = true;
let headers = [];
const rows = [];
let count = 0;

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

rl.on('line', (line) => {
  if (isHeader) {
    headers = parseCsvLine(line);
    isHeader = false;
    return;
  }
  if (count < 250) {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    if (obj.Slug) {
      rows.push(obj);
      count++;
    }
  }
});

rl.on('close', () => {
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rows, null, 2), 'utf-8');
  console.log(`Saved ${rows.length} sample landing rows to src/data/landingFallback.json`);
});
