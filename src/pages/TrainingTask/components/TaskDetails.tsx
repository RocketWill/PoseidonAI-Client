/* eslint-disable */ /*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-06 15:16:17
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-21 16:24:52
 * @FilePath: /PoseidonAI-Client/src/pages/TrainingTask/components/TaskDetails.tsx
 */
import EvalTask from '@/pages/EvalTask';
import ExportModel from '@/pages/ExportModel';
import ViszualizeVal from '@/pages/VisualizeVal';
import { getUserTask } from '@/services/ant-design-pro/trainingTask'; // 引入服務方法用於獲取任務數據
import { LogActionTrainingTask } from '@/utils/LogActions'; // 日志操作
import { LogLevel } from '@/utils/LogLevels'; // 日志级别
import { useUserActionLogger } from '@/utils/UserActionLoggerContext'; // 日志钩子
import { ArrowLeftOutlined } from '@ant-design/icons'; // 引入 Ant Design 的圖標
import { PageContainer } from '@ant-design/pro-components'; // 引入 Ant Design Pro 的頁面容器組件
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'; // 引入 React 和 Hook
import { useParams } from 'react-router-dom'; // 引入用於獲取 URL 參數的 Hook
import { createBrowserHistory } from 'umi'; // 引入 umi 用來創建瀏覽器歷史
import { TaskItem } from '..'; // 引入項目內部的類型
import ModelTraining from './ModelTraining'; // 引入 ModelTraining 組件

const history = createBrowserHistory();

const TaskDetails: React.FC = () => {
  const [taskData, setTaskData] = useState<TaskItem | undefined>(undefined);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const { taskId } = useParams();
  const evalMode = taskData?.task_detail.status === 'SUCCESS' ? false : true;
  const logger = useUserActionLogger();

  useEffect(() => {
    logger.logAction(
      LogLevel.INFO,
      LogActionTrainingTask.TASK_DETAILS_PAGE_LOAD,
      'TaskDetails page loaded',
    );
  }, []);

  const fetchTask = async () => {
    try {
      const resp = await getUserTask(taskId as string);
      setTaskData(resp.results);
      logger.logAction(
        LogLevel.INFO,
        LogActionTrainingTask.TASK_DETAILS_FETCH_SUCCESS,
        `Task ${taskId} fetched successfully`,
      );
    } catch (error) {
      console.error(error);
      logger.logAction(
        LogLevel.ERROR,
        LogActionTrainingTask.TASK_DETAILS_FETCH_FAILURE,
        `Failed to fetch task ${taskId}`,
      );
    }
  };

  useEffect(() => {
    if (taskId) fetchTask();
  }, [refreshFlag]);

  // 处理 Tab 切换日志
  const handleTabChange = (key: string) => {
    switch (key) {
      case '1':
        logger.logAction(
          LogLevel.DEBUG,
          LogActionTrainingTask.TASK_DETAILS_TAB_LOAD_TRAINING,
          'Training tab loaded',
        );
        break;
      case '2':
        logger.logAction(
          LogLevel.DEBUG,
          LogActionTrainingTask.TASK_DETAILS_TAB_LOAD_EVAL,
          'Evaluation tab loaded',
        );
        break;
      case '3':
        logger.logAction(
          LogLevel.DEBUG,
          LogActionTrainingTask.TASK_DETAILS_TAB_LOAD_VISUALIZE,
          'Visualization tab loaded',
        );
        break;
      case '4':
        logger.logAction(
          LogLevel.DEBUG,
          LogActionTrainingTask.TASK_DETAILS_TAB_LOAD_EXPORT,
          'Model export tab loaded',
        );
        break;
      default:
        logger.logAction(
          LogLevel.DEBUG,
          LogActionTrainingTask.TASK_DETAILS_TAB_SWITCH,
          `Switched to tab ${key}`,
        );
    }
  };

  return (
    <PageContainer
      subTitle={
        <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
          <FormattedMessage id="pages.evalTask.back" defaultMessage="回上頁" />
        </Button>
      }
    >
      <Tabs
        defaultActiveKey="1"
        onChange={handleTabChange}
        items={[
          {
            label: <FormattedMessage id="pages.evalTask.trainingModel" defaultMessage="模型訓練" />,
            key: '1',
            children: <ModelTraining taskData={taskData} setRefreshFlag={setRefreshFlag} />,
          },
          {
            label: evalMode ? (
              <Tooltip title={useIntl().formatMessage({ id: 'pages.evalTask.finishTrainFirst' })}>
                {useIntl().formatMessage({ id: 'pages.evalTask.evalModel' })}
              </Tooltip>
            ) : (
              <FormattedMessage id="pages.evalTask.evalModel" defaultMessage="模型評估" />
            ),
            key: '2',
            children: <EvalTask taskData={taskData} />,
            disabled: evalMode,
          },
          {
            label: evalMode ? (
              <Tooltip title="請先完成模型訓練再進行可視化">驗證集可視化</Tooltip>
            ) : (
              '驗證集可視化'
            ),
            key: '3',
            children: <ViszualizeVal taskData={taskData} />,
            disabled: evalMode,
          },
          {
            label: evalMode ? (
              <Tooltip title="請先完成模型訓練再進行模型導出">模型權重導出</Tooltip>
            ) : (
              '模型權重導出'
            ),
            key: '4',
            children: <ExportModel taskData={taskData} />,
            disabled: evalMode,
          },
        ]}
      />
    </PageContainer>
  );
};

export default TaskDetails;
