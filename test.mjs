import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port=8099;
const child=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(port),SESSION_SECRET:'test-secret'},stdio:['ignore','pipe','pipe']});
const base=`http://127.0.0.1:${port}`;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function wait(){for(let i=0;i<40;i++){try{const r=await fetch(`${base}/api/health`);if(r.ok)return}catch{}await sleep(150)}throw new Error('Server did not start')}
async function request(path,options={}){const r=await fetch(base+path,options);const body=await r.json();return{r,body}}
try{
  await wait();
  let x=await request('/api/health');
  assert.equal(x.r.status,200);
  assert.equal(x.body.ok,true);

  x=await request('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'student@teachme.demo',password:'TeachMe123!'})});
  assert.equal(x.r.status,200);
  assert.ok(x.body.token);
  const studentToken=x.body.token;

  x=await request('/api/dashboard',{headers:{authorization:`Bearer ${studentToken}`}});
  assert.equal(x.r.status,200);
  assert.equal(x.body.user.role,'student');
  assert.ok(Array.isArray(x.body.assignments));

  const assignment=x.body.assignments[0];
  x=await request(`/api/assignments/${assignment.id}/questions`,{headers:{authorization:`Bearer ${studentToken}`}});
  assert.equal(x.r.status,200);
  assert.equal(x.body.questions.length,assignment.questionCount);
  assert.equal('correctIndex' in x.body.questions[0],false);

  x=await request('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'teacher@teachme.demo',password:'TeachMe123!'})});
  assert.equal(x.r.status,200);
  assert.equal(x.body.user.role,'teacher');

  console.log('Teach Me smoke tests passed');
}finally{
  child.kill('SIGTERM');
}
