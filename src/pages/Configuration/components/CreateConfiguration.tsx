/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-24 19:40:43
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-22 11:48:54
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

import { LogActionConfig } from '@/utils/LogActions'; // 导入 LogAction
import { LogLevel } from '@/utils/LogLevels'; // 导入 LogLevel
import { useUserActionLogger } from '@/utils/UserActionLoggerContext'; // 导入日志钩子

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

  const { logAction } = useUserActionLogger(); // 获取日志记录函数

  // 选择框架时记录日志
  useEffect(() => {
    const foundItem = data.find((item) => item._id === frameworkId);
    setSelectedFramework(foundItem);

    if (foundItem) {
      logAction(LogLevel.INFO, LogActionConfig.CREATE_CONFIGURATION_SELECT_FRAMEWORK, {
        frameworkId: foundItem._id,
        frameworkName: foundItem.name,
      });
    }
  }, [frameworkId, data]);

  // 处理配置提交
  const handleSubmitConfig = async (data: any, resetForm: () => void) => {
    logAction(LogLevel.INFO, LogActionConfig.CREATE_CONFIGURATION_SUBMIT_START, {
      data: data,
      frameworkId: selectedFramework?._id,
    });

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
        logAction(LogLevel.INFO, LogActionConfig.CREATE_CONFIGURATION_SUBMIT_SUCCESS, {
          frameworkId: selectedFramework?._id,
          configData: data,
        });
      } else {
        message.error(
          (
            <FormattedMessage
              id="pages.trainingConfig.createConfiguration.saveError"
              defaultMessage="保存失敗"
            />
          ) + resp.msg,
        );
        logAction(LogLevel.WARN, LogActionConfig.CREATE_CONFIGURATION_SUBMIT_FAILURE, {
          frameworkId: selectedFramework?._id,
          errorMsg: resp.msg,
        });
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
      logAction(LogLevel.ERROR, LogActionConfig.CREATE_CONFIGURATION_SUBMIT_FAILURE, {
        frameworkId: selectedFramework?._id,
        error: e.message || 'Unknown error',
      });
    }
    setSaving(false);
    resetForm();
    setRefresh(true);
    return;
  };

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
