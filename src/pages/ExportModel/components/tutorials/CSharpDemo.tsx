/* eslint-disable */
/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-08 19:54:02
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-09-16 09:29:50
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/CSharpDemo.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { Tabs } from 'antd';
import React from 'react';
import DisplayCode from './DisplayCode';
import DisplayMarkdown from './DisplayMarkdown';

const markdown = `
# EFC DetNet 目標檢測模型 .NET 整合

此專案展示如何在自訂的 C# 應用程式中整合 EFC DetNet 檢測。應用程式使用 \`EFC_DETNET_runtime.dll\` 來執行 EFC DetNet 模型進行圖像物件檢測。

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

### EFC_DETNET_runtime.dll 依賴項
\`EFC_DETNET_runtime.dll\` 依賴多個動態連結庫 (DLL) 才能正確運行，這些 DLL 應存放於專案目錄的 \`bin\\x64\\Release\` 資料夾中。請確保所有依賴項 DLL 都放置於此資料夾

### 模型文件
您需要提供經過訓練的 EFC DetNet 模型，在程式碼中正確設置該模型的路徑，更新 \`Config\` 結構中的 \`modelPath\`。

\`\`\`csharp
modelPath = "/your/path/to/model";
\`\`\`

確保該路徑指向實際的 EFC DetNet 模型文件。

### 日誌目錄
應用程式會將處理過程記錄在由 \`logDir\`、\`logFilename\` 和 \`logLevel\` 定義的日誌文件中。根據您的日誌需求更新這些值。

\`\`\`csharp
logDir = "/path/to/save/log/files/"; # 注意最後一個 \`/\` 必須加上
logFilename = "EFC_DETNET_log.txt";
logLevel = "info";
\`\`\`

### 使用方式

2. 將 \`EFC_DETNET_runtime.dll\` 放置在正確的目錄中。
3. 更新程式碼中的 \`modelPath\`、\`logDir\`、\`logFilename\`。
4. 將輸入圖像放置於 \`Main\` 函數中定義的路徑中。  

\`\`\`csharp
Bitmap bitmap = new Bitmap("/path/to/image.jpg");
\`\`\`  

5. 執行應用程式，檢測結果將會在主控台中列印。
`;

const codeString = `using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

class Program
{
    // Define Config struct
    // 定義 Config 結構體，用於配置 EFC DetNet 的參數
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
    public struct Config
    {
        public float confThreshold;  // Detection confidence threshold
                                     // 檢測置信度閾值
        public float nmsThreshold;   // Non-maximum suppression threshold
                                     // 非極大值抑制閾值
        public int inpWidth;         // Width of the input image
                                     // 輸入圖像的寬度
        public int inpHeight;        // Height of the input image
                                     // 輸入圖像的高度
        [MarshalAs(UnmanagedType.LPStr)]
        public string modelPath;     // Path to the ONNX model file
                                     // ONNX 模型文件的路徑
        [MarshalAs(UnmanagedType.LPStr)]
        public string logDir;

        [MarshalAs(UnmanagedType.LPStr)]
        public string logFilename;

        [MarshalAs(UnmanagedType.LPStr)]
        public string logLevel;
    }

    // Define Detection struct
    // 定義 Detection 結構體，用於存儲檢測結果
    [StructLayout(LayoutKind.Sequential)]
    public struct Detection
    {
        public int classId;         // Class ID
                                     // 類別 ID
        public float confidence;     // Confidence
                                     // 置信度
        public Rectangle box;        // Bounding box
                                     // 檢測框

        // Constructor to set default values
        // 構造函數，設置默認值
        public Detection(int classId = -1, float confidence = -1.0f, Rectangle box = default)
        {
            this.classId = classId; // Set class ID
                                      // 設置類別 ID
            this.confidence = confidence; // Set confidence
                                          // 設置置信度
            this.box = box == default ? new Rectangle(0, 0, 0, 0) : box; // Set bounding box
                                                                         // 設置檢測框
        }
    }

    // Import functions from EFC DetNet DLL
    // 從 EFC DetNet DLL 中導入函數
    [DllImport("EFC_DETNET_TS_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern IntPtr CreateModel(Config config); // Create EFC DetNet object
                                                            // 創建 EFC DetNet 對象

    [DllImport("EFC_DETNET_TS_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void DestroyModel(IntPtr model); // Destroy EFC DetNet object
                                                             // 銷毀 EFC DetNet 對象

    [DllImport("EFC_DETNET_TS_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void Detect(IntPtr yolov8ts, IntPtr image_data, int data_length); // Perform EFC DetNet detection
                                                                                           // 執行 EFC DetNet 檢測

    [DllImport("EFC_DETNET_TS_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void GetDetections(IntPtr yolov8ts, IntPtr detections, ref int num_detections); // Get EFC DetNet detections
                                                                                                         // 獲取 EFC DetNet 檢測結果

    // Convert Bitmap to byte array
    // 將 Bitmap 轉換為字節數組
    public static byte[] BitmapToByteArray(Bitmap bitmap)
    {
        using (MemoryStream ms = new MemoryStream())
        {
            bitmap.Save(ms, ImageFormat.Png); // Save bitmap to memory stream
                                              // 將 bitmap 保存到內存流
            return ms.ToArray(); // Return byte array
                                 // 返回字節數組
        }
    }

    static void Main(string[] args)
    {
        // Configure EFC DetNet parameters
        // 配置 EFC DetNet 參數
        Config config = new Config
        {
            confThreshold = 0.2f,  // Set confidence threshold
                                   // 設置置信度閾值
            nmsThreshold = 0.4f,   // Set NMS threshold
                                   // 設置非極大值抑制閾值
            inpWidth = 1024,        // Set input width
                                   // 設置輸入寬度
            inpHeight = 1024,       // Set input height
                                   // 設置輸入高度
            modelPath = "/your/path/to/nanya_2cls.torchscript", // Set ONNX model path
                                                                                       // 設置 ONNX 模型路徑
            logDir = "/path/to/save/log/files",
            logFilename = "EFC_DETNET_Nanya_log.txt",
            logLevel = "info"
    };

        // Create EFC DetNet object
        // 創建 EFC DetNet 對象
        IntPtr model = CreateModel(config);

        // Read image and convert to byte array
        // 讀取圖像並轉換為字節數組
        Bitmap bitmap = new Bitmap("D:/Users/will.cheng/Downloads/nanya_infer/xxx.jpg");
        byte[] imageData = BitmapToByteArray(bitmap);

        // Allocate unmanaged memory and copy image data
        // 分配非托管內存並複製圖像數據
        IntPtr unmanagedImageData = Marshal.AllocHGlobal(imageData.Length);
        Marshal.Copy(imageData, 0, unmanagedImageData, imageData.Length);

        // Call EFC DetNet detection
        // 調用 EFC DetNet 檢測
        Detect(model, unmanagedImageData, imageData.Length);

        // Get detection results
        // 獲取檢測結果
        int maxNumDetections = 100; // Maximum number of detections
                                    // 最大檢測數量
        int realNumDetection = 0;   // Actual number of detections
                                    // 實際檢測數量 (待賦值)

        Detection[] detections = new Detection[maxNumDetections]; // Create array to hold detections
                                                                  // 創建數組以保存檢測結果
        IntPtr unmanagedDetections = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(Detection)) * maxNumDetections); // Allocate unmanaged memory for detections
                                                                                                                 // 分配非托管內存以保存檢測結果
        try
        {
            GetDetections(model, unmanagedDetections, ref realNumDetection); // Get detections from EFC DetNet
                                                                                // 從 EFC DetNet 獲取檢測結果

            // Copy detection results from unmanaged memory to managed array
            // 將檢測結果從非托管內存複製到托管數組
            for (int i = 0; i < maxNumDetections; i++)
            {
                IntPtr detectionPtr = new IntPtr(unmanagedDetections.ToInt64() + i * Marshal.SizeOf(typeof(Detection))); // Calculate pointer to each detection
                                                                                                                         // 計算每個檢測結果的指針
                detections[i] = Marshal.PtrToStructure<Detection>(detectionPtr); // Copy detection to managed array
                                                                                 // 將檢測結果複製到托管數組
            }

            // Print detection results
            // 打印檢測結果
            for (int i = 0; i < realNumDetection; ++i)
            {
                Console.WriteLine($"Class ID: {detections[i].classId}, Confidence: {detections[i].confidence}, Box: {detections[i].box}");
                // 打印每個檢測結果的類別 ID、置信度和檢測框
            }
        }
        finally
        {
            // Free unmanaged memory
            // 釋放非托管內存
            Marshal.FreeHGlobal(unmanagedDetections);
        }

        // Free unmanaged memory
        // 釋放非托管內存
        Marshal.FreeHGlobal(unmanagedImageData);

        // Destroy EFC DetNet object
        // 銷毀 EFC DetNet 對象
        DestroyModel(model);
    }
}`;

const CSharpDemo: React.FC = () => {
  return (
    <Tabs
      items={[
        {
          label: '部署說明文檔',
          key: '0',
          children: <DisplayMarkdown markdown={markdown} />,
        },
        {
          label: '示範程式碼',
          key: '1',
          children: <DisplayCode codeString={codeString} />,
        },
      ]}
    ></Tabs>
  );
};

export default CSharpDemo;
