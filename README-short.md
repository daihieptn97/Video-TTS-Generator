# Video TTS Generator

> Convert subtitles to speech and merge with video

## Setup

```bash
# Install dependencies
npm install
```

## Usage

```bash
# Interactive mode (select files from current directory)
node index.js

# Direct mode (specify files)
node index.js input.mp4 input.srt output.mp4
```

## Requirements

- Node.js
- ffmpeg
- macOS (uses the built-in `say` command)

## How it works

1. Scan and select video (.mp4) and subtitle (.srt) files
2. Parse subtitles into text segments
3. Generate speech audio for each subtitle using `say`
4. Combine all audio segments into a full soundtrack
5. Merge the generated audio with the video
6. Automatically clean up temporary files

---

# Trình tạo TTS cho Video

> Chuyển phụ đề thành giọng nói và ghép với video

## Cài đặt

```bash
# Cài đặt các gói phụ thuộc
npm install
```

## Cách sử dụng

```bash
# Chế độ tương tác (chọn file từ thư mục hiện tại)
node index.js

# Chế độ trực tiếp (chỉ định file)
node index.js input.mp4 input.srt output.mp4
```

## Yêu cầu

- Node.js
- ffmpeg
- macOS (sử dụng lệnh `say` có sẵn)

## Cách hoạt động

1. Quét và chọn file video (.mp4) và file phụ đề (.srt)
2. Phân tích phụ đề thành các đoạn văn bản
3. Tạo âm thanh giọng nói cho mỗi phụ đề bằng `say`
4. Kết hợp tất cả các đoạn âm thanh thành một soundtrack hoàn chỉnh
5. Ghép âm thanh đã tạo với video
6. Tự động dọn dẹp các file tạm
