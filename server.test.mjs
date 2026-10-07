import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
test('serves application and refuses non-public files',async()=>{
 const proc=spawn(process.execPath,['server.mjs'],{cwd:new URL('.',import.meta.url),env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
 try {const [data]=await once(proc.stdout,'data');const origin=data.toString().match(/http:\/\/127\.0\.0\.1:\d+/)[0];for(const path of ['/','/app.js','/style.css']){const r=await fetch(origin+path);assert.equal(r.status,200);assert.ok(r.headers.get('content-security-policy'));assert.ok((await r.text()).length>100)}for(const path of ['/README.md','/.env','/server.mjs'])assert.equal((await fetch(origin+path)).status,404);}
 finally{proc.kill();}
});
