import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Map([['/', ['index.html','text/html']], ['/app.js',['app.js','text/javascript']], ['/style.css',['style.css','text/css']]]);
const server = http.createServer(async(req,res)=>{
  const file = files.get(new URL(req.url,'http://localhost').pathname);
  if(!file){res.writeHead(404);res.end('Not found');return;}
  try { const data=await readFile(new URL(file[0],import.meta.url));res.writeHead(200,{'Content-Type':file[1]+'; charset=utf-8','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});res.end(data); }
  catch {res.writeHead(500);res.end('Unable to read file');}
});
server.listen(Number(process.env.PORT||3000),'127.0.0.1',()=>console.log('AI経営チーム: http://127.0.0.1:' + server.address().port));
