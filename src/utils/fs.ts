import { promisify } from 'util';
import fs from 'fs';

export const mkdir = promisify(fs.mkdir);
export const copyFile = promisify(fs.copyFile);
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const unlink = promisify(fs.unlink);
export const stat = promisify(fs.stat);