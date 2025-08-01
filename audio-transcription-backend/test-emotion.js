require('dotenv').config();
const emotionAnalysisService = require('./services/emotionAnalysisService');

/**
 * Test script for emotion analysis functionality
 */
async function testEmotionAnalysis() {
    console.log('🧪 Testing Emotion Analysis Service...\n');

    // Test cases with different emotions and tones
    const testCases = [
        {
            text: "اے اے ! نہیں ! کیا کر کھار ہے",
            description: "Urdu text with exclamation marks"
        },
        {
            text: "I'm so excited about this new project! It's going to be amazing!",
            description: "English text with positive emotion"
        },
        {
            text: "I'm really sad and disappointed about what happened today.",
            description: "English text with negative emotion"
        },
        {
            text: "This is a very serious matter that needs immediate attention.",
            description: "English text with serious tone"
        }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`📝 Test ${i + 1}: ${testCase.description}`);
        console.log(`Text: "${testCase.text}"`);
        
        try {
            const result = await emotionAnalysisService.analyzeEmotionAndTone(testCase.text);
            console.log(`✅ Result:`);
            console.log(`   Emotion: ${result.emotion}`);
            console.log(`   Tone: ${result.tone}`);
            console.log(`   Reason: ${result.reason}`);
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log(''); // Empty line for readability
    }

    console.log('🎉 Emotion analysis test completed!');
}

// Run the test if this file is executed directly
if (require.main === module) {
    testEmotionAnalysis().catch(console.error);
}

module.exports = { testEmotionAnalysis }; 