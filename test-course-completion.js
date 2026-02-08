const fetch = require('node-fetch');

async function testCourseCompletion() {
  const userId = 'cac7caff-6f69-483f-a39d-50abbf8f54ac'; // Sandhya RJ
  const courseId = 'course-react-essentials'; // React Essentials course

  console.log('\n🎓 === COURSE COMPLETION TEST ===\n');

  try {
    console.log('1️⃣ Completing course...');
    console.log(`   User: Sandhya RJ`);
    console.log(`   Course: React Essentials\n`);

    const response = await fetch('http://localhost:5000/course/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        courseId: courseId
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ SUCCESS!');
      console.log(`   Course: ${data.data.courseTitle}`);
      console.log(`   Points Awarded: ${data.data.pointsAwarded}`);
      console.log(`   Completed At: ${new Date(data.data.completedAt).toLocaleString()}`);
      console.log(`   Instructor Notified: ${data.data.instructorNotified ? 'YES ✅' : 'NO ❌'}`);
      console.log(`   Instructor: ${data.data.instructorName}\n`);
      
      // Check if instructor event was created
      console.log('2️⃣ Checking instructor events...');
      const eventsResponse = await fetch('http://localhost:5000/api/events/instructor?instructorId=30daa450-de2f-4089-952f-5162926a6b58&limit=5');
      const eventsData = await eventsResponse.json();
      
      const completionEvent = eventsData.data?.find(e => e.type === 'COURSE_COMPLETED');
      if (completionEvent) {
        const metadata = JSON.parse(completionEvent.metadata);
        console.log('   ✅ Instructor received notification!');
        console.log(`   Event Type: ${completionEvent.type}`);
        console.log(`   Learner: ${metadata.learnerName}`);
        console.log(`   Course: ${metadata.courseTitle}`);
        console.log(`   Points: ${metadata.pointsAwarded}\n`);
      } else {
        console.log('   ⚠️ No completion event found yet\n');
      }
      
      console.log('🎉 Course completion feature working!\n');
    } else {
      console.log('❌ FAILED:', data.error);
      console.log('   Details:', data.details || 'No details');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testCourseCompletion().catch(console.error);
