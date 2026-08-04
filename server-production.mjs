import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { authPassword, authUser, healthCheck, insert, select, supabaseEnabled, update } from './lib/supabase-rest.mjs';

if(!supabaseEnabled){
  await import('./server.mjs');
}else{
  const __dirname=path.dirname(fileURLToPath(import.meta.url));
  const publicDir=path.join(__dirname,'public');
  const PORT=Number(process.env.PORT||8080);
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml'};

  function json(res,status,data){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data))}
  async function body(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>5e6)throw new Error('Payload too large')}return text?JSON.parse(text):{}}
  function bearer(req){const value=req.headers.authorization||'';return value.startsWith('Bearer ')?value.slice(7):''}
  async function currentProfile(req){const token=bearer(req);if(!token)return null;const user=await authUser(token);const rows=await select('profiles',{filters:{id:user.id},limit:1});if(!rows[0])return null;return{...rows[0],email:user.email,accessToken:token}}
  async function need(req,res,roles=[]){try{const profile=await currentProfile(req);if(!profile){json(res,401,{error:'Authentication required'});return null}if(roles.length&&!roles.includes(profile.role)){json(res,403,{error:'Access denied'});return null}return profile}catch(error){json(res,401,{error:error.message});return null}}
  const safeProfile=p=>({id:p.id,name:p.full_name,fullName:p.full_name,email:p.email,role:p.role,grade:p.grade,schoolId:p.school_id});
  const mapClass=c=>({id:c.id,schoolId:c.school_id,teacherId:c.teacher_id,name:c.name,grade:c.grade,code:c.class_code,studentIds:c.studentIds||[]});
  const mapAssignment=a=>({id:a.id,classId:a.class_id,createdBy:a.creator_id,skillId:a.skill_id,title:a.title,subject:a.subject||'Mathematics',skill:a.skill_name||'',due:a.due_at?String(a.due_at).slice(0,10):'',publishAt:a.publish_at,questionCount:a.question_count,secondsPerQuestion:a.seconds_per_question,status:a.status});
  const mapAttempt=a=>({id:a.id,assignmentId:a.assignment_id,studentId:a.student_id,status:a.status,score:a.auto_score,teacherScore:a.teacher_score,feedback:a.feedback,submittedAt:a.submitted_at,gradedAt:a.graded_at,gradedBy:a.graded_by,answers:a.answers||[]});

  async function dashboard(profile){
    const schools=await select('schools',{filters:{id:profile.school_id},limit:1});
    const profiles=await select('profiles',{filters:{school_id:profile.school_id}});
    let classes=[];
    if(profile.role==='student'){
      const enrollments=await select('class_enrollments',{filters:{student_id:profile.id}});
      const ids=enrollments.map(e=>e.class_id);
      for(const classId of ids){const rows=await select('classes',{filters:{id:classId},limit:1});if(rows[0])classes.push(rows[0])}
    }else classes=await select('classes',{filters:{school_id:profile.school_id}});
    const classIds=classes.map(c=>c.id);
    const enrollments=await select('class_enrollments');
    const mappedClasses=classes.map(c=>mapClass({...c,studentIds:enrollments.filter(e=>e.class_id===c.id).map(e=>e.student_id)}));
    let assignments=[];
    for(const classId of classIds){const rows=await select('assignments',{filters:{class_id:classId}});assignments.push(...rows)}
    let attempts=[];
    if(profile.role==='student')attempts=await select('attempts',{filters:{student_id:profile.id}});
    else if(profile.role==='parent')attempts=[];
    else attempts=await select('attempts');
    const goals=profile.role==='student'?await select('goals',{filters:{student_id:profile.id}}):await select('goals');
    const portfolio=profile.role==='student'?await select('portfolio_items',{filters:{student_id:profile.id}}):await select('portfolio_items');
    const notifications=await select('notifications',{filters:{user_id:profile.id},order:'created_at.desc'});
    return{
      school:schools[0]||null,
      user:safeProfile(profile),
      users:profiles.map(p=>safeProfile({...p,email:null})),
      classes:mappedClasses,
      assignments:assignments.map(mapAssignment),
      attempts:attempts.map(mapAttempt),
      goals:goals.map(g=>({id:g.id,studentId:g.student_id,title:g.title,target:g.target,progress:g.progress,due:g.due_at})),
      portfolioItems:portfolio.map(p=>({id:p.id,studentId:p.student_id,title:p.title,subject:p.subject,type:p.item_type,description:p.description,artifactUrl:p.artifact_url,createdAt:p.created_at})),
      notifications:notifications.map(n=>({id:n.id,userId:n.user_id,title:n.title,message:n.message,read:n.is_read,createdAt:n.created_at})),
      skills:await select('skills'),standards:[],questionBank:[],drafts:[],lessonPlans:[],aiPolicies:{maxDailyMessages:30,gradedWorkMode:'hints_only',teacherVisibility:true}
    }
  }

  async function api(req,res,url){
    if(req.method==='GET'&&url.pathname==='/api/health')return json(res,200,{ok:true,version:'9.0.0',storage:'supabase',supabase:await healthCheck()});
    if(req.method==='POST'&&url.pathname==='/api/login'){
      try{const input=await body(req);const session=await authPassword(input.email,input.password);const user=await authUser(session.access_token);const rows=await select('profiles',{filters:{id:user.id},limit:1});if(!rows[0])return json(res,403,{error:'Account profile is not configured'});return json(res,200,{token:session.access_token,user:safeProfile({...rows[0],email:user.email})})}catch(error){return json(res,401,{error:error.message})}
    }
    if(req.method==='GET'&&url.pathname==='/api/dashboard'){const profile=await need(req,res);if(!profile)return;return json(res,200,await dashboard(profile))}
    const questionMatch=url.pathname.match(/^\/api\/assignments\/([^/]+)\/questions$/);
    if(req.method==='GET'&&questionMatch){const profile=await need(req,res,['student']);if(!profile)return;const assignments=await select('assignments',{filters:{id:questionMatch[1]},limit:1});const assignment=assignments[0];if(!assignment)return json(res,404,{error:'Assignment not found'});const links=await select('assignment_questions',{filters:{assignment_id:assignment.id},order:'position.asc'});const questions=[];for(const link of links){const rows=await select('questions',{filters:{id:link.question_id},limit:1});if(rows[0]){const{correct_index,...q}=rows[0];questions.push({id:q.id,prompt:q.prompt,options:q.options,hint:q.hint,explanation:q.explanation})}}return json(res,200,{assignment:mapAssignment(assignment),questions,draft:null})}
    if(req.method==='POST'&&url.pathname==='/api/attempts'){
      const profile=await need(req,res,['student']);if(!profile)return;const input=await body(req);const assignments=await select('assignments',{filters:{id:input.assignmentId},limit:1});if(!assignments[0])return json(res,404,{error:'Assignment not found'});const links=await select('assignment_questions',{filters:{assignment_id:input.assignmentId},order:'position.asc'});let score=0;for(let i=0;i<links.length;i++){const rows=await select('questions',{filters:{id:links[i].question_id},limit:1});if(rows[0]&&input.answers?.[i]?.selectedIndex===rows[0].correct_index)score++}
      const created=await insert('attempts',{assignment_id:input.assignmentId,student_id:profile.id,status:'submitted',auto_score:score,submitted_at:new Date().toISOString()});const attempt=created[0];for(let i=0;i<(input.answers||[]).length;i++){const answer=input.answers[i];await insert('attempt_answers',{attempt_id:attempt.id,question_id:links[i]?.question_id||null,selected_index:answer.selectedIndex,time_used_seconds:answer.timeUsed||null,work_image_url:null},{returning:false})}return json(res,201,mapAttempt(attempt))
    }
    const gradeMatch=url.pathname.match(/^\/api\/attempts\/([^/]+)\/grade$/);
    if(req.method==='PATCH'&&gradeMatch){const profile=await need(req,res,['teacher','admin']);if(!profile)return;const input=await body(req);const rows=await update('attempts',{teacher_score:Number(input.teacherScore),feedback:String(input.feedback||''),status:input.returnForRevision?'revision_requested':'returned',graded_by:profile.id,graded_at:new Date().toISOString()},{id:gradeMatch[1]});return json(res,200,mapAttempt(rows[0]))}
    if(req.method==='POST'&&url.pathname==='/api/ai'){const profile=await need(req,res,['student','teacher']);if(!profile)return;const input=await body(req);const text=String(input.message||'');const response=/answer|solve it for me/i.test(text)?'I can guide you with a hint, but I will not complete graded work. Show me your first step.':'Tell me the exact skill and where you are stuck. I will explain it step by step and then check your understanding.';await insert('ai_activity',{user_id:profile.id,prompt:text,response},{returning:false});return json(res,200,{response,mode:'safe-production'})}
    return json(res,404,{error:'Not found'})
  }

  async function staticFile(req,res,url){let rel=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname),file=path.join(publicDir,rel);if(!file.startsWith(publicDir))return json(res,403,{error:'Forbidden'});try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');const content=await readFile(file);res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':path.extname(file)==='.html'?'no-cache':'public, max-age=3600'});res.end(content)}catch{const content=await readFile(path.join(publicDir,'index.html'));res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(content)}}
  const server=http.createServer(async(req,res)=>{const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);try{url.pathname.startsWith('/api/')?await api(req,res,url):await staticFile(req,res,url)}catch(error){console.error(error);json(res,500,{error:'Server error'})}});
  server.listen(PORT,()=>console.log(`Teach Me production server running at http://localhost:${PORT}`));
}
