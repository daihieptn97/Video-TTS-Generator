const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const SrtParser = require("srt-parser-2").default;
const readline = require("readline");

// -------- Helper --------
function run(cmd) {
  console.log("👉", cmd);
  execSync(cmd, { stdio: "inherit" });
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

// -------- Main --------
async function main() {
  let inputVideo, inputSrt, outputVideo;
  const args = process.argv.slice(2);
  
  if (args.length === 3) {
    // If arguments are provided, use them directly
    [inputVideo, inputSrt, outputVideo] = args;
  } else {
    // Scan directory for MP4 and SRT files
    const files = fs.readdirSync(".");
    const videoFiles = files.filter(file => path.extname(file).toLowerCase() === ".mp4");
    const srtFiles = files.filter(file => path.extname(file).toLowerCase() === ".srt");
    
    console.log("\n📁 Found video files:");
    videoFiles.forEach((file, i) => {
      console.log(`${i + 1}. ${file}`);
    });
    
    console.log("\n📝 Found subtitle files:");
    srtFiles.forEach((file, i) => {
      console.log(`${i + 1}. ${file}`);
    });
    
    if (videoFiles.length === 0) {
      console.error("❌ No MP4 files found in the current directory.");
      process.exit(1);
    }
    
    if (srtFiles.length === 0) {
      console.error("❌ No SRT files found in the current directory.");
      process.exit(1);
    }
    
    // Ask user to select files
    const videoIndex = parseInt(await askQuestion("\n📺 Select video file (enter number): ")) - 1;
    if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= videoFiles.length) {
      console.error("❌ Invalid selection");
      process.exit(1);
    }
    
    const srtIndex = parseInt(await askQuestion("🗒️ Select subtitle file (enter number): ")) - 1;
    if (isNaN(srtIndex) || srtIndex < 0 || srtIndex >= srtFiles.length) {
      console.error("❌ Invalid selection");
      process.exit(1);
    }
    
    inputVideo = videoFiles[videoIndex];
    inputSrt = srtFiles[srtIndex];
    
    // Generate output filename
    const videoBaseName = path.basename(inputVideo, path.extname(inputVideo));
    outputVideo = `${videoBaseName}_tts.mp4`;
    
    console.log(`\n✅ Selected:\n- Video: ${inputVideo}\n- Subtitles: ${inputSrt}\n- Output: ${outputVideo}\n`);
  }

  if (!fs.existsSync(inputVideo)) {
    console.error("❌ Video file not found:", inputVideo);
    process.exit(1);
  }
  if (!fs.existsSync(inputSrt)) {
    console.error("❌ Subtitle file not found:", inputSrt);
    process.exit(1);
  }
  
  // Skip confirmation and proceed directly
  console.log("▶️ Processing started...");

  // 1. Parse subtitles
  const parser = new SrtParser();
  const srtContent = fs.readFileSync(inputSrt, "utf8");
  const subtitles = parser.fromSrt(srtContent);

  // Temp folder
  const tmpDir = "tts_tmp";
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  // Get available voices
  const getVoices = () => {
    try {
      const voicesOutput = execSync('say -v "?"', { encoding: 'utf8' });
      return voicesOutput.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => {
          const match = line.match(/^([^\s]+)\s+([^\s]+)\s+(.+)$/);
          if (match) {
            return { name: match[1], language: match[2], description: match[3].trim() };
          }
          return null;
        })
        .filter(voice => voice !== null);
    } catch (error) {
      console.error("Failed to get voices:", error);
      return [];
    }
  };

  // Always use Vietnamese (vi_VN) voice
  let voiceName = "Linh"; // default Vietnamese voice
  
  if (args.length !== 3) {
    const voices = getVoices();
    
    // Find Vietnamese voices
    const vietnameseVoices = voices.filter(voice => voice.language === "vi_VN");
    
    if (vietnameseVoices.length > 0) {
      // If there are multiple Vietnamese voices, let user select
      if (vietnameseVoices.length > 1) {
        console.log("\n🎤 Available Vietnamese voices:");
        vietnameseVoices.forEach((voice, i) => {
          console.log(`${i + 1}. ${voice.name} - ${voice.description}`);
        });
        
        const voiceIndex = parseInt(await askQuestion("\nSelect voice (enter number): ")) - 1;
        if (!(isNaN(voiceIndex) || voiceIndex < 0 || voiceIndex >= vietnameseVoices.length)) {
          voiceName = vietnameseVoices[voiceIndex].name;
        }
      } else {
        // If only one Vietnamese voice, use it
        voiceName = vietnameseVoices[0].name;
      }
    } else {
      console.log("❌ No Vietnamese voices found, using default voice: " + voiceName);
    }
    
    console.log(`\n✅ Using voice: ${voiceName}\n`);
  }
  
  // 2. Generate audio with `say`
  subtitles.forEach((sub, i) => {
    const text = sub.text.replace(/\r?\n/g, " "); // remove line breaks
    const filename = path.join(tmpDir, `tts_${i}.aiff`);
    if (text.trim().length > 0) {
      run(`say -v "${voiceName}" "${text}" -o "${filename}"`);
    } else {
      // nếu line trống thì tạo silent audio
      run(`ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 0.5 -q:a 9 -acodec pcm_s16le "${filename}"`);
    }
  });

  // 3. Concat audio files
  const listFile = path.join(tmpDir, "list.txt");
  const listContent = subtitles
    .map((_, i) => `file '${path.resolve(tmpDir, `tts_${i}.aiff`)}'`)
    .join("\n");
  fs.writeFileSync(listFile, listContent);

  const ttsAudio = "tts_full.wav";
  // Convert from AIFF to WAV instead of direct copy
  run(`ffmpeg -f concat -safe 0 -i "${listFile}" -c:a pcm_s16le "${ttsAudio}"`);

  // 4. Merge audio + video
  // (thay thế audio gốc)
  run(
    `ffmpeg -i "${inputVideo}" -i "${ttsAudio}" -map 0:v -map 1:a -c:v copy -shortest "${outputVideo}"`
  );

  // Always clean up temp files
  console.log("🧹 Cleaning up temporary files...");
  try {
    fs.unlinkSync(ttsAudio);
    fs.unlinkSync(listFile);
    
    // Remove all files in temp directory
    const tempFiles = fs.readdirSync(tmpDir);
    tempFiles.forEach(file => {
      fs.unlinkSync(path.join(tmpDir, file));
    });
    
    // Remove temp directory
    fs.rmdirSync(tmpDir);
    console.log("✅ Temporary files removed");
  } catch (error) {
    console.error("❌ Error cleaning up:", error);
  }

  console.log("🎬 Done! Output video:", outputVideo);
}

main();
