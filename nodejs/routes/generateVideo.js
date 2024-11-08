// backend/routes/generateVideo.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const OpenAI = require('openai');
const Cerebras = require('@cerebras/cerebras_cloud_sdk');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cerebras = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });

const generalSystemPrompt = `
You are an assistant that generates Manim code for animations. Follow these guidelines:
1. Use GenScene as the class name.
2. Use self.play() for animations.
3. Only output Python code, no explanations, and exclude code fences.
4. Include 'from manim import *' at the top.
`;

function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    let code = '';
    let attempts = 0;
    const maxAttempts = 5;
    let success = false;

    while (attempts < maxAttempts && !success) {
      attempts += 1;

      console.log(`\nAttempt ${attempts}: Generating code...`);
      const response = await cerebras.chat.completions.create({
        model: "llama3.1-70b",
        messages: [
          { role: 'system', content: generalSystemPrompt },
          { role: 'user', content: question },
        ],
      });

      code = response.choices[0]?.message?.content || '';
      code = code.replace(/```[^\n]*\n/g, '').replace(/```/g, '');

      const uniqueId = generateRandomString(8);
      const videosDir = path.join(__dirname, '..', 'public', 'videos');
      if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);

      const tempPythonFile = path.join(videosDir, `temp_${uniqueId}.py`);
      fs.writeFileSync(tempPythonFile, code);
      console.log(`Temporary Python file created at: ${tempPythonFile}`);

      const syntaxCheck = await new Promise((resolve) => {
        exec(`python3 -m py_compile ${tempPythonFile}`, (error) => resolve(!error));
      });

      if (!syntaxCheck) {
        fs.unlinkSync(tempPythonFile);
        continue;
      }

      const outputDir = path.join(videosDir, `manim_output_${uniqueId}`);
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

      const outputFileName = `output_${uniqueId}.mp4`;
      const command = `manim ${tempPythonFile} GenScene -o ${outputFileName} --format mp4 --media_dir ${outputDir}`;
      console.log(`Executing Manim command:\n${command}\n`);

      const manimSuccess = await new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Manim Error: ${error.message}`);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      if (manimSuccess) {
        fs.unlinkSync(tempPythonFile);
        success = true;
        return res.json({ videoUrl: `public/videos/manim_output_${uniqueId}/videos/temp_${uniqueId}/1080p60/output_${uniqueId}.mp4` });
      } else {
        fs.unlinkSync(tempPythonFile);
      }
    }

    throw new Error('Failed to generate video after multiple attempts.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

module.exports = router;