/* eslint-disable */
/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-08 19:54:02
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-04 17:14:51
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/EFCSegNet/CSharpDemo.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { FormattedMessage } from '@umijs/max';
import { Tabs } from 'antd';
import React from 'react';
import DisplayCode from '../DisplayCode';
import DisplayMarkdown from '../DisplayMarkdown';

const markdown = `# EFC SegNet 實例分割模型 .NET 整合

此專案展示如何在自訂的 C# 應用程式中整合 EFC SegNet 實例分割模型。應用程式使用 \`EFC_SEGNET_runtime.dll\` 來執行 EFC SegNet 模型進行圖像實例分割。

## 先決條件

在執行此專案之前，需要確保以下設定：

### 必要條件
- **NuGet 套件**：
  - [System.Drawing.Common](https://www.nuget.org/packages/System.Drawing.Common/)
  - [System.Runtime.InteropServices](https://www.nuget.org/packages/System.Runtime.InteropServices/)

\`\`\`bash
dotnet add package System.Drawing.Common
dotnet add package System.Runtime.InteropServices
\`\`\`

### EFC_SEGNET_runtime.dll 依賴項
\`EFC_SEGNET_runtime.dll\` 依賴多個動態連結庫 (DLL) 才能正確運行，這些 DLL 應存放於專案目錄的 \`bin\\x64\\Release\` 資料夾中。請確保所有依賴項 DLL 都放置於此資料夾。

### 模型文件
您需要提供經過訓練的 EFC SegNet 模型，在程式碼中正確設置該模型的路徑，更新 \`Config\` 結構中的 \`modelPath\`。

\`\`\`csharp
modelPath = "/path/to/model.ts";
\`\`\`

確保該路徑指向實際的 EFC SegNet 模型文件。

### 日誌目錄
應用程式會將處理過程記錄在由 \`logDir\`、\`logFilename\` 和 \`logLevel\` 定義的日誌文件中。根據您的日誌需求更新這些值。

\`\`\`csharp
logDir = "/path/to/log/"; // 注意最後一個 \`/\` 必須加上
logFilename = "segnet_log.txt";
logLevel = "info";
\`\`\`

### 使用方式

1. 將 \`EFC_SEGNET_runtime.dll\` 放置在正確的目錄中。
2. 更新程式碼中的 \`modelPath\`、\`logDir\`、\`logFilename\`。
3. 將輸入圖像放置於 \`Main\` 函數中定義的路徑中。

\`\`\`csharp
string imageFile = "/path/to/input.jpg";
\`\`\`

4. 執行應用程式，檢測結果將會在主控台中列印，並且在指定的輸出文件中保存分割結果。

\`\`\`csharp
string outputFile = "/path/to/output.png";
\`\`\`

5. 輸出結果將包含圖像上的實例分割，包含檢測框、掩膜和檢測分數。

### 注意事項
- 請確保所有路徎都指向正確的位置，以便 DLL 和模型文件能夠被正確加載。
- 需要正確設置輸入圖像的路徑，並確認圖像格式支持（例如 JPEG、PNG 等）。
- 此程式會將檢測結果直接可視化於輸出圖像中，請根據需要進行調整。

希望這些指引能夠幫助您順利整合 EFC SegNet 實例分割模型！`;

const codeString = `using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using System.Linq;

class Program
{
    // Define Config struct for Model
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
    public struct Config
    {
        public float confThreshold;  // 檢測置信度閾值 (Detection confidence threshold)
        public float nmsThreshold;   // 非極大值抑制閾值 (Non-maximum suppression threshold)
        public int inpShort;         // 輸入圖像最短邊長度 (Input image min length)
        public int channel;          // 圖像通道數 (默認為 3) (Image channels, default is 3)
        [MarshalAs(UnmanagedType.LPStr)]
        public string modelPath;     // 模型路徑 (Path to model)
        [MarshalAs(UnmanagedType.LPStr)]
        public string logDir;        // 日誌文件夾 (Log directory)
        [MarshalAs(UnmanagedType.LPStr)]
        public string logFilename;   // 日誌文件名 (Log filename)
        [MarshalAs(UnmanagedType.LPStr)]
        public string logLevel;      // 日誌等級 (建議設置為 "info") (Log level, recommend "info")
    }

    // Define Detection struct
    [StructLayout(LayoutKind.Sequential)]
    public struct Detection
    {
        public float confidence;    // 置信度 (Confidence)
        public int classId;         // 類別 ID (Class ID)
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 4)]
        public int[] box;           // 檢測框 (x, y, 寬度, 高度) (Bounding box, x, y, width, height)
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 28 * 28)]
        public int[] mask;          // 掩膜 (固定大小，需要根據框縮放) (Mask, fixed size, need to be scaled)
    }

    // Import functions from SegNet DLL
    [DllImport("EFC_SEGNET_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern IntPtr CreateModel(Config config);

    [DllImport("EFC_SEGNET_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void DestroyModel(IntPtr model);

    [DllImport("EFC_SEGNET_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void Detect(IntPtr model, IntPtr imageData, int dataLength);

    [DllImport("EFC_SEGNET_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void GetDetections(IntPtr model, IntPtr detections, ref int numDetections);

    static void Main(string[] args)
    {
        Config config = new Config
        {
            confThreshold = 0.2f,
            nmsThreshold = 0.4f,
            inpShort = 800,
            channel = 3,
            modelPath = "/path/to/model.ts",  // 模型路徑 (Path to model)
            logDir = "/path/to/log/",               // 日誌文件夾 (Log directory)
            logFilename = "segnet.txt",      // 日誌文件名 (Log filename)
            logLevel = "info"                 // 日誌等級 (Log level)
        };

        IntPtr model = CreateModel(config);

        try
        {
            string imageFile = "/path/to/input.jpg";        // 圖像文件路徑 (Image file path)
            string outputFile = "/path/to/output.png";      // 輸出文件路徑 (Output file path)

            byte[] imageData = File.ReadAllBytes(imageFile);
            IntPtr unmanagedImageData = Marshal.AllocHGlobal(imageData.Length);
            Marshal.Copy(imageData, 0, unmanagedImageData, imageData.Length);

            Detect(model, unmanagedImageData, imageData.Length);

            int maxNumDetections = 100;
            int realNumDetections = 0;
            Detection[] detections = new Detection[maxNumDetections];
            IntPtr unmanagedDetections = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(Detection)) * maxNumDetections);

            GetDetections(model, unmanagedDetections, ref realNumDetections);

            List<Rectangle> bboxes = new List<Rectangle>();
            List<List<Point>> masks = new List<List<Point>>();
            List<float> scores = new List<float>();

            for (int i = 0; i < realNumDetections; i++)
            {
                IntPtr detectionPtr = new IntPtr(unmanagedDetections.ToInt64() + i * Marshal.SizeOf(typeof(Detection)));
                Detection detection = Marshal.PtrToStructure<Detection>(detectionPtr);

                bboxes.Add(new Rectangle(detection.box[0], detection.box[1], detection.box[2], detection.box[3]));
                scores.Add(detection.confidence);

                // Rescale mask to bounding box size
                int newWidth = detection.box[2];
                int newHeight = detection.box[3];
                int[] maskArray = detection.mask;
                Bitmap maskBitmap = new Bitmap(28, 28, PixelFormat.Format8bppIndexed);

                for (int y = 0; y < 28; y++)
                {
                    for (int x = 0; x < 28; x++)
                    {
                        int value = maskArray[y * 28 + x] > 0 ? 255 : 0;
                        maskBitmap.SetPixel(x, y, Color.FromArgb(value, value, value));
                    }
                }

                Bitmap resizedMask = new Bitmap(maskBitmap, new Size(newWidth, newHeight));
                List<Point> contours = FindContours(resizedMask, detection.box[0], detection.box[1]);
                masks.Add(contours);
            }

            Visualize(imageFile, outputFile, bboxes, masks, scores);
        }
        finally
        {
            DestroyModel(model);
        }
    }

    // Find contours from the mask image
    static List<Point> FindContours(Bitmap mask, int xShift, int yShift)
    {
        List<Point> contourPoints = new List<Point>();
        for (int y = 0; y < mask.Height; y++)
        {
            for (int x = 0; x < mask.Width; x++)
            {
                if (mask.GetPixel(x, y).R > 0)
                {
                    contourPoints.Add(new Point(x + xShift, y + yShift));
                }
            }
        }
        return contourPoints;
    }

    // Visualize detection results
    static void Visualize(string imageFile, string outputFile, List<Rectangle> bboxes, List<List<Point>> masks, List<float> scores)
    {
        Bitmap image = new Bitmap(imageFile);
        Graphics graphics = Graphics.FromImage(image);

        for (int i = 0; i < bboxes.Count; i++)
        {
            Rectangle bbox = bboxes[i];
            List<Point> mask = masks[i];
            float score = scores[i];

            // Draw bounding box
            Pen pen = new Pen(Color.Red, 3);
            graphics.DrawRectangle(pen, bbox);

            // Draw mask
            Brush brush = new SolidBrush(Color.FromArgb(100, Color.Green));
            graphics.FillPolygon(brush, mask.ToArray());

            // Draw confidence score
            graphics.DrawString(score.ToString("F2"), new Font("Arial", 16), Brushes.Blue, bbox.Location);
        }

        image.Save(outputFile, ImageFormat.Png);
    }
}`;

const CSharpDemo: React.FC = () => {
  return (
    <Tabs
      items={[
        {
          label: (
            <FormattedMessage
              id="pages.exportModel.tutorial.documentation"
              defaultMessage="部署說明文檔"
            />
          ),
          key: '0',
          children: <DisplayMarkdown>{markdown}</DisplayMarkdown>,
        },
        {
          label: (
            <FormattedMessage
              id="pages.exportModel.tutorial.demoCode"
              defaultMessage="示範程式碼"
            />
          ),
          key: '1',
          children: <DisplayCode codeString={codeString} />,
        },
      ]}
    ></Tabs>
  );
};

export default CSharpDemo;
