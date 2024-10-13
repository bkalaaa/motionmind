const fs = require('fs');
const OpenAI = require('openai');
//run this file to fine-tune the model type this: node fine-tune.js


const openai = new OpenAI({
  apiKey: "sk-<YOUR_API"
});
// Step 1: Upload the training file
async function uploadTrainingFile() {
  try {
    const response = await openai.files.create({
      file: fs.createReadStream('dataset/hugfacedata.jsonl'),
      purpose: 'fine-tune',
    });
    console.log('File uploaded:', response);
    return response.id; // Return the file ID
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Step 1b: Wait for the file to be processed
async function waitForFileProcessing(fileId) {
  try {
    let file;
    do {
      file = await openai.files.retrieve(fileId);
      console.log('File status:', file.status);
      if (file.status === 'processed') {
        console.log('File processing complete.');
        return;
      } else if (file.status === 'error') {
        throw new Error('File processing failed.');
      }
      // Wait before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    } while (true);
  } catch (error) {
    console.error('Error checking file status:', error);
    throw error;
  }
}

// Step 2: Create a fine-tuning job
async function createFineTuneJob(trainingFileId) {
  try {
    const fineTune = await openai.fineTuning.jobs.create({
      training_file: trainingFileId,
      model: 'gpt-3.5-turbo-0125', // Specify the model you want to fine-tune
      hyperparameters: {
        n_epochs: 3,
        batch_size: 16,
        learning_rate_multiplier: 0.1,
        }
    });
    console.log('Fine-tuning job created:', fineTune);

    return fineTune.id; // Return the job ID
  } catch (error) {
    console.error('Error creating fine-tune job:', error);
    throw error;
  }
}

// Step 3: Monitor the fine-tuning job status
async function monitorFineTuneJob(jobId) {
  try {
    let status;
    do {
      const job = await openai.fineTuning.jobs.retrieve(jobId);
      status = job.status;
      console.log('Fine-tuning job status:', status);
      // List 10 fine-tuning jobs
      let page = await openai.fineTuning.jobs.list({ limit: 5 });
      console.log('Listing 10 fine-tuning jobs:', page);
      if (status === 'succeeded') {
        console.log('Fine-tuning completed successfully.');
        console.log('Fine-tuned model:', job.fine_tuned_model);
        return job.fine_tuned_model;
      } else if (status === 'failed') {
        throw new Error('Fine-tuning job failed.');
      }
      // Wait before checking again
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 60 seconds
    } while (true);
  } catch (error) {
    console.error('Error monitoring fine-tune job:', error);
    throw error;
  }
}

// Main function to orchestrate the fine-tuning process
async function main() {
  try {
    // Step 1: Upload the training file
    const trainingFileId = await uploadTrainingFile();

    // Step 1b: Wait for the file to be processed
    await waitForFileProcessing(trainingFileId);

    // Step 2: Create the fine-tuning job
    const jobId = await createFineTuneJob(trainingFileId);

    // Step 3: Monitor the fine-tuning job until completion
    const fineTunedModel = await monitorFineTuneJob(jobId);

    // Use the fine-tuned model as needed
    console.log('You can now use the fine-tuned model:', fineTunedModel);
  } catch (error) {
    console.error('An error occurred during the fine-tuning process:', error);
  }
}

main();