// scripts/updateAssistant.js
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function updateAssistant() {
  const assistantId = process.env.ASSISTANT_ID;
  const vectorStoreId = process.env.VECTOR_STORE_ID;

  if (!assistantId || !vectorStoreId) {
    console.error('❌ Missing ASSISTANT_ID or VECTOR_STORE_ID in environment variables.');
    process.exit(1);
  }

  try {
    const updated = await openai.beta.assistants.update(assistantId, {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStoreId],
        },
      },
    });

    console.log('✅ Assistant updated successfully!');
    console.log(`🧠 Linked vector store ID: ${vectorStoreId}`);
    console.log(`🤖 Assistant ID: ${assistantId}`);
  } catch (error) {
    console.error('❌ Failed to update assistant:');
    console.error(error.message || error);
  }
}

updateAssistant();