import fs from 'fs';
import path from 'path';
import { imageRoot } from '../../config';

export default function handler(req, res) {
  fs.readdir(imageRoot, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read folders' });
    }
    const folders = files.filter(file => fs.statSync(path.join(imageRoot, file)).isDirectory());
    res.json(folders);
  });
}