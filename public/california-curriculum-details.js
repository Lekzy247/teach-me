(() => {
  const bank=window.TeachMeStandardsBank;
  if(!bank)return;
  const original=bank.generate.bind(bank);

  function detailFor(item,index){
    const difficulty=index%3===0?'Easy':index%3===1?'Medium':'Challenge';
    const dok=difficulty==='Easy'?1:difficulty==='Medium'?2:3;
    let hint=`Focus on the skill “${item.skill}” and eliminate choices that do not match the question.`;
    let explanation=`The correct response is “${item.options[item.correctIndex]}.” Review the question, identify the important information, and apply the ${item.skill.toLowerCase()} strategy.`;
    if(item.subject==='Mathematics'){
      hint='Write the known values, choose the correct operation, and estimate before calculating.';
      explanation=`Use the numbers in the problem and apply ${item.skill.toLowerCase()}. The correct answer is ${item.options[item.correctIndex]}. Check that the result is reasonable by estimating.`;
    }
    if(item.subject==='Language Arts'){
      hint='Reread the passage and look for the idea supported by more than one detail.';
      explanation=`The best answer is “${item.options[item.correctIndex]}” because it is supported by the main details in the passage, not just one small fact.`;
    }
    if(item.subject==='Science'){
      hint='Identify what changes, what stays the same, and which scientific idea explains the observation.';
      explanation=`The correct answer is “${item.options[item.correctIndex]}.” This choice best matches the evidence and the science concept ${item.skill.toLowerCase()}.`;
    }
    return {...item,difficulty,dok,estimatedSeconds:difficulty==='Easy'?90:difficulty==='Medium'?150:180,hint,explanation,teacherNote:`Use this item to check understanding of ${item.standard}. Ask the student to explain the reasoning, not only select an answer.`,commonMisconception:`Students may choose an answer based on one word or number without applying the full ${item.skill.toLowerCase()} concept.`};
  }

  bank.generate=function(grade='5',subject='Mathematics',count=20){
    return original(grade,subject,count).map(detailFor);
  };
})();
