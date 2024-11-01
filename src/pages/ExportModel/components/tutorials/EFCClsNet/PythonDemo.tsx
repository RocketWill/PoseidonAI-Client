/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-15 14:55:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-31 13:35:59
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/EFCClsNet/PythonDemo.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { FormattedMessage } from '@umijs/max';
import { Tabs } from 'antd';
import React from 'react';
import DisplayCode from '../DisplayCode';
import DisplayMarkdown from '../DisplayMarkdown';

const readmeMarkdown = `
# EFC CLSNET 圖像分類模型 Python 整合

此專案展示如何在 Python 應用程式中整合 EFC CLSNET 進行圖像分類。應用程式使用 \`EFC_CLSNET_OV_runtime.dll\` 來執行 EFC CLSNET 模型進行圖像分類。

## 先決條件

在執行此專案之前，需要確保以下設定：

### 必要條件
- **Python 套件**：
  - \`numpy\`
  - \`opencv-python\`（用于图像处理）
  - \`ctypes\`（標準庫中包含）
  - \`Pillow\`

可以使用以下命令安裝必要的 Python 套件：

\`\`\`bash
pip install numpy opencv-python pillow
\`\`\`

### EFC_CLSNET_OV_runtime.dll 依賴項
\`EFC_CLSNET_OV_runtime.dll\` 依賴多個動態連結庫 (DLL) 才能正確運行，這些 DLL 應存放於專案目錄的 \`bin/x64/Release\` 資料夾中。請確保所有依賴項 DLL 都放置於此資料夾。

### 模型文件
您需要提供經過訓練的 EFC CLSNET 模型，並在程式碼中設置該模型的路徑：

\`\`\`python
model_path = "/path/to/model.xml"
\`\`\`

### 日誌目錄
應用程式會將處理過程記錄在由 \`log_dir\`、\`log_filename\` 和 \`log_level\` 定義的日誌文件中。根據您的日誌需求更新這些值：

\`\`\`python
log_dir = "/path/to/log/"
log_filename = "EFC_CLSNET_log.txt"
log_level = "info"
\`\`\`

## 使用方式

1. 將 \`EFC_CLSNET_OV_runtime.dll\` 放置在正確的目錄中。
2. 更新程式碼中的 \`model_path\`、\`log_dir\`、\`log_filename\` 和 \`log_level\`。
3. 將輸入圖像放置於指定的路徑中，並在代碼中設定。

## 範例程式碼

以下是範例程式碼，用於執行 EFC CLSNET 模型進行圖像分類：

\`\`\`python
import ctypes
import numpy as np
from PIL import Image
import os

# 定義 Config 結構體，用於配置 EFC CLSNET 的參數
class Config(ctypes.Structure):
    _fields_ = [
        ("inpWidth", ctypes.c_int),         # 輸入圖像的寬度
        ("inpHeight", ctypes.c_int),        # 輸入圖像的高度
        ("modelPath", ctypes.c_char_p),     # TorchScript 模型文件的路徑
        ("logDir", ctypes.c_char_p),        # 日誌文件保存的目錄
        ("logFilename", ctypes.c_char_p),   # 日誌文件名稱
        ("logLevel", ctypes.c_char_p)       # 日誌級別 (例如："info", "debug")
    ]

# 定義 Detection 結構體，用於存儲檢測結果
class Detection(ctypes.Structure):
    _fields_ = [
        ("classId", ctypes.c_int),         # 檢測物體的類別 ID
        ("confidence", ctypes.c_float)     # 檢測的置信度分數
    ]

# 從 EFC CLSNET DLL 中導入函數
dll = ctypes.CDLL("EFC_CLSNET_OV_runtime.dll")

dll.CreateModel.argtypes = [Config]
dll.CreateModel.restype = ctypes.c_void_p

dll.DestroyModel.argtypes = [ctypes.c_void_p]

dll.Detect.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_int]

dll.GetDetections.argtypes = [ctypes.c_void_p, ctypes.POINTER(Detection)]

def load_image_as_byte_array(image_path):
    # 讀取圖像並轉換為字節數組
    with Image.open(image_path) as img:
        img = img.resize((256, 256))
        byte_array = np.array(img).astype(np.uint8).tobytes()
    return byte_array

def main():
    # 設置模型和日誌配置
    model_path = "/path/to/model.xml".encode('utf-8')
    log_dir = "/path/to/log/".encode('utf-8')
    log_filename = "EFC_CLSNET_log.txt".encode('utf-8')
    log_level = "info".encode('utf-8')

    # 配置 EFC CLSNET
    config = Config(
        inpWidth=256,
        inpHeight=256,
        modelPath=model_path,
        logDir=log_dir,
        logFilename=log_filename,
        logLevel=log_level
    )

    # 創建 EFC CLSNET 模型對象
    model = dll.CreateModel(config)

    # 載入圖像並轉換為字節數組
    image_path = "/path/to/image.jpg"
    image_data = load_image_as_byte_array(image_path)

    # 分配非托管內存並將圖像數據複製到其中
    data_length = len(image_data)
    unmanaged_image_data = ctypes.create_string_buffer(image_data, data_length)

    # 執行檢測
    dll.Detect(model, unmanaged_image_data, data_length)

    # 準備存儲檢測結果
    detection = Detection()

    # 獲取檢測結果
    dll.GetDetections(model, ctypes.byref(detection))

    # 打印檢測結果
    print(f"Class ID: {detection.classId}, Confidence: {detection.confidence}")

    # 銷毀模型對象
    dll.DestroyModel(model)

if __name__ == "__main__":
    main()
\`\`\`
`;

const exampleCode = `
import ctypes
import numpy as np
from PIL import Image
import os

# 定義 Config 結構體，用於配置 EFC CLSNET 的參數
class Config(ctypes.Structure):
    _fields_ = [
        ("inpWidth", ctypes.c_int),         # 輸入圖像的寬度
        ("inpHeight", ctypes.c_int),        # 輸入圖像的高度
        ("modelPath", ctypes.c_char_p),     # TorchScript 模型文件的路徑
        ("logDir", ctypes.c_char_p),        # 日誌文件保存的目錄
        ("logFilename", ctypes.c_char_p),   # 日誌文件名稱
        ("logLevel", ctypes.c_char_p)       # 日誌級別 (例如："info", "debug")
    ]

# 定義 Detection 結構體，用於存儲檢測結果
class Detection(ctypes.Structure):
    _fields_ = [
        ("classId", ctypes.c_int),         # 檢測物體的類別 ID
        ("confidence", ctypes.c_float)     # 檢測的置信度分數
    ]

# 從 EFC CLSNET DLL 中導入函數
dll = ctypes.CDLL("EFC_CLSNET_OV_runtime.dll")

dll.CreateModel.argtypes = [Config]
dll.CreateModel.restype = ctypes.c_void_p

dll.DestroyModel.argtypes = [ctypes.c_void_p]

dll.Detect.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_int]

dll.GetDetections.argtypes = [ctypes.c_void_p, ctypes.POINTER(Detection)]

def load_image_as_byte_array(image_path):
    # 讀取圖像並轉換為字節數組
    with Image.open(image_path) as img:
        img = img.resize((256, 256))
        byte_array = np.array(img).astype(np.uint8).tobytes()
    return byte_array

def main():
    # 設置模型和日誌配置
    model_path = "/path/to/model.xml".encode('utf-8')
    log_dir = "/path/to/log/".encode('utf-8')
    log_filename = "EFC_CLSNET_log.txt".encode('utf-8')
    log_level = "info".encode('utf-8')

    # 配置 EFC CLSNET
    config = Config(
        inpWidth=256,
        inpHeight=256,
        modelPath=model_path,
        logDir=log_dir,
        logFilename=log_filename,
        logLevel=log_level
    )

    # 創建 EFC CLSNET 模型對象
    model = dll.CreateModel(config)

    # 載入圖像並轉換為字節數組
    image_path = "/path/to/image.jpg"
    image_data = load_image_as_byte_array(image_path)

    # 分配非托管內存並將圖像數據複製到其中
    data_length = len(image_data)
    unmanaged_image_data = ctypes.create_string_buffer(image_data, data_length)

    # 執行檢測
    dll.Detect(model, unmanaged_image_data, data_length)

    # 準備存儲檢測結果
    detection = Detection()

    # 獲取檢測結果
    dll.GetDetections(model, ctypes.byref(detection))

    # 打印檢測結果
    print(f"Class ID: {detection.classId}, Confidence: {detection.confidence}")

    # 銷毀模型對象
    dll.DestroyModel(model)

if __name__ == "__main__":
    main()
`;

const PythonDemo: React.FC = () => {
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
          children: <DisplayMarkdown>{readmeMarkdown}</DisplayMarkdown>,
        },
        {
          label: (
            <FormattedMessage
              id="pages.exportModel.tutorial.demoCode"
              defaultMessage="示範程式碼"
            />
          ),
          key: '1',
          children: <DisplayCode codeString={exampleCode} />,
        },
      ]}
    ></Tabs>
  );
};

export default PythonDemo;
