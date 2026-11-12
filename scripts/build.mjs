import {build} from 'esbuild';
import {mkdir,cp,rm} from 'node:fs/promises';
import {globSync} from 'node:fs';
await rm('dist',{recursive:true,force:true});await mkdir('dist/assets/js',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
for(const file of [...globSync('*.html'),'favicon.ico','apple-touch-icon.png','robots.txt','sitemap.xml'])await cp(file,'dist/'+file);
await build({entryPoints:['src/workspace.mjs'],bundle:true,minify:true,format:'esm',outfile:'dist/assets/js/workspace.js',target:['es2022'],logLevel:'info'});
