import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

export function getSiteSettings(){
	return yaml.safeLoad( fs.readFileSync(path.join(process.cwd(), 'settings.yml'), 'utf-8'));
}