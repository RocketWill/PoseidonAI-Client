/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-09-15 14:55:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-04 17:14:31
 * @FilePath: /PoseidonAI-Client/src/pages/ExportModel/components/tutorials/EFCSegNet/PythonDemo.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { Tabs } from 'antd';
import React from 'react';
import DisplayCode from '../DisplayCode';
import DisplayMarkdown from '../DisplayMarkdown';

const readme = `
# EFC SegNet 實例分割模型 Python 整合

此專案展示如何在自訂的 Python 應用程式中整合 EFC SegNet 實例分割模型。應用程式使用 \`EFC_SEGNET_runtime.dll\` 來執行 EFC SegNet 模型進行圖像實例分割。

## 先決條件

在執行此專案之前，需要確保以下設定：

### 必要條件
- **Python 套件**：
  - [OpenCV](https://pypi.org/project/opencv-python/) (cv2)
  - [NumPy](https://pypi.org/project/numpy/)

\`\`\`bash
pip install opencv-python numpy
\`\`\`

### EFC_SEGNET_runtime.dll 依賴項
\`EFC_SEGNET_runtime.dll\` 依賴多個動態連結庫 (DLL) 才能正確運行，這些 DLL 應存放於專案目錄中。請確保所有依賴項 DLL 都放置於正確的位置。

### 模型文件
您需要提供經過訓練的 EFC SegNet 模型，在程式碼中正確設置該模型的路徑，更新 \`Config\` 結構中的 \`modelPath\`。

\`\`\`python
modelPath = b"/path/to/model.ts"
\`\`\`

確保該路徑指向實際的 EFC SegNet 模型文件。

### 日誌目錄
應用程式會將處理過程記錄在由 \`logDir\`、\`logFilename\` 和 \`logLevel\` 定義的日誌文件中。根據您的日誌需求更新這些值。

\`\`\`python
logDir = b"/path/to/log/"  # 注意最後一個 \`/\` 必須加上
logFilename = b"segnet.txt"
logLevel = b"info"
\`\`\`

### 使用方式

1. 將 \`EFC_SEGNET_runtime.dll\` 放置在正確的目錄中。
2. 更新程式碼中的 \`modelPath\`、\`logDir\`、\`logFilename\`。
3. 將輸入圖像放置於程式中定義的路徑中。

\`\`\`python
image_file = "/path/to/input.jpg"
\`\`\`

4. 執行應用程式，檢測結果將會在指定的輸出文件中保存分割結果。

\`\`\`python
output_file = "/path/to/output.png"
\`\`\`

5. 輸出結果將包含圖像上的實例分割，包含檢測框、掩膜和檢測分數。

### 注意事項
- 請確保所有路徑都指向正確的位置，以便 DLL 和模型文件能夠被正確加載。
- 需要正確設置輸入圖像的路徑，並確認圖像格式支持 (例如 JPEG、PNG 等)。
- 此程式會將檢測結果直接可視化於輸出圖像中，請根據需要進行調整。

希望這些指引能夠幫助您順利整合 EFC SegNet 實例分割模型！
`;

const codeString = `import ctypes
import cv2
import numpy as np
from ctypes import Structure, c_float, c_int, c_char_p, POINTER, byref
import os

# 定義模型的 Config 結構體 (Define Config struct for Model)
class Config(Structure):
    _fields_ = [
        ("confThreshold", c_float),  # 檢測置信度閾值 (Detection confidence threshold)
        ("nmsThreshold", c_float),   # 非極大值抑制閾值 (Non-maximum suppression threshold)
        ("inpShort", c_int),         # 輸入圖像最短邊長度 (Input image min length)
        ("channel", c_int),          # 圖像通道數 (默認為 3) (Image channels, default is 3)
        ("modelPath", c_char_p),     # 模型路徑 (Path to model)
        ("logDir", c_char_p),        # 日誌文件夾 (Log directory)
        ("logFilename", c_char_p),   # 日誌文件名 (Log filename)
        ("logLevel", c_char_p)       # 日誌等級 (建議設置為 "info") (Log level, recommend "info")
    ]

# 定義檢測結構體 (Define Detection struct)
class Detection(Structure):
    _fields_ = [
        ("confidence", c_float),    # 置信度 (Confidence)
        ("classId", c_int),         # 類別 ID (Class ID)
        ("box", c_int * 4),         # 檢測框 (x, y, 寬度, 高度) (Bounding box, x, y, width, height)
        ("mask", c_int * (28 * 28)) # 掩膜 (固定大小 28x28) (Mask, fixed size 28x28)
    ]

# 加載 DLL (Load DLL)
segnet_dll = ctypes.CDLL("EFC_SEGNET_runtime.dll")
segnet_dll.CreateModel.restype = ctypes.c_void_p
segnet_dll.CreateModel.argtypes = [Config]
segnet_dll.DestroyModel.restype = None
segnet_dll.DestroyModel.argtypes = [ctypes.c_void_p]
segnet_dll.Detect.restype = None
segnet_dll.Detect.argtypes = [ctypes.c_void_p, POINTER(ctypes.c_ubyte), c_int]
segnet_dll.GetDetections.restype = None
segnet_dll.GetDetections.argtypes = [ctypes.c_void_p, POINTER(Detection), POINTER(c_int)]

def main():
    config = Config(
        confThreshold=0.2,  # 設置檢測置信度閾值 (Set detection confidence threshold)
        nmsThreshold=0.4,   # 設置非極大值抑制閾值 (Set non-maximum suppression threshold)
        inpShort=800,       # 設置輸入圖像最短邊長度 (Set input image min length)
        channel=3,          # 設置圖像通道數 (默認為 3) (Set image channels, default is 3)
        modelPath=b"/path/to/model.ts",  # 模型路徑 (Path to model)
        logDir=b"/path/to/log/",         # 日誌文件夾 (Log directory)
        logFilename=b"segnet.txt",       # 日誌文件名 (Log filename)
        logLevel=b"info"                  # 日誌等級 (Log level)
    )

    # 創建模型 (Create model)
    model = segnet_dll.CreateModel(config)

    try:
        # 設置圖像路徑 (Set image paths)
        image_file = "/path/to/input.jpg"  # 輸入圖像路徑 (Input image path)
        output_file = "/path/to/output.png"  # 輸出圖像路徑 (Output image path)

        # 加載圖像並轉換為字節數組 (Load image and convert to byte array)
        image = cv2.imread(image_file)
        image_data = image.tobytes()
        image_data_length = len(image_data)

        # 轉換為非托管內存 (Convert to unmanaged memory)
        unmanaged_image_data = (ctypes.c_ubyte * image_data_length).from_buffer_copy(image_data)

        # 檢測圖像中的對象 (Detect objects in the image)
        segnet_dll.Detect(model, unmanaged_image_data, image_data_length)

        # 獲取檢測結果 (Get detection results)
        max_num_detections = 100  # 最大檢測數量 (Maximum number of detections)
        real_num_detections = c_int(0)  # 實際檢測數量 (Actual number of detections)
        detections = (Detection * max_num_detections)()  # 創建檢測結果數組 (Create detection result array)
        segnet_dll.GetDetections(model, detections, byref(real_num_detections))

        bboxes = []  # 檢測框列表 (List of bounding boxes)
        masks = []   # 掩膜列表 (List of masks)
        scores = []  # 置信度分數列表 (List of confidence scores)

        for i in range(real_num_detections.value):
            detection = detections[i]
            bbox = [detection.box[0], detection.box[1], detection.box[2], detection.box[3]]
            bboxes.append(bbox)
            scores.append(detection.confidence)

            # 將掩膜縮放到檢測框大小 (Rescale mask to bounding box size)
            mask_array = np.array(detection.mask).reshape(28, 28).astype(np.uint8)
            mask_resized = cv2.resize(mask_array, (bbox[2], bbox[3]))
            mask_binary = (mask_resized > 0).astype(np.uint8) * 255

            # 轉換輪廓以匹配檢測框位置 (Translate contours to match the bounding box location)
            contours, _ = cv2.findContours(mask_binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            translated_contours = [contour + np.array([[bbox[0], bbox[1]]]) for contour in contours]
            masks.append(translated_contours)

        # 可視化檢測結果 (Visualize detection results)
        visualize(image_file, output_file, bboxes, masks, scores)
    finally:
        # 銷毀模型 (Destroy model)
        segnet_dll.DestroyModel(model)

def visualize(image_file, output_file, bboxes, masks, scores):
    # 加載原始圖像 (Load original image)
    image = cv2.imread(image_file)

    for bbox, mask, score in zip(bboxes, masks, scores):
        # 繪製檢測框 (Draw bounding box)
        color = (0, 0, 255)  # 檢測框的顏色為紅色 (Red color for bounding box)
        cv2.rectangle(image, (bbox[0], bbox[1]), (bbox[0] + bbox[2], bbox[1] + bbox[3]), color, 2)

        # 繪製掩膜 (Draw mask)
        for contour in mask:
            cv2.drawContours(image, [contour], -1, (0, 255, 0), 2)  # 掩膜的顏色為綠色 (Green color for mask)

        # 繪製置信度分數 (Draw confidence score)
        cv2.putText(image, f"{score:.2f}", (bbox[0], bbox[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

    # 保存可視化的輸出 (Save the visualized output)
    cv2.imwrite(output_file, image)

if __name__ == "__main__":
    main()`;

const PythonDemo: React.FC = () => {
  return (
    <Tabs
      items={[
        {
          label: '部署說明文檔',
          key: '0',
          children: <DisplayMarkdown>{readme}</DisplayMarkdown>,
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

export default PythonDemo;
