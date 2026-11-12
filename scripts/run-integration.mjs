import {spawn} from 'node:child_process';
const server=spawn(process.execPath,['--env-file=.env.test','scripts/dev.mjs'],{stdio:['ignore','pipe','inherit']});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
const test=spawn(process.execPath,['--env-file=.env.test','--test','tests/integration.test.mjs'],{env:{...process.env,INTEGRATION:'1'},stdio:'inherit'});
const exitCode=await new Promise(resolve=>test.on('exit',resolve));server.kill();process.exit(exitCode||0);
