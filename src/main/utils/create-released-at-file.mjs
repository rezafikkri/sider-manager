import { writeFileSync } from 'node:fs';
import path from 'node:path';

const releasedAt = 1740873838;

function createReleasedAtFile() {
  writeFileSync(path.join('release', 'released-at.txt'), releasedAt.toString());
}

createReleasedAtFile();
