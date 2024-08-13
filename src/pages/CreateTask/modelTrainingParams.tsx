/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-02 08:45:40
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-13 15:22:58
 * @FilePath: /PoseidonAI-Client/src/pages/CreateTask/modelTrainingParams.tsx
 */
import { FormattedMessage } from '@umijs/max';

interface Epoch {
  name: any;
  defaultValue: number;
  step: number;
  range: number[];
}

export interface Models {
  name: any;
  weights: {
    name: string;
    disable: boolean;
    value: string;
  }[];
  defaultValue: string;
}

interface Settings {
  models: Models;
  epoch: Epoch;
  val: any; // 根据具体情况定义
}

interface AlgoProjectSettingsType {
  [key: string]: Settings;
}

export const AlgoProjectSettings: AlgoProjectSettingsType = {
  YOLOv8: {
    models: {
      name: (
        <FormattedMessage
          id="pages.modelTraining.params.models.name"
          defaultMessage="選擇模型尺寸"
        />
      ),
      weights: [
        { name: 'YOLOv8n', disable: false, value: 'yolov8n.pt' },
        { name: 'YOLOv8s', disable: false, value: 'yolov8s.pt' },
        { name: 'YOLOv8m', disable: false, value: 'yolov8m.pt' },
        { name: 'YOLOv8l', disable: false, value: 'yolov8l.pt' },
      ],
      defaultValue: 'yolov8n.pt',
    },
    epoch: {
      name: (
        <FormattedMessage
          id="pages.modelTraining.params.yolov8.epoch.name"
          defaultMessage="設置訓練 Epoch 數"
        />
      ),
      defaultValue: 30,
      step: 1,
      range: [30, 150],
    },
    val: {
      name: (
        <FormattedMessage
          id="pages.modelTraining.params.val.name"
          defaultMessage="設置驗證集比例"
        />
      ),
      defaultValue: 0.1,
      step: 0.01,
      range: [0.1, 0.8],
    },
  },
  'Detectron2-InstanceSegmentation': {
    models: {
      name: (
        <FormattedMessage
          id="pages.modelTraining.params.models.name"
          defaultMessage="選擇模型尺寸"
        />
      ),
      weights: [
        { name: 'Resnet 18', disable: false, value: 'mask_rcnn_R_50_FPN_3x___18' },
        { name: 'Resnet 34', disable: false, value: 'mask_rcnn_R_50_FPN_3x___34' },
        { name: 'Resnet 50', disable: false, value: 'mask_rcnn_R_50_FPN_3x___50' },
        { name: 'Resnet 101', disable: true, value: 'mask_rcnn_R_50_FPN_3x___101' },
      ],
      defaultValue: 'Resnet 34',
    },
    epoch: {
      name: (
        <FormattedMessage
          id="pages.modelTraining.params.d2.epoch.name"
          defaultMessage="設置訓練 Iteration 數"
        />
      ),
      defaultValue: 15000,
      step: 1,
      range: [1000, 25000],
    },
    val: {
      name: (
        <FormattedMessage
          id="pages.modelTraining.params.val.name"
          defaultMessage="設置驗證集比例"
        />
      ),
      defaultValue: 0.1,
      step: 0.01,
      range: [0.1, 0.8],
    },
  },
};
