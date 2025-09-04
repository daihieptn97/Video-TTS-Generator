# Video TTS Generator

A tool to automatically generate speech from subtitle files and merge it with video files.

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

<a name="english"></a>
## English

### Description

This tool takes a video file and a subtitle file (.srt), generates speech from the subtitles using text-to-speech, and creates a new video with the generated speech as the audio track. It's particularly useful for creating voiced-over videos in Vietnamese from subtitle files.

### Features

- Automatic scanning of the current directory for video (.mp4) and subtitle (.srt) files
- Easy file selection from the available files
- Automatic voice selection (Vietnamese voice by default)
- Fast processing using Mac's built-in TTS capabilities
- Automatic cleanup of temporary files

### Prerequisites

To run this tool, you need:

1. Node.js installed on your Mac
2. ffmpeg installed (for audio and video processing)
3. Mac OS (uses the built-in `say` command for text-to-speech)

### Installing ffmpeg

**On macOS:**
```bash
# Using Homebrew
brew install ffmpeg

# Verify installation
ffmpeg -version
```

**On Windows:**
1. Download the prebuilt package from [ffmpeg.org](https://ffmpeg.org/download.html) or [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
2. Extract the zip file
3. Add the `bin` folder to your system PATH
4. Verify installation by opening Command Prompt and typing: `ffmpeg -version`

**On Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
ffmpeg -version
```

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/daihieptn97/Video-TTS-Generator.git
   cd Video-TTS-Generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Usage

1. Place your video (.mp4) and subtitle (.srt) files in the same directory as the script
2. Run the script:
   ```
   node index.js
   ```
3. Select the video file and subtitle file when prompted
4. If there are multiple Vietnamese voices available, select one
5. Wait for the process to complete

### How It Works

The script follows these steps:

1. **File Selection**: Scans the current directory for .mp4 and .srt files and prompts you to select one of each
2. **Subtitle Parsing**: Parses the .srt file to extract text and timing information
3. **Audio Generation**: Uses macOS's built-in `say` command to generate audio files for each subtitle line
4. **Audio Concatenation**: Combines all individual audio files into a single audio track
5. **Video Creation**: Merges the generated audio track with the original video
6. **Cleanup**: Removes all temporary files automatically

### Command Line Arguments

You can also run the script with command-line arguments:

```
node index.js input.mp4 input.srt output.mp4
```

Where:
- `input.mp4`: Path to the input video file
- `input.srt`: Path to the input subtitle file
- `output.mp4`: Path to the output video file

---

<a name="tiếng-việt"></a>
## Tiếng Việt

### Mô tả

Công cụ này nhận một file video và một file phụ đề (.srt), tạo ra giọng nói từ phụ đề bằng công nghệ text-to-speech, và tạo ra một video mới với âm thanh được tạo từ giọng nói. Đặc biệt hữu ích để tạo video có giọng đọc tiếng Việt từ file phụ đề.

### Tính năng

- Tự động quét thư mục hiện tại để tìm file video (.mp4) và file phụ đề (.srt)
- Dễ dàng lựa chọn file từ danh sách có sẵn
- Tự động chọn giọng đọc (mặc định là tiếng Việt)
- Xử lý nhanh chóng sử dụng khả năng TTS có sẵn của Mac
- Tự động dọn dẹp các file tạm

### Yêu cầu

Để chạy công cụ này, bạn cần:

1. Node.js được cài đặt trên Mac
2. ffmpeg được cài đặt (để xử lý âm thanh và video)
3. Mac OS (sử dụng lệnh `say` có sẵn để chuyển đổi văn bản thành giọng nói)

### Cài đặt ffmpeg

**Trên macOS:**
```bash
# Sử dụng Homebrew
brew install ffmpeg

# Kiểm tra cài đặt
ffmpeg -version
```

**Trên Windows:**
1. Tải gói đã biên dịch từ [ffmpeg.org](https://ffmpeg.org/download.html) hoặc [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
2. Giải nén tệp zip
3. Thêm thư mục `bin` vào biến PATH của hệ thống
4. Kiểm tra cài đặt bằng cách mở Command Prompt và gõ: `ffmpeg -version`

**Trên Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
ffmpeg -version
```

### Cài đặt

1. Clone repository này:
   ```
   git clone https://github.com/daihieptn97/Video-TTS-Generator.git
   cd Video-TTS-Generator
   ```

2. Cài đặt các gói phụ thuộc:
   ```
   npm install
   ```

### Cách sử dụng

1. Đặt file video (.mp4) và file phụ đề (.srt) vào cùng thư mục với script
2. Chạy script:
   ```
   node index.js
   ```
3. Chọn file video và file phụ đề khi được nhắc
4. Nếu có nhiều giọng tiếng Việt, chọn một giọng
5. Chờ quá trình hoàn tất

### Cách thức hoạt động

Script thực hiện các bước sau:

1. **Chọn file**: Quét thư mục hiện tại để tìm file .mp4 và .srt và yêu cầu bạn chọn một file cho mỗi loại
2. **Phân tích phụ đề**: Phân tích file .srt để trích xuất thông tin văn bản và thời gian
3. **Tạo âm thanh**: Sử dụng lệnh `say` có sẵn của macOS để tạo file âm thanh cho từng dòng phụ đề
4. **Ghép âm thanh**: Kết hợp tất cả các file âm thanh riêng lẻ thành một track âm thanh duy nhất
5. **Tạo video**: Ghép track âm thanh đã tạo với video gốc
6. **Dọn dẹp**: Tự động xóa tất cả các file tạm

### Tham số dòng lệnh

Bạn cũng có thể chạy script với các tham số dòng lệnh:

```
node index.js input.mp4 input.srt output.mp4
```

Trong đó:
- `input.mp4`: Đường dẫn đến file video đầu vào
- `input.srt`: Đường dẫn đến file phụ đề đầu vào
- `output.mp4`: Đường dẫn đến file video đầu ra
