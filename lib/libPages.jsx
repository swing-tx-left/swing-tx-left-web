import fs from 'fs';
import path from 'path';

export function getPages(){
	let pagesFiles=fs.readdirSync(path.join(process.cwd(),pagecontent));
}