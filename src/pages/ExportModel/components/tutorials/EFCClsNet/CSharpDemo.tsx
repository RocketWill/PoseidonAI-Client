/* eslint-disable */
/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-08 19:54:02
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-31 13:35:37
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/EFCClsNet/CSharpDemo.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { FormattedMessage } from '@umijs/max';
import { Tabs } from 'antd';
import React from 'react';
import DisplayCode from '../DisplayCode';
import DisplayMarkdown from '../DisplayMarkdown';

const markdown = `
# EFC CLSNET 圖像分類模型 .NET 整合

此專案展示如何在自訂的 C# 應用程式中整合 EFC CLSNET 進行圖像分類。應用程式使用 \`EFC_CLSNET_runtime.dll\` 來執行 EFC CLSNET 模型進行圖像分類。

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

### EFC_CLSNET_runtime.dll 依賴項
\`EFC_CLSNET_runtime.dll\` 依賴多個動態連結庫 (DLL) 才能正確運行，這些 DLL 應存放於專案目錄的 \`bin\\\\x64\\\\Release\` 資料夾中。請確保所有依賴項 DLL 都放置於此資料夾。

### 模型文件
您需要提供經過訓練的 EFC CLSNET 模型，在程式碼中正確設置該模型的路徑，更新 \`Config\` 結構中的 \`modelPath\`。

\`\`\`csharp
modelPath = "/path/to/model.xml";
\`\`\`

確保該路徑指向實際的 EFC CLSNET 模型文件。

### 日誌目錄
應用程式會將處理過程記錄在由 \`logDir\`、\`logFilename\` 和 \`logLevel\` 定義的日誌文件中。根據您的日誌需求更新這些值。

\`\`\`csharp
logDir = "/path/to/log/";  // 注意最後一個 \`/\` 必須加上
logFilename = "EFC_CLSNETOV_log.txt";
logLevel = "info";
\`\`\`

## 使用方式

1. 將 \`EFC_CLSNET_runtime.dll\` 放置在正確的目錄中。
2. 更新程式碼中的 \`modelPath\`、\`logDir\`、\`logFilename\` 和 \`logLevel\`。
3. 將輸入圖像放置於 \`Main\` 函數中定義的路徑中。

\`\`\`csharp
Bitmap bitmap = new Bitmap("/path/to/image.jpg");
\`\`\`

4. 執行應用程式，分類結果將會在主控台中列印。
`;

const codeString = `using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

class Program
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
    public struct Config
    {
        public int inpWidth;
        public int inpHeight;
        [MarshalAs(UnmanagedType.LPStr)]
        public string modelPath;
        [MarshalAs(UnmanagedType.LPStr)]
        public string logDir;
        [MarshalAs(UnmanagedType.LPStr)]
        public string logFilename;
        [MarshalAs(UnmanagedType.LPStr)]
        public string logLevel;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct Detection
    {
        public int classId;
        public float confidence;

        public Detection(int classId = -1, float confidence = -1.0f)
        {
            this.classId = classId;
            this.confidence = confidence;
        }
    }

    [DllImport("EFC_CLSNET_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern IntPtr CreateModel(Config config);

    [DllImport("EFC_CLSNET_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void DestroyModel(IntPtr model);

    [DllImport("EFC_CLSNET_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void Detect(IntPtr model, IntPtr image_data, int data_length);

    [DllImport("EFC_CLSNET_runtime.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern void GetDetections(IntPtr model, IntPtr detections);

    public static byte[] BitmapToByteArray(Bitmap bitmap)
    {
        using (MemoryStream ms = new MemoryStream())
        {
            bitmap.Save(ms, ImageFormat.Png);
            return ms.ToArray();
        }
    }

    static void Main(string[] args)
    {
        Config config = new Config
        {
            inpWidth = 256,
            inpHeight = 256,
            modelPath = "/path/to/model.xml",
            logDir = "/path/to/log/",
            logFilename = "EFC_CLSNETOV_log.txt",
            logLevel = "info"
        };

        IntPtr model = CreateModel(config);

        Bitmap bitmap = new Bitmap("/path/to/image.jpg");
        byte[] imageData = BitmapToByteArray(bitmap);
        IntPtr unmanagedImageData = Marshal.AllocHGlobal(imageData.Length);
        Marshal.Copy(imageData, 0, unmanagedImageData, imageData.Length);

        Detect(model, unmanagedImageData, imageData.Length);

        int maxNumDetections = 1;
        Detection[] detections = new Detection[maxNumDetections];
        int detectionSize = Marshal.SizeOf(typeof(Detection));
        IntPtr unmanagedDetections = Marshal.AllocHGlobal(detectionSize * maxNumDetections);

        try
        {
            GetDetections(model, unmanagedDetections);

            for (int i = 0; i < maxNumDetections; i++)
            {
                IntPtr detectionPtr = new IntPtr(unmanagedDetections.ToInt64() + i * detectionSize);
                detections[i] = Marshal.PtrToStructure<Detection>(detectionPtr);
            }

            Console.WriteLine($"Class ID: {detections[0].classId}, Confidence: {detections[0].confidence}");
        }
        finally
        {
            Marshal.FreeHGlobal(unmanagedDetections);
            Marshal.FreeHGlobal(unmanagedImageData);
            DestroyModel(model);
        }
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
