export async function handleProductionExtraRoutes({req,res,url,body,need,json,select,insert,update,mapClass,mapAssignment,mapAttempt,safeProfile}){
  if(req.method==='POST'&&url.pathname==='/api/classes'){
    const profile=await need(req,res,['teacher','admin']);if(!profile)return true;
    const input=await body(req);const code=Math.random().toString(36).slice(2,8).toUpperCase();
    const rows=await insert('classes',{school_id:profile.school_id,teacher_id:profile.id,name:input.name||'New Class',grade:input.grade||'',class_code:code});
    json(res,201,mapClass({...rows[0],studentIds:[]}));return true;
  }
  if(req.method==='POST'&&url.pathname==='/api/classes/join'){
    const profile=await need(req,res,['student']);if(!profile)return true;
    const input=await body(req);const classes=await select('classes',{filters:{class_code:String(input.code||'').toUpperCase()},limit:1});
    if(!classes[0]){json(res,404,{error:'Class code not found'});return true}
    await insert('class_enrollments',{class_id:classes[0].id,student_id:profile.id},{returning:false});json(res,200,mapClass({...classes[0],studentIds:[profile.id]}));return true;
  }
  if(req.method==='GET'&&url.pathname==='/api/question-bank'){
    const profile=await need(req,res,['teacher','admin']);if(!profile)return true;
    const rows=await select('questions',{filters:{school_id:profile.school_id},order:'created_at.desc'});json(res,200,rows);return true;
  }
  if(req.method==='POST'&&url.pathname==='/api/question-bank'){
    const profile=await need(req,res,['teacher','admin']);if(!profile)return true;
    const input=await body(req);if(!input.prompt||!Array.isArray(input.options)||input.options.length<2){json(res,400,{error:'Prompt and at least two options are required'});return true}
    const rows=await insert('questions',{school_id:profile.school_id,author_id:profile.id,skill_id:input.skillId||null,prompt:input.prompt,options:input.options,correct_index:Number(input.correctIndex||0),hint:input.hint||'',explanation:input.explanation||'',difficulty:input.difficulty||'on_level'});json(res,201,rows[0]);return true;
  }
  if(req.method==='POST'&&url.pathname==='/api/assignments'){
    const profile=await need(req,res,['teacher','admin']);if(!profile)return true;
    const input=await body(req);const rows=await insert('assignments',{class_id:input.classId,creator_id:profile.id,skill_id:input.skillId||null,title:input.title||'New Assignment',subject:input.subject||'Mathematics',skill_name:input.skill||'',due_at:input.due||null,publish_at:input.publishAt||null,question_count:Math.min(20,Math.max(1,Number(input.questionCount||20))),seconds_per_question:Math.min(600,Math.max(30,Number(input.secondsPerQuestion||180))),status:input.publishAt&&new Date(input.publishAt)>new Date()?'scheduled':'assigned'});
    const assignment=rows[0];let questionIds=Array.isArray(input.questionIds)?input.questionIds:[];
    if(!questionIds.length&&input.skillId){const questions=await select('questions',{filters:{skill_id:input.skillId},limit:assignment.question_count});questionIds=questions.map(q=>q.id)}
    for(let i=0;i<questionIds.slice(0,assignment.question_count).length;i++)await insert('assignment_questions',{assignment_id:assignment.id,question_id:questionIds[i],position:i+1},{returning:false});
    json(res,201,mapAssignment(assignment));return true;
  }
  if(req.method==='POST'&&url.pathname==='/api/goals'){
    const profile=await need(req,res,['teacher','admin']);if(!profile)return true;
    const input=await body(req);const rows=await insert('goals',{student_id:input.studentId,title:input.title||'Learning goal',target:Number(input.target||1),progress:0,due_at:input.due||null,created_by:profile.id});json(res,201,rows[0]);return true;
  }
  if(req.method==='POST'&&url.pathname==='/api/portfolio'){
    const profile=await need(req,res,['student','teacher','admin']);if(!profile)return true;
    const input=await body(req),studentId=profile.role==='student'?profile.id:input.studentId;
    const rows=await insert('portfolio_items',{student_id:studentId,title:input.title||'Portfolio item',subject:input.subject||'General',item_type:input.type||'Reflection',description:input.description||'',artifact_url:input.artifactUrl||null,created_by:profile.id});json(res,201,rows[0]);return true;
  }
  if(req.method==='POST'&&url.pathname==='/api/lesson-plans'){
    const profile=await need(req,res,['teacher','admin']);if(!profile)return true;
    const input=await body(req);const rows=await insert('lesson_plans',{class_id:input.classId,creator_id:profile.id,title:input.title||'Lesson Plan',subject:input.subject||'Mathematics',objective:input.objective||'',lesson_date:input.date||null,duration_minutes:Number(input.duration||45),materials:input.materials||'',activities:Array.isArray(input.activities)?input.activities:[]});json(res,201,rows[0]);return true;
  }
  if(req.method==='POST'&&url.pathname==='/api/notifications'){
    const profile=await need(req,res,['teacher','admin']);if(!profile)return true;
    const input=await body(req),created=[];for(const userId of input.userIds||[]){const rows=await insert('notifications',{user_id:userId,title:input.title||'School update',message:input.message||'',is_read:false,created_by:profile.id});created.push(rows[0])}json(res,201,created);return true;
  }
  if(req.method==='PATCH'&&url.pathname==='/api/ai-policies'){
    const profile=await need(req,res,['admin']);if(!profile)return true;
    const input=await body(req),existing=await select('ai_policies',{filters:{school_id:profile.school_id},limit:1});let rows;
    if(existing[0])rows=await update('ai_policies',{max_daily_messages:Number(input.maxDailyMessages||30),graded_work_mode:input.gradedWorkMode||'hints_only',teacher_visibility:input.teacherVisibility!==false,blocked_topics:input.blockedTopics||[],updated_at:new Date().toISOString()},{school_id:profile.school_id});
    else rows=await insert('ai_policies',{school_id:profile.school_id,max_daily_messages:Number(input.maxDailyMessages||30),graded_work_mode:input.gradedWorkMode||'hints_only',teacher_visibility:input.teacherVisibility!==false,blocked_topics:input.blockedTopics||[]});
    json(res,200,rows[0]);return true;
  }
  if(req.method==='GET'&&url.pathname==='/api/analytics/class'){
    const profile=await need(req,res,['teacher','admin']);if(!profile)return true;
    const classes=await select('classes',{filters:{school_id:profile.school_id}}),profiles=await select('profiles',{filters:{school_id:profile.school_id}}),attempts=await select('attempts');
    const completed=attempts.filter(a=>a.status!=='draft'),average=completed.length?completed.reduce((n,a)=>n+Number(a.teacher_score??a.auto_score??0),0)/completed.length:0;
    json(res,200,{classCount:classes.length,studentCount:profiles.filter(p=>p.role==='student').length,assignmentCount:(await select('assignments')).length,completionRate:completed.length?100:0,averagePercent:Math.round(average/20*100),subjects:{},interventions:[]});return true;
  }
  if(req.method==='GET'&&url.pathname==='/api/reports/weekly'){
    const profile=await need(req,res,['teacher','admin','parent']);if(!profile)return true;
    let students=[];if(profile.role==='parent'){const links=await select('parent_links',{filters:{parent_id:profile.id}});for(const link of links){const rows=await select('profiles',{filters:{id:link.student_id},limit:1});if(rows[0])students.push(rows[0])}}else students=(await select('profiles',{filters:{school_id:profile.school_id}})).filter(p=>p.role==='student');
    const reports=[];for(const student of students){const attempts=await select('attempts',{filters:{student_id:student.id}}),goals=await select('goals',{filters:{student_id:student.id}}),portfolio=await select('portfolio_items',{filters:{student_id:student.id}});const completed=attempts.filter(a=>a.status!=='draft'),avg=completed.length?Math.round(completed.reduce((n,a)=>n+Number(a.teacher_score??a.auto_score??0),0)/completed.length/20*100):0;reports.push({student:safeProfile(student),completedSessions:completed.length,averagePercent:avg,goals,portfolioCount:portfolio.length,recommendation:avg<70?'Assign foundational support and schedule teacher intervention.':avg<85?'Continue guided practice and review corrections.':'Offer challenge work and celebrate mastery.'})}
    json(res,200,{generatedAt:new Date().toISOString(),reports});return true;
  }
  if(req.method==='GET'&&url.pathname==='/api/parent/progress'){
    const profile=await need(req,res,['parent']);if(!profile)return true;
    const links=await select('parent_links',{filters:{parent_id:profile.id}}),students=[],attempts=[];for(const link of links){const p=await select('profiles',{filters:{id:link.student_id},limit:1});if(p[0])students.push(safeProfile(p[0]));attempts.push(...(await select('attempts',{filters:{student_id:link.student_id}})).map(mapAttempt))}json(res,200,{students,attempts,assignments:(await select('assignments')).map(mapAssignment)});return true;
  }
  return false;
}
