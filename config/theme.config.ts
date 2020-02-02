import fs from 'fs';
import path from 'path';
import lessToJs from 'less-vars-to-js';

export default pathname => {
  const themePath = path.join(__dirname, pathname);
  return lessToJs(fs.readFileSync(themePath, 'utf8'));
};
