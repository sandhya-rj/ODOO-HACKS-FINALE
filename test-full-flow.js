const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: data ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      } : {}
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          resolve(responseData);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testFullFlow() {
  console.log('='.repeat(60));
  console.log('QUIZ SUBMISSION FULL FLOW TEST');
  console.log('='.repeat(60));
  
  const userId = 'cac7caff-6f69-483f-a39d-50abbf8f54ac'; // Emma Wilson
  
  // 1. Check leaderboard BEFORE
  console.log('\n1️⃣ Checking leaderboard BEFORE quiz submission...');
  const leaderboardBefore = await makeRequest('/api/leaderboard/top-learners');
  const leaderboardData = leaderboardBefore.data || leaderboardBefore.leaderboard || leaderboardBefore;
  const emmaBefore = Array.isArray(leaderboardData) ? leaderboardData.find(u => u.userId === userId) : null;
  console.log(`   Emma Wilson points BEFORE: ${emmaBefore?.totalPoints || 'Not in top 5'}`);
  
  // 2. Submit quiz
  console.log('\n2️⃣ Submitting quiz...');
  const quizData = JSON.stringify({
    userId,
    quizId: 'quiz-js-fundamentals',
    score: 9,
    totalQuestions: 10
  });
  
  const submitResult = await makeRequest('/quiz/submit', 'POST', quizData);
  console.log(`   ✅ Quiz submitted successfully!`);
  console.log(`   - Attempt ID: ${submitResult.attemptId}`);
  console.log(`   - Points Awarded: ${submitResult.pointsAwarded}`);
  console.log(`   - Attempt Number: ${submitResult.attemptNumber}`);
  if (submitResult.alert) {
    console.log(`   ⚠️ Alert: ${submitResult.alert.type} - ${submitResult.alert.message}`);
  }
  
  // 3. Check leaderboard AFTER
  console.log('\n3️⃣ Checking leaderboard AFTER quiz submission...');
  const leaderboardResponseAfter = await makeRequest('/api/leaderboard/top-learners');
  const leaderboardDataAfter = leaderboardResponseAfter.data || leaderboardResponseAfter.leaderboard || leaderboardResponseAfter;
  const emmaAfter = Array.isArray(leaderboardDataAfter) ? leaderboardDataAfter.find(u => u.userId === userId) : null;
  console.log(`   Emma Wilson points AFTER: ${emmaAfter?.totalPoints || 'Not in top 5'}`);
  if (emmaBefore && emmaAfter) {
    console.log(`   Points gained: ${(emmaAfter?.totalPoints || 0) - (emmaBefore?.totalPoints || 0)}`);
  }
  
  // 4. Check events
  console.log('\n4️⃣ Checking recent events...');
  const eventsResponse = await makeRequest(`/api/events?userId=${userId}&limit=3`);
  const events = eventsResponse.data || eventsResponse.events || eventsResponse;
  const quizEvents = Array.isArray(events) ? events.filter(e => e.type === 'QUIZ_SUBMITTED') : [];
  console.log(`   Found ${quizEvents.length} quiz submission events`);
  if (quizEvents[0]) {
    const metadata = JSON.parse(quizEvents[0].metadata);
    console.log(`   Latest: ${metadata.quizTitle} - ${metadata.percentage}% (${metadata.pointsAwarded} pts)`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ FULL FLOW TEST COMPLETE');
  console.log('='.repeat(60));
}

testFullFlow().catch(console.error);
