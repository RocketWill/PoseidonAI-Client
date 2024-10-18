/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-15 14:55:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-16 13:18:49
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/EFCClsNet/CppDemo.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { Tabs } from 'antd';
import React from 'react';
import DisplayCode from '../DisplayCode';
import DisplayMarkdown from '../DisplayMarkdown';

const readmeMarkdown = `
# EFC CLSNET 圖像分類模型 C++ 整合

此專案展示如何在 C++ 應用程式中整合 EFC CLSNET 進行圖像分類。應用程式使用 \`EFC_CLSNET_runtime.dll\` 來執行 EFC CLSNET 模型進行圖像分類。

## 先決條件

在執行此專案之前，需要確保以下設定：

### 必要條件
- **C++ 開發環境**（例如，Visual Studio 或 GCC）
- **OpenCV**（用於圖像處理）
- **EFC_CLSNET_runtime.dll** 及其所有相依性 DLL

### EFC_CLSNET_runtime.dll 相依性
\`EFC_CLSNET_runtime.dll\` 依賴多個動態連結庫 (DLL) 才能正確運行，這些 DLL 應放置於專案目錄的 \`bin/x64/Release\` 資料夾中。請確保所有相依性 DLL 都放置於此資料夾。

### 模型檔案
您需要提供經過訓練的 EFC CLSNET 模型，並在程式碼中設置該模型的路徑：

\`\`\`cpp
const char* modelPath = "/path/to/model.xml";
\`\`\`

### 日誌目錄
應用程式會將處理過程記錄在指定的日誌檔案中。根據您的需求更新這些值：

\`\`\`cpp
const char* logDir = "/path/to/log/";
const char* logFilename = "EFC_CLSNET_log.txt";
const char* logLevel = "info";
\`\`\`

## 使用方式

1. 將 \`EFC_CLSNET_runtime.dll\` 放置在正確的目錄中。
2. 更新程式碼中的 \`modelPath\`、\`logDir\`、\`logFilename\` 和 \`logLevel\`。
3. 將輸入圖像放置於指定的路徑中，並在程式碼中設置。`;

const exampleCode = `
#include <iostream>
#include <opencv2/opencv.hpp>
#include <Windows.h>

// 定義 Config 結構體，用於配置 EFC CLSNET 的參數
struct Config {
    int inpWidth;         // 輸入圖像的寬度
    int inpHeight;        // 輸入圖像的高度
    const char* modelPath; // TorchScript 模型文件的路徑
    const char* logDir;    // 日誌文件保存的目錄
    const char* logFilename; // 日誌文件名稱
    const char* logLevel;   // 日誌級別 (例如："info", "debug")
};

// 定義 Detection 結構體，用於儲存檢測結果
struct Detection {
    int classId;         // 檢測物體的類別 ID
    float confidence;    // 檢測的置信度分數
};

// 從 DLL 中匯入函數
typedef void* (*CreateModelFunc)(Config);
typedef void (*DestroyModelFunc)(void*);
typedef void (*DetectFunc)(void*, const unsigned char*, int);
typedef void (*GetDetectionsFunc)(void*, Detection*);

int main() {
    // 載入 DLL
    HINSTANCE dll = LoadLibrary("EFC_CLSNET_runtime.dll");
    if (!dll) {
        std::cerr << "無法載入 EFC_CLSNET_runtime.dll" << std::endl;
        return -1;
    }

    // 載入函數
    CreateModelFunc CreateModel = (CreateModelFunc)GetProcAddress(dll, "CreateModel");
    DestroyModelFunc DestroyModel = (DestroyModelFunc)GetProcAddress(dll, "DestroyModel");
    DetectFunc Detect = (DetectFunc)GetProcAddress(dll, "Detect");
    GetDetectionsFunc GetDetections = (GetDetectionsFunc)GetProcAddress(dll, "GetDetections");

    if (!CreateModel || !DestroyModel || !Detect || !GetDetections) {
        std::cerr << "無法從 DLL 中載入函數" << std::endl;
        FreeLibrary(dll);
        return -1;
    }

    // 設定模型和日誌配置
    Config config = {
        256,                              // 輸入圖像寬度
        256,                              // 輸入圖像高度
        "/path/to/model.xml",             // 模型檔案路徑
        "/path/to/log/",                  // 日誌目錄
        "EFC_CLSNET_log.txt",             // 日誌檔案名稱
        "info"                            // 日誌級別
    };

    // 創建模型對象
    void* model = CreateModel(config);
    if (!model) {
        std::cerr << "無法創建模型" << std::endl;
        FreeLibrary(dll);
        return -1;
    }

    // 讀取圖像
    cv::Mat image = cv::imread("/path/to/image.jpg");
    if (image.empty()) {
        std::cerr << "無法載入圖像" << std::endl;
        DestroyModel(model);
        FreeLibrary(dll);
        return -1;
    }

    // 調整圖像大小
    cv::resize(image, image, cv::Size(256, 256));
    std::vector<unsigned char> imageData(image.data, image.data + (image.total() * image.elemSize()));

    // 執行檢測
    Detect(model, imageData.data(), imageData.size());

    // 準備儲存檢測結果
    Detection detection;

    // 獲取檢測結果
    GetDetections(model, &detection);

    // 輸出檢測結果
    std::cout << "Class ID: " << detection.classId << ", Confidence: " << detection.confidence << std::endl;

    // 銷毀模型對象
    DestroyModel(model);

    // 釋放 DLL
    FreeLibrary(dll);

    return 0;
}`;

const CppDemo: React.FC = () => {
  return (
    <Tabs
      items={[
        {
          label: '部署說明文檔',
          key: '0',
          children: <DisplayMarkdown>{readmeMarkdown}</DisplayMarkdown>,
        },
        {
          label: '示範程式碼',
          key: '1',
          children: <DisplayCode codeString={exampleCode} />,
        },
      ]}
    ></Tabs>
  );
};

export default CppDemo;
