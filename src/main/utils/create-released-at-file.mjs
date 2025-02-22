import { writeFileSync } from 'node:fs';
import path from 'node:path';

const releasedAt = 1740227412;

function createReleasedAtFile() {
  writeFileSync(path.join('release', 'released-at.txt'), releasedAt);
}

createReleasedAtFile();
