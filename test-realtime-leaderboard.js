const fetch = require('node-fetch');

async function testQuizAndLeaderboard() {
  const userId = 'cac7caff-6f69-483f-a39d-50abbf8f54ac'; // Sandhya RJ

  console.log('\n📊 === REAL-TIME LEADERBOARD UPDATE TEST ===\n');

  // 1. Check leaderboard BEFORE
  console.log('1️⃣ Fetching leaderboard BEFORE quiz...');
  const beforeResponse = await fetch('http://localhost:5000/api/leaderboard/top-learners');
  const beforeData = await beforeResponse.json();
  const sandhyaBefore = beforeData.data.find(u => u.userId === userId);
  console.log(`   Sandhya RJ: ${sandhyaBefore?.totalPoints || 0} points\n`);

  // 2. Submit quiz
  console.log('2️⃣ Submitting quiz (score: 8/10)...');
  const quizResponse = await fetch('http://localhost:5000/quiz/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: userId,
      quizId: 'quiz-js-fundamentals',
      score: 8,
      totalQuestions: 10
    })
  });
  const quizData = await quizResponse.json();
  console.log(`   ✅ Quiz submitted! Points awarded: ${quizData.pointsAwarded}\n`);

  // 3. Wait 500ms and check leaderboard AFTER
  console.log('3️⃣ Waiting 500ms, then fetching leaderboard AFTER...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const afterResponse = await fetch('http://localhost:5000/api/leaderboard/top-learners');
  const afterData = await afterResponse.json();
  const sandhyaAfter = afterData.data.find(u => u.userId === userId);
  console.log(`   Sandhya RJ: ${sandhyaAfter?.totalPoints || 0} points\n`);

  // 4. Show results
  const pointsGained = (sandhyaAfter?.totalPoints || 0) - (sandhyaBefore?.totalPoints || 0);
  console.log('📈 RESULTS:');
  console.log(`   Points BEFORE: ${sandhyaBefore?.totalPoints || 0}`);
  console.log(`   Points ADDED:  +${quizData.pointsAwarded}`);
  console.log(`   Points AFTER:  ${sandhyaAfter?.totalPoints || 0}`);
  console.log(`   Change:        ${pointsGained > 0 ? '✅' : '❌'} +${pointsGained}\n`);

  if (pointsGained === quizData.pointsAwarded) {
    console.log('🎉 SUCCESS! Leaderboard updated correctly!\n');
  } else {
    console.log('⚠️ WARNING: Points mismatch detected\n');
  }
}

testQuizAndLeaderboard().catch(console.error);
