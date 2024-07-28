/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-24 19:40:43
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-28 14:37:03
 * @FilePath: /PoseidonAI-Client/src/pages/Configuration/components/CreateConfiguration.tsx
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import { createConfigs } from '@/services/ant-design-pro/trainingConfig';
import { FormattedMessage } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { TrainingFrameworkItem } from '..';
import ChooseTrainingFramework from './chooseTrainingFramework';
import Detectron2InsSegSettings from './Detectron2InsSegSettings';
import YoloV8Settings from './Yolov8Settings';

export interface TrainingFrameworkProps {
  framework: TrainingFrameworkItem;
  handleSubmitConfig: (data: any, reset: any) => Promise<void>;
  saving: boolean;
}

interface CreateConfigurationProps {
  data: TrainingFrameworkItem[];
  setRefresh: (s: boolean) => void;
}

const CreateConfiguration: React.FC<CreateConfigurationProps> = ({ data, setRefresh }) => {
  const [frameworkId, setFrameWorkId] = useState<string>('');
  const [selectedFramework, setSelectedFramework] = useState<TrainingFrameworkItem>();
  const [saving, setSaving] = useState<boolean>(false);

  const handleSubmitConfig = async (data: any, resetForm: () => void) => {
    setRefresh(false);
    setSaving(true);
    try {
      const resp = await createConfigs({ ...data, training_framework_id: selectedFramework?._id });
      if (resp.code === 200) {
        message.success(
          <FormattedMessage
            id="pages.trainingConfig.createConfiguration.saveSuccess"
            defaultMessage="保存成功"
          />,
        );
      } else {
        message.error(
          (
            <FormattedMessage
              id="pages.trainingConfig.createConfiguration.saveError"
              defaultMessage="保存失敗"
            />
          ) + resp.msg,
        );
      }
    } catch (e: any) {
      message.error(
        (
          <FormattedMessage
            id="pages.trainingConfig.createConfiguration.saveError"
            defaultMessage="保存失敗"
          />
        ) + e.message,
      );
    }
    setSaving(false);
    resetForm();
    setRefresh(true);
    return;
  };

  useEffect(() => {
    const foundItem = data.find((item) => item._id === frameworkId);
    setSelectedFramework(foundItem);
  }, [frameworkId]);

  return (
    <>
      <ChooseTrainingFramework trainingFrameworks={data} setFrameWorkId={setFrameWorkId} />
      {selectedFramework?.name === 'Detectron2-InstanceSegmentation' && (
        <Detectron2InsSegSettings
          framework={selectedFramework}
          handleSubmitConfig={handleSubmitConfig}
          saving={saving}
        />
      )}
      {selectedFramework?.name === 'YOLOv8' && (
        <YoloV8Settings
          framework={selectedFramework}
          handleSubmitConfig={handleSubmitConfig}
          saving={saving}
        />
      )}
    </>
  );
};

export default CreateConfiguration;
