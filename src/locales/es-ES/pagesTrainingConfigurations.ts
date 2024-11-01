export default {
  'pages.trainingConfig.index.createdConfigs': 'Configuraciones creadas',
  'pages.trainingConfig.index.createNewConfigs': 'Crear nueva configuración',
  'pages.trainingConfig.chooseTrainingFramework.chooseFramework': 'Elegir marco de algoritmo',
  'pages.trainingConfig.chooseTrainingFramework.choose': 'Elegir',
  'pages.trainingConfig.createConfiguration.saveSuccess': 'Guardado exitoso',
  'pages.trainingConfig.createConfiguration.saveError': 'Error al guardar',
  'pages.trainingConfig.framework.setName': 'Nombre de la configuración de entrenamiento',
  'pages.trainingConfig.framework.setNameForSettings': 'Por favor, nombre esta configuración',
  'pages.trainingConfig.framework.setDescription': 'Descripción',
  'pages.trainingConfig.deleteSuccess': 'Eliminación exitosa',
  'pages.trainingConfig.deleteError': 'Error al eliminar',
  'pages.trainingConfig.configName': 'Nombre',
  'pages.trainingConfig.frameworkName': 'Marco de algoritmo',
  'pages.trainingConfig.datasetFormat': 'Formato del conjunto de datos',
  'pages.trainingConfig.description': 'Descripción',
  'pages.trainingConfig.creaedDate': 'Fecha de creación',
  'pages.trainingConfig.actions': 'Acciones',
  'pages.trainingConfig.detailedConfigInformation': 'Información detallada de la configuración',
  'pages.trainingConfig.deleteConfig': 'Eliminar configuración',
  'pages.trainingConfig.confirmDeleteConfig':
    '¿Está seguro de que desea eliminar esta configuración de entrenamiento? Esta acción no se puede deshacer.',
  'pages.trainingConfig.basicInformation': 'Información básica',
  'pages.trainingConfig.trainingArgs': 'Parámetros de entrenamiento',
  'pages.trainingConfig.submit': 'Enviar',
  'pages.trainingConfig.reset': 'Restablecer',
  'pages.trainingConfig.trainingSettings': 'Configuraciones de entrenamiento',
  'pages.trainingConfig.trainingParameters': 'Parámetros de entrenamiento',
  'pages.trainingConfig.dataAugmentationSettings': 'Parámetros de aumento de datos',
  'pages.trainingConfig.d2insseg.anchorGeneratorSizes':
    'Tamaños del generador de anclas para cada nivel de mapa de características.',
  'pages.trainingConfig.d2insseg.anchorGeneratorAspectRatios':
    'Proporciones de aspecto de las anclas para cada nivel de mapa de características.',
  'pages.trainingConfig.d2insseg.rpnPreNmsTopkTrain':
    'Número máximo de regiones candidatas antes de aplicar NMS durante el entrenamiento.',
  'pages.trainingConfig.d2insseg.rpnPreNmsTopkTest':
    'Número máximo de regiones candidatas antes de aplicar NMS durante la prueba.',
  'pages.trainingConfig.d2insseg.rpnPostNmsTopkTrain':
    'Número máximo de regiones candidatas después de aplicar NMS durante el entrenamiento.',
  'pages.trainingConfig.d2insseg.rpnPostNmsTopkTest':
    'Número máximo de regiones candidatas después de aplicar NMS durante la prueba.',
  'pages.trainingConfig.d2insseg.roiBoxHeadNumFc':
    'Número de capas totalmente conectadas en la cabecera de la caja ROI.',
  'pages.trainingConfig.d2insseg.roiBoxHeadPoolerResolution':
    'Resolución del agrupador de la cabecera de la caja ROI.',
  'pages.trainingConfig.d2insseg.roiMaskHeadNumConv':
    'Número de capas convolucionales en la cabecera de la máscara ROI.',
  'pages.trainingConfig.d2insseg.roiMaskHeadPoolerResolution':
    'Resolución del agrupador de la cabecera de la máscara ROI.',
  'pages.trainingConfig.d2insseg.solverImsPerBatch':
    'Número de imágenes por lote para el solucionador.',
  'pages.trainingConfig.d2insseg.solverBaseLr': 'Tasa de aprendizaje base para el solucionador.',
  'pages.trainingConfig.d2insseg.solverSteps': 'Pasos en los que la tasa de aprendizaje se reduce.',
  'pages.trainingConfig.d2insseg.solverMaxIter':
    'Número máximo de iteraciones para el solucionador.',
  'pages.trainingConfig.d2insseg.inputMinSizeTrain':
    'Tamaño mínimo de las imágenes de entrada durante el entrenamiento.',
  'pages.trainingConfig.yolov8.time': 'El tiempo de entrenamiento en horas.',
  'pages.trainingConfig.yolov8.patience':
    'Número de épocas sin mejora después de las cuales se detiene el entrenamiento.',
  'pages.trainingConfig.yolov8.batch':
    'El tamaño del lote, el número de muestras procesadas antes de actualizar el modelo.',
  'pages.trainingConfig.yolov8.imgsz': 'El tamaño de las imágenes de entrada.',
  'pages.trainingConfig.yolov8.optimizer':
    "El algoritmo de optimización a utilizar para el entrenamiento, opciones son 'SGD', 'Adam', 'AdamW'.",
  'pages.trainingConfig.yolov8.seed': 'La semilla aleatoria para reproducibilidad.',
  'pages.trainingConfig.yolov8.deterministic':
    'Si se deben usar algoritmos deterministas para la reproducibilidad.',
  'pages.trainingConfig.yolov8.single_cls':
    'Si se deben tratar todas las clases como una sola clase.',
  'pages.trainingConfig.yolov8.rect':
    'Si se debe usar entrenamiento rectangular, donde las imágenes se ajustan al mismo tamaño.',
  'pages.trainingConfig.yolov8.cos_lr':
    'Si se debe usar programación de tasa de aprendizaje de coseno.',
  'pages.trainingConfig.yolov8.close_mosaic':
    'Número de épocas después de las cuales se desactiva la ampliación en mosaico.',
  'pages.trainingConfig.yolov8.amp': 'Si se debe usar entrenamiento de precisión mixta automática.',
  'pages.trainingConfig.yolov8.fraction': 'La fracción del conjunto de datos a usar.',
  'pages.trainingConfig.yolov8.profile':
    'Si se debe realizar perfilado para analizar el rendimiento.',
  'pages.trainingConfig.yolov8.freeze': 'Número de capas a congelar durante el entrenamiento.',
  'pages.trainingConfig.yolov8.lr0': 'La tasa de aprendizaje inicial.',
  'pages.trainingConfig.yolov8.lrf': 'La tasa de aprendizaje final.',
  'pages.trainingConfig.yolov8.momentum': 'El factor de momento para el optimizador.',
  'pages.trainingConfig.yolov8.weight_decay': 'El factor de decaimiento de peso (penalización L2).',
  'pages.trainingConfig.yolov8.warmup_epochs':
    'Número de épocas para la fase de calentamiento donde la tasa de aprendizaje aumenta linealmente.',
  'pages.trainingConfig.yolov8.warmup_momentum':
    'El factor de momento durante la fase de calentamiento.',
  'pages.trainingConfig.yolov8.warmup_bias_lr':
    'La tasa de aprendizaje para el sesgo durante la fase de calentamiento.',
  'pages.trainingConfig.yolov8.box': 'El peso de la pérdida de regresión de caja.',
  'pages.trainingConfig.yolov8.cls': 'El peso de la pérdida de clasificación.',
  'pages.trainingConfig.yolov8.dfl': 'El peso de la pérdida focal de distribución.',
  'pages.trainingConfig.yolov8.pose': 'El peso de la pérdida de estimación de pose.',
  'pages.trainingConfig.yolov8.kobj': 'El peso de la pérdida de objeto clave.',
  'pages.trainingConfig.yolov8.label_smoothing': 'El factor para suavizado de etiquetas.',
  'pages.trainingConfig.yolov8.nbs': 'El tamaño nominal del lote, usado para normalización.',
  'pages.trainingConfig.yolov8.overlap_mask': 'Si se deben usar máscaras superpuestas.',
  'pages.trainingConfig.yolov8.mask_ratio': 'El peso de la pérdida de máscara.',
  'pages.trainingConfig.yolov8.dropout': 'La probabilidad de abandono.',
  'pages.trainingConfig.yolov8.hsv_h': 'El rango para ajustar el tono, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.hsv_s': 'El rango para ajustar la saturación, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.hsv_v': 'El rango para ajustar el valor (brillo), rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.degrees':
    'El rango para rotación aleatoria en grados, rango -180 - +180.',
  'pages.trainingConfig.yolov8.translate': 'El rango para traslación aleatoria, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.scale':
    'El factor de ganancia para escalado aleatorio, rango >= 0.0.',
  'pages.trainingConfig.yolov8.shear':
    'El rango para cizallamiento aleatorio en grados, rango -180 - +180.',
  'pages.trainingConfig.yolov8.perspective':
    'El rango para transformación de perspectiva aleatoria, rango 0.0 - 0.001.',
  'pages.trainingConfig.yolov8.flipud':
    'La probabilidad para voltear imágenes de arriba a abajo, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.fliplr':
    'La probabilidad para voltear imágenes de izquierda a derecha, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.bgr':
    'La probabilidad de convertir canales de imagen de RGB a BGR, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.mosaic':
    'La probabilidad de usar aumento en mosaico, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.mixup':
    'La probabilidad de mezclar dos imágenes y sus etiquetas, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.copy_paste':
    'La probabilidad de copiar objetos de una imagen y pegarlos en otra, rango 0.0 - 1.0.',
  'pages.trainingConfig.yolov8.auto_augment':
    "Aplica automáticamente estrategias de aumento de datos predefinidas, opciones son 'randaugment', 'autoaugment', 'augmix'.",
  'pages.trainingConfig.yolov8.erasing':
    'La probabilidad de borrar aleatoriamente partes de imágenes, rango 0.0 - 0.9.',
  'pages.trainingConfig.yolov8.crop_fraction':
    'La fracción de la imagen a retener al recortar para clasificación, rango 0.1 - 1.0.',
};
