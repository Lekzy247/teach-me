(() => {
  const bank = window.TeachMeStandardsBank;
  if (!bank) return;
  const originalGenerate = bank.generate.bind(bank);
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const shuffle = list => list.map(value => [Math.random(), value]).sort((a,b)=>a[0]-b[0]).map(item=>item[1]);
  const make = (subject, grade, standard, skill, prompt, correct, distractors, index) => {
    const options = shuffle([String(correct), ...distractors.map(String)]).slice(0,4);
    return { id:`ca-v2-${subject.slice(0,2)}-${grade}-${Date.now()}-${index}`, subject, grade, standard, skill, prompt, options, correctIndex:options.indexOf(String(correct)), source:'Original Teach Me item aligned to California standards' };
  };

  function elaExtra(grade,index){
    const passages=[
      ['Jordan noticed that the classroom lights were often left on after lunch. Jordan made reminder signs, and the class began turning the lights off before leaving.','Jordan helped the class save energy by creating reminders.'],
      ['A neighborhood group planted native flowers near a school. The flowers required less water and attracted butterflies and bees.','Native flowers supported wildlife and conserved water.'],
      ['Rina practiced the violin for fifteen minutes each day. At first, the song sounded uneven, but after two weeks she played it smoothly.','Regular practice helped Rina improve.'],
      ['The city added protected bike lanes near several schools. More families began biking, and traffic around the schools decreased.','Bike lanes encouraged biking and reduced school traffic.'],
      ['Scientists placed two plants in different locations. The plant near the window grew taller than the plant in a dark cabinet.','Light affected how the plants grew.'],
      ['A student council surveyed classmates about recess equipment. Based on the results, the school purchased more soccer balls and jump ropes.','Survey results helped the school choose needed equipment.']
    ];
    const [text,main]=passages[index%passages.length];
    const standards=bank.standards['Language Arts'][grade]||['RI.5.2'];
    const standard=standards[index%standards.length];
    const prompt=`Read: “${text}” Which statement best expresses the central idea?`;
    return make('Language Arts',grade,standard,'Main idea and evidence',prompt,main,[
      'The passage mainly lists unrelated events.',
      'The author explains why no action was successful.',
      'The passage focuses only on a small detail.'
    ],index);
  }

  function scienceExtra(grade,index){
    const scenarios=[
      ['A student places one ice cube in sunlight and another in shade. Which result is most likely?','The cube in sunlight melts faster',['Both freeze immediately','The shaded cube disappears','Neither cube changes'],'Matter and energy'],
      ['A plant is kept without light for several days. Which change is most likely?','Its growth slows',['It produces more food','It becomes a rock','Its roots vanish instantly'],'Organisms and energy'],
      ['Two identical toy cars are pushed with different forces. What should happen?','The car pushed harder accelerates more',['Both cars always stop','The weaker push creates more speed','Force has no effect'],'Forces and motion'],
      ['Water vapor cools and forms droplets on a glass. What process occurred?','Condensation',['Evaporation','Melting','Freezing'],'Earth systems'],
      ['A food web loses many plant species. What is a likely effect?','Consumers have less available energy',['Predators make more sunlight','Water disappears from Earth','All organisms grow faster'],'Ecosystems'],
      ['Engineers test several bridge designs using the same weights. Why should the weights stay the same?','To make the comparison fair',['To make every bridge identical','To remove the need for data','To guarantee all bridges fail'],'Engineering design']
    ];
    const [prompt,correct,distractors,skill]=scenarios[index%scenarios.length];
    const standards=bank.standards.Science[grade]||['5-PS1-1'];
    return make('Science',grade,standards[index%standards.length],skill,prompt,correct,distractors,index);
  }

  bank.generate = function(grade='5', subject='Mathematics', count=20){
    const normalized=grade==='Kindergarten'?'K':String(grade).replace('Grade ','');
    const base=originalGenerate(grade,subject,count);
    const seen=new Set(base.map(item=>item.prompt));
    let index=0;
    while(base.length<count && index<200){
      const item=subject==='Language Arts'?elaExtra(normalized,index):subject==='Science'?scienceExtra(normalized,index):originalGenerate(grade,subject,1)[0];
      if(item && !seen.has(item.prompt)){
        seen.add(item.prompt);
        base.push(item);
      } else if(item){
        item.prompt=`${item.prompt} (Set ${index+1})`;
        if(!seen.has(item.prompt)){seen.add(item.prompt);base.push(item);}
      }
      index++;
    }
    return base.slice(0,count);
  };
})();
