(() => {
  const grades=['TK','K','1','2','3','4','5','6','7','8','9','10','11','12'];
  const standards={
    Mathematics:{
      TK:['CA.PK.NS.1','CA.PK.OA.1'],K:['K.CC.A.1','K.OA.A.1'],1:['1.OA.A.1','1.NBT.B.2'],2:['2.OA.A.1','2.NBT.B.5'],3:['3.OA.A.1','3.NF.A.1'],4:['4.OA.A.3','4.NF.B.3'],5:['5.NBT.B.5','5.NF.A.1'],6:['6.RP.A.3','6.EE.B.7'],7:['7.RP.A.2','7.EE.B.4'],8:['8.EE.C.7','8.F.B.4'],9:['HSA-REI.B.3','HSF-IF.B.4'],10:['HSG-SRT.B.5','HSA-CED.A.2'],11:['HSF-BF.A.1','HSS-ID.B.6'],12:['HSA-REI.D.11','HSF-LE.A.4']
    },
    'Language Arts':{
      TK:['CA.PK.RL.1','CA.PK.L.1'],K:['RL.K.1','L.K.1'],1:['RL.1.2','L.1.1'],2:['RI.2.2','L.2.4'],3:['RL.3.2','RI.3.1'],4:['RI.4.2','L.4.4'],5:['RL.5.1','RI.5.2'],6:['RL.6.2','RI.6.1'],7:['RI.7.2','L.7.4'],8:['RL.8.2','RI.8.8'],9:['RL.9-10.2','RI.9-10.1'],10:['RI.9-10.5','W.9-10.1'],11:['RL.11-12.2','RI.11-12.6'],12:['RI.11-12.8','W.11-12.1']
    },
    Science:{
      TK:['CA.PK.LS.1','CA.PK.ESS.1'],K:['K-LS1-1','K-ESS2-1'],1:['1-LS1-1','1-PS4-1'],2:['2-LS2-1','2-ESS2-1'],3:['3-LS1-1','3-PS2-2'],4:['4-ESS1-1','4-PS3-2'],5:['5-LS1-1','5-PS1-1'],6:['MS-LS1-1','MS-PS1-2'],7:['MS-LS2-1','MS-ESS2-4'],8:['MS-PS2-2','MS-ESS1-1'],9:['HS-LS1-2','HS-PS1-5'],10:['HS-LS2-4','HS-ESS2-2'],11:['HS-PS2-1','HS-LS3-1'],12:['HS-ESS3-4','HS-PS3-3']
    }
  };

  const rand=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
  const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
  const choice=a=>a[rand(0,a.length-1)];
  const uniqueOptions=(correct,others)=>shuffle([String(correct),...others.map(String)]).filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);

  function mathQuestion(grade,index){
    const g=grade==='TK'?0:grade==='K'?0:Number(grade);
    if(g<=1){const a=rand(1,9),b=rand(1,9);const sum=a+b;return q(`Count and add: ${a} + ${b} = ?`,uniqueOptions(sum,[sum-1,sum+1,sum+2]),String(sum),standards.Mathematics[grade][index%2],'Add within 20');}
    if(g===2){const a=rand(20,80),b=rand(10,19);const ans=a+b;return q(`${a} + ${b} = ?`,uniqueOptions(ans,[ans-10,ans+10,ans-1]),String(ans),choice(standards.Mathematics[grade]),'Add within 100');}
    if(g===3){const a=rand(2,9),b=rand(2,9),ans=a*b;return q(`A class has ${a} rows with ${b} students in each row. How many students are there?`,uniqueOptions(ans,[a+b,ans-b,ans+b]),String(ans),choice(standards.Mathematics[grade]),'Multiplication');}
    if(g===4){const d=choice([2,3,4,5,6,8]),n1=rand(1,d-1),n2=rand(1,d-1),ans=n1+n2;return q(`What is ${n1}/${d} + ${n2}/${d}?`,uniqueOptions(`${ans}/${d}`,[`${ans}/${d*2}`,`${n1+n2}/${d+1}`,`${Math.max(1,ans-1)}/${d}`]),`${ans}/${d}`,choice(standards.Mathematics[grade]),'Add fractions');}
    if(g===5){const a=rand(12,99),b=rand(4,12),ans=a*b;return q(`A school orders ${b} boxes with ${a} pencils in each box. How many pencils are ordered?`,uniqueOptions(ans,[a+b,ans-a,ans+b]),String(ans),choice(standards.Mathematics[grade]),'Multi-digit multiplication');}
    if(g===6){const total=rand(40,120),part=choice([10,20,25,50]),ans=total*part/100;return q(`What is ${part}% of ${total}?`,uniqueOptions(ans,[total-part,part,total/2]),String(ans),choice(standards.Mathematics[grade]),'Percent of a quantity');}
    if(g===7){const x=rand(2,10),m=rand(2,7),b=rand(1,12),y=m*x+b;return q(`Solve ${m}x + ${b} = ${y}.`,uniqueOptions(x,[x-1,x+1,m+x]),String(x),choice(standards.Mathematics[grade]),'Linear equations');}
    if(g===8){const slope=rand(1,6),b=rand(-5,5),x=rand(1,8),y=slope*x+b;return q(`For y = ${slope}x ${b>=0?'+ '+b:'- '+Math.abs(b)}, what is y when x = ${x}?`,uniqueOptions(y,[y-slope,y+slope,slope+b]),String(y),choice(standards.Mathematics[grade]),'Linear functions');}
    const a=rand(1,5),b=rand(-8,8),x=rand(-4,6),ans=a*x+b;return q(`For f(x) = ${a}x ${b>=0?'+ '+b:'- '+Math.abs(b)}, find f(${x}).`,uniqueOptions(ans,[ans-a,ans+a,a+b]),String(ans),choice(standards.Mathematics[grade]),'Evaluate functions');
  }

  function elaQuestion(grade,index){
    const g=grade==='TK'?0:grade==='K'?0:Number(grade);
    if(g<=1){const word=choice(['cat','sun','map','dog','fish']);return q(`Which word begins with the same sound as “${word}”?`,shuffle(soundOptions(word)),soundOptions(word)[0],choice(standards['Language Arts'][grade]),'Phonics and word recognition');}
    const passages=[
      ['Maya planted tomato seeds in a sunny garden. She watered them every morning. After two weeks, small green sprouts appeared.','Maya cared for the seeds each day.'],
      ['The library opened a new reading room. Students can choose books, listen to audiobooks, and work quietly after school.','The new room gives students several ways to read and study.'],
      ['During a heat wave, the city opened cooling centers and asked residents to drink water and avoid outdoor activity at midday.','The city took steps to help people stay safe in extreme heat.'],
      ['A scientist compared two soil samples. One held more water, while the other drained quickly. The results helped the team choose soil for a school garden.','Comparing soil properties helped the team make a practical decision.']
    ];
    const [text,main]=passages[index%passages.length];
    if(g<=5)return q(`Read: “${text}” What is the main idea?`,uniqueOptions(main,['The passage explains a problem with no solution.','The passage is mainly about a holiday.','The passage lists unrelated facts.']),main,choice(standards['Language Arts'][grade]),'Main idea and key details');
    if(g<=8)return q(`Read: “${text}” Which statement best summarizes the passage?`,uniqueOptions(main,['The writer argues that all students should work outside.','The passage focuses only on one minor detail.','The writer tells a fictional adventure story.']),main,choice(standards['Language Arts'][grade]),'Objective summary');
    return q(`Read: “${text}” Which claim is best supported by the evidence?`,uniqueOptions(main,['The evidence proves that one action solves every problem.','The passage relies mainly on personal opinion.','The details do not support any clear conclusion.']),main,choice(standards['Language Arts'][grade]),'Citing evidence and analysis');
  }

  function soundOptions(word){const map={cat:['cap','sun','fish','dog'],sun:['sock','map','dog','fish'],map:['moon','cat','fish','sun'],dog:['desk','cat','sun','map'],fish:['fan','dog','map','sun']};return map[word];}

  function scienceQuestion(grade,index){
    const g=grade==='TK'?0:grade==='K'?0:Number(grade);
    const sets=[
      ['Which living thing needs sunlight and water to grow?',['A plant','A rock','A spoon','A chair'],'A plant','Living things'],
      ['What usually happens when a solid is heated enough?',['It may melt','It becomes heavier','It disappears instantly','It always freezes'],'It may melt','Matter and energy'],
      ['Which observation is evidence that a chemical reaction occurred?',['A new gas formed','The object moved','The sample was measured','The container was labeled'],'A new gas formed','Chemical reactions'],
      ['Why are decomposers important in an ecosystem?',['They recycle nutrients','They create sunlight','They stop all competition','They remove all water'],'They recycle nutrients','Ecosystems'],
      ['Which statement best describes a force?',['A push or pull','A kind of matter','A source of light only','A type of organism'],'A push or pull','Forces and motion'],
      ['What causes day and night on Earth?',['Earth rotates on its axis','The Moon blocks the Sun daily','Earth moves closer to the Sun','Clouds cover the sky'],'Earth rotates on its axis','Earth and space systems']
    ];
    let [prompt,opts,correct,skill]=sets[index%sets.length];
    if(g>=9&&index%3===0){prompt='Which model best explains why increasing temperature usually increases reaction rate?';opts=['Particles collide more often and with greater energy','Particles stop moving','Atoms disappear','Mass is no longer conserved'];correct=opts[0];skill='Physical science modeling';}
    return q(prompt,shuffle(opts),correct,choice(standards.Science[grade]),skill);
  }

  function q(prompt,options,correct,standard,skill){return{prompt,options,correctIndex:options.indexOf(String(correct)),standard,skill,source:'Original Teach Me item aligned to California standards'};}

  function generate(grade='5',subject='Mathematics',count=20){
    const normalized=grade==='Kindergarten'?'K':String(grade).replace('Grade ','');
    const g=grades.includes(normalized)?normalized:'5';
    const maker=subject==='Language Arts'?elaQuestion:subject==='Science'?scienceQuestion:mathQuestion;
    const pool=[];
    for(let i=0;i<Math.max(count*2,24);i++){
      const item=maker(g,i);
      item.id=`${subject.slice(0,2).toLowerCase()}-${g}-${Date.now()}-${i}`;
      item.grade=g;item.subject=subject;
      pool.push(item);
    }
    const seen=new Set();
    return pool.filter(item=>{const key=item.prompt; if(seen.has(key))return false;seen.add(key);return true}).slice(0,count);
  }

  window.TeachMeStandardsBank={generate,standards,grades};
})();
