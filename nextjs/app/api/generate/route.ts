import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generalSystemPrompt = `
You are an assistant that generates Manim code for animations. Please output code that follows these guidelines: 
1. Always use GenScene as the class name. 
2. Use self.play() for animations.
3. Only output the Python code, no explanations, and do not include code fences or markdown formatting.
`;

// Function to generate a random alphanumeric string
function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(request) {
  try {
    const { question } = await request.json();

    let code = '';
    let attempts = 0;
    const maxAttempts = 5;
    let success = false;

    while (attempts < maxAttempts && !success) {
      attempts += 1;

      console.log(`\nAttempt ${attempts}: Generating code...`);
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: generalSystemPrompt },
          { role: 'user', content: question },
        ],
      });

      code = response.choices[0]?.message?.content || '';

      // Remove code fences if present
      code = code.replace(/```[^\n]*\n/g, '').replace(/```/g, '');

      console.log(`Generated code:\n${code}\n`);

      // Generate a random string for filenames
      const uniqueId = generateRandomString(8);

      // Create the videos directory if it doesn't exist
      const videosDir = path.join(process.cwd(), 'videos');
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir);
      }

      // Write the code to a temporary Python file
      const tempPythonFile = path.join(videosDir, `temp_${uniqueId}.py`);
      fs.writeFileSync(tempPythonFile, code);
      console.log(`Temporary Python file created at: ${tempPythonFile}`);

      // Try to run a syntax check on the code
      const syntaxCheck = await new Promise((resolve) => {
        exec(`python3 -m py_compile ${tempPythonFile}`, (error) => {
          if (error) {
            console.error(`Syntax error in generated code on attempt ${attempts}: ${error.message}`);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      if (!syntaxCheck) {
        console.log(`Attempt ${attempts}: Generated code has syntax errors.`);
        fs.unlinkSync(tempPythonFile);
        continue;
      }

      // Run the Manim code
      const outputDir = path.join(videosDir, `manim_output_${uniqueId}`);
      // Ensure the output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      // The output video filename
      const outputFileName = `output_${uniqueId}.mp4`;

      // The Manim command
      const command = `manim ${tempPythonFile} GenScene -o ${outputFileName} --format mp4 --media_dir ${outputDir}`;

      console.log(`Executing Manim command:\n${command}\n`);

      // Declare variables to store stdout and stderr
      let manimStdout = '';
      let manimStderr = '';

      const manimSuccess = await new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
          manimStdout = stdout;
          manimStderr = stderr;

          console.log(`Manim stdout:\n${stdout}\n`);
          console.error(`Manim stderr:\n${stderr}\n`);

          if (error) {
            console.error(`Error executing Manim on attempt ${attempts}: ${error.message}`);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      // The output video path
      let outputVideoPath = '';

      if (manimSuccess) {
        // Try to parse the output video path from Manim's output
        const match = manimStdout.match(/File ready at\s+(.*\.mp4)/);
        if (match && match[1]) {
          outputVideoPath = match[1].trim();
          console.log(`Parsed output video path: ${outputVideoPath}`);
        } else {
          // If unable to parse, construct the expected path
          outputVideoPath = path.join(
            outputDir,
            'videos',
            `temp_${uniqueId}`,
            '1080p60',
            outputFileName
          );
          console.log(`Expected output video path: ${outputVideoPath}`);
        }

        if (fs.existsSync(outputVideoPath)) {
          console.log(`Video file successfully generated at: ${outputVideoPath}`);
          success = true;

          // Clean up the temporary Python file
          fs.unlinkSync(tempPythonFile);

          // Return the path of the generated video
          return NextResponse.json({ videoPath: outputVideoPath });
        } else {
          console.error(`Video file not found at: ${outputVideoPath}`);
          fs.unlinkSync(tempPythonFile);
        }
      } else {
        console.error(`Attempt ${attempts}: Manim failed to generate the video.`);
        fs.unlinkSync(tempPythonFile);
      }
    }

    throw new Error('Failed to generate video after multiple attempts.');
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
