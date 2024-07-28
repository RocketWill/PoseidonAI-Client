/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-28 15:03:58
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-28 20:45:06
 * @FilePath: /PoseidonAI-Client/src/locales/en-US/pagesTrainingConfigurations.ts
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
export default {
  'pages.trainingConfig.index.createdConfigs': 'Created configurations',
  'pages.trainingConfig.index.createNewConfigs': 'Create new configuration',
  'pages.trainingConfig.chooseTrainingFramework.chooseFramework': 'Choose algorithm framework',
  'pages.trainingConfig.chooseTrainingFramework.choose': 'Choose',
  'pages.trainingConfig.createConfiguration.saveSuccess': 'Save successful',
  'pages.trainingConfig.createConfiguration.saveError': 'Save failed',
  'pages.trainingConfig.framework.setName': 'Training configuration name',
  'pages.trainingConfig.framework.setNameForSettings': 'Please name this configuration',
  'pages.trainingConfig.framework.setDescription': 'Description',
  'pages.trainingConfig.deleteSuccess': 'Delete successful',
  'pages.trainingConfig.deleteError': 'Delete failed',
  'pages.trainingConfig.configName': 'Name',
  'pages.trainingConfig.frameworkName': 'Algorithm framework',
  'pages.trainingConfig.datasetFormat': 'Dataset format',
  'pages.trainingConfig.description': 'Description',
  'pages.trainingConfig.creaedDate': 'Created date',
  'pages.trainingConfig.actions': 'Actions',
  'pages.trainingConfig.detailedConfigInformation': 'Detailed configuration information',
  'pages.trainingConfig.deleteConfig': 'Delete configuration',
  'pages.trainingConfig.confirmDeleteConfig':
    'Are you sure you want to delete this training configuration? This action cannot be undone.',
  'pages.trainingConfig.basicInformation': 'Basic information',
  'pages.trainingConfig.trainingArgs': 'Training parameters',
  'pages.trainingConfig.submit': 'Submit',
  'pages.trainingConfig.reset': 'Reset',
  'pages.trainingConfig.trainingSettings': ' Training Configuration Settings',
  'pages.trainingConfig.trainingParameters': 'Training Parameters',
  'pages.trainingConfig.dataAugmentationSettings': 'Data Augmentation Parameters',
  'pages.trainingConfig.d2insseg.anchorGeneratorSizes':
    'Sizes of the anchor generator for each feature map level.',
  'pages.trainingConfig.d2insseg.anchorGeneratorAspectRatios':
    'Aspect ratios of the anchors for each feature map level.',
  'pages.trainingConfig.d2insseg.rpnPreNmsTopkTrain':
    'Maximum number of candidate regions to keep before applying NMS during training.',
  'pages.trainingConfig.d2insseg.rpnPreNmsTopkTest':
    'Maximum number of candidate regions to keep before applying NMS during testing.',
  'pages.trainingConfig.d2insseg.rpnPostNmsTopkTrain':
    'Maximum number of candidate regions to keep after applying NMS during training.',
  'pages.trainingConfig.d2insseg.rpnPostNmsTopkTest':
    'Maximum number of candidate regions to keep after applying NMS during testing.',
  'pages.trainingConfig.d2insseg.roiBoxHeadNumFc':
    'Number of fully connected layers in the ROI box head.',
  'pages.trainingConfig.d2insseg.roiBoxHeadPoolerResolution':
    'Resolution of the ROI box head pooler.',
  'pages.trainingConfig.d2insseg.roiMaskHeadNumConv':
    'Number of convolutional layers in the ROI mask head.',
  'pages.trainingConfig.d2insseg.roiMaskHeadPoolerResolution':
    'Resolution of the ROI mask head pooler.',
  'pages.trainingConfig.d2insseg.solverImsPerBatch': 'Number of images per batch for the solver.',
  'pages.trainingConfig.d2insseg.solverBaseLr': 'Base learning rate for the solver.',
  'pages.trainingConfig.d2insseg.solverSteps': 'Steps at which the learning rate is decayed.',
  'pages.trainingConfig.d2insseg.solverMaxIter': 'Maximum number of iterations for the solver.',
  'pages.trainingConfig.d2insseg.inputMinSizeTrain':
    'Minimum size of the input images during training.',
  'pages.trainingConfig.yolov8.time': 'The training time in hours.',
  'pages.trainingConfig.yolov8.patience':
    'The number of epochs with no improvement after which training will be stopped.',
  'pages.trainingConfig.yolov8.batch':
    'The batch size, the number of samples processed before the model is updated.',
  'pages.trainingConfig.yolov8.imgsz': 'The size of the input images.',
  'pages.trainingConfig.yolov8.optimizer':
    "The optimization algorithm to use for training, options are 'SGD', 'Adam', 'AdamW'.",
  'pages.trainingConfig.yolov8.seed': 'The random seed for reproducibility.',
  'pages.trainingConfig.yolov8.deterministic':
    'Whether to use deterministic algorithms for reproducibility.',
  'pages.trainingConfig.yolov8.single_cls': 'Whether to treat all classes as a single class.',
  'pages.trainingConfig.yolov8.rect':
    'Whether to use rectangular training, where images are padded to the same size.',
  'pages.trainingConfig.yolov8.cos_lr': 'Whether to use cosine annealing learning rate schedule.',
  'pages.trainingConfig.yolov8.close_mosaic':
    'The number of epochs after which mosaic augmentation is turned off.',
  'pages.trainingConfig.yolov8.amp': 'Whether to use automatic mixed precision training.',
  'pages.trainingConfig.yolov8.fraction': 'The fraction of the dataset to use.',
  'pages.trainingConfig.yolov8.profile': 'Whether to perform profiling to analyze performance.',
  'pages.trainingConfig.yolov8.freeze': 'The number of layers to freeze during training.',
  'pages.trainingConfig.yolov8.lr0': 'The initial learning rate.',
  'pages.trainingConfig.yolov8.lrf': 'The final learning rate.',
  'pages.trainingConfig.yolov8.momentum': 'The momentum factor for the optimizer.',
  'pages.trainingConfig.yolov8.weight_decay': 'The weight decay (L2 penalty) factor.',
  'pages.trainingConfig.yolov8.warmup_epochs':
    'The number of epochs for warmup phase where the learning rate increases linearly.',
  'pages.trainingConfig.yolov8.warmup_momentum': 'The momentum factor during the warmup phase.',
  'pages.trainingConfig.yolov8.warmup_bias_lr':
    'The learning rate for the bias during the warmup phase.',
  'pages.trainingConfig.yolov8.box': 'The weight of the box regression loss.',
  'pages.trainingConfig.yolov8.cls': 'The weight of the classification loss.',
  'pages.trainingConfig.yolov8.dfl': 'The weight of the distribution focal loss.',
  'pages.trainingConfig.yolov8.pose': 'The weight of the pose estimation loss.',
  'pages.trainingConfig.yolov8.kobj': 'The weight of the key object loss.',
  'pages.trainingConfig.yolov8.label_smoothing': 'The factor for label smoothing.',
  'pages.trainingConfig.yolov8.nbs': 'The nominal batch size, used for normalization.',
  'pages.trainingConfig.yolov8.overlap_mask': 'Whether to use overlapping masks.',
  'pages.trainingConfig.yolov8.mask_ratio': 'The weight of the mask loss.',
  'pages.trainingConfig.yolov8.dropout': 'The probability of dropout.',
  'pages.trainingConfig.yolov8.hsv_h': 'The range for adjusting hue, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.hsv_s': 'The range for adjusting saturation, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.hsv_v':
    'The range for adjusting value (brightness), range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.degrees':
    'The range for random rotation in degrees, range -180 - +180.',
  'pages.trainingConfig.yolov8.translate': 'The range for random translation, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.scale': 'The gain factor for random scaling, range >= 0.0.',
  'pages.trainingConfig.yolov8.shear':
    'The range for random shearing in degrees, range -180 - +180.',
  'pages.trainingConfig.yolov8.perspective':
    'The range for random perspective transformation, range 0.0 - 0.001.',
  'pages.trainingConfig.yolov8.flipud':
    'The probability for flipping images up and down, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.fliplr':
    'The probability for flipping images left and right, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.bgr':
    'The probability for converting image channels from RGB to BGR, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.mosaic':
    'The probability for using mosaic augmentation, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.mixup':
    'The probability for mixing two images and their labels, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.copy_paste':
    'The probability for copying objects from one image and pasting them onto another, range 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.auto_augment':
    "Automatically applies predefined data augmentation strategies, options are 'randaugment', 'autoaugment', 'augmix'.",
  'pages.trainingConfig.yolov8.erasing':
    'The probability for randomly erasing parts of images, range 0.0 - 0.9.',
  'pages.trainingConfig.yolov8.crop_fraction':
    'The fraction of the image to retain when cropping for classification, range 0.1 - 1.0.',
};
