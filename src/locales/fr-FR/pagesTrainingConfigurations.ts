export default {
  'pages.trainingConfig.index.createdConfigs': 'Configurations créées',
  'pages.trainingConfig.index.createNewConfigs': 'Créer une nouvelle configuration',
  'pages.trainingConfig.chooseTrainingFramework.chooseFramework': "Choisir le cadre d'algorithme",
  'pages.trainingConfig.chooseTrainingFramework.choose': 'Choisir',
  'pages.trainingConfig.createConfiguration.saveSuccess': 'Enregistrement réussi',
  'pages.trainingConfig.createConfiguration.saveError': "Échec de l'enregistrement",
  'pages.trainingConfig.framework.setName': 'Nom de la configuration de formation',
  'pages.trainingConfig.framework.setNameForSettings': 'Veuillez nommer cette configuration',
  'pages.trainingConfig.framework.setDescription': 'Description',
  'pages.trainingConfig.deleteSuccess': 'Suppression réussie',
  'pages.trainingConfig.deleteError': 'Échec de la suppression',
  'pages.trainingConfig.configName': 'Nom',
  'pages.trainingConfig.frameworkName': "Cadre d'algorithme",
  'pages.trainingConfig.datasetFormat': 'Format du jeu de données',
  'pages.trainingConfig.description': 'Description',
  'pages.trainingConfig.creaedDate': 'Date de création',
  'pages.trainingConfig.actions': 'Actions',
  'pages.trainingConfig.detailedConfigInformation': 'Informations détaillées sur la configuration',
  'pages.trainingConfig.deleteConfig': 'Supprimer la configuration',
  'pages.trainingConfig.confirmDeleteConfig':
    'Êtes-vous sûr de vouloir supprimer cette configuration de formation ? Cette action est irréversible.',
  'pages.trainingConfig.basicInformation': 'Informations de base',
  'pages.trainingConfig.trainingArgs': 'Paramètres de formation',
  'pages.trainingConfig.submit': 'Soumettre',
  'pages.trainingConfig.reset': 'Réinitialiser',
  'pages.trainingConfig.trainingSettings': 'Paramètres de configuration de la formation',
  'pages.trainingConfig.trainingParameters': 'Paramètres de formation',
  'pages.trainingConfig.dataAugmentationSettings': "Paramètres d'augmentation des données",
  'pages.trainingConfig.d2insseg.anchorGeneratorSizes':
    "Tailles du générateur d'ancres pour chaque niveau de carte de caractéristiques.",
  'pages.trainingConfig.d2insseg.anchorGeneratorAspectRatios':
    "Rapports d'aspect des ancres pour chaque niveau de carte de caractéristiques.",
  'pages.trainingConfig.d2insseg.rpnPreNmsTopkTrain':
    "Nombre maximal de régions candidates à conserver avant d'appliquer NMS pendant l'entraînement.",
  'pages.trainingConfig.d2insseg.rpnPreNmsTopkTest':
    "Nombre maximal de régions candidates à conserver avant d'appliquer NMS pendant le test.",
  'pages.trainingConfig.d2insseg.rpnPostNmsTopkTrain':
    "Nombre maximal de régions candidates à conserver après avoir appliqué NMS pendant l'entraînement.",
  'pages.trainingConfig.d2insseg.rpnPostNmsTopkTest':
    'Nombre maximal de régions candidates à conserver après avoir appliqué NMS pendant le test.',
  'pages.trainingConfig.d2insseg.roiBoxHeadNumFc':
    'Nombre de couches complètement connectées dans la tête de la boîte ROI.',
  'pages.trainingConfig.d2insseg.roiBoxHeadPoolerResolution':
    'Résolution du pooler de la boîte ROI.',
  'pages.trainingConfig.d2insseg.roiMaskHeadNumConv':
    'Nombre de couches de convolution dans la tête du masque ROI.',
  'pages.trainingConfig.d2insseg.roiMaskHeadPoolerResolution':
    'Résolution du pooler de la tête de masque ROI.',
  'pages.trainingConfig.d2insseg.solverImsPerBatch': "Nombre d'images par lot pour le solveur.",
  'pages.trainingConfig.d2insseg.solverBaseLr': "Taux d'apprentissage de base pour le solveur.",
  'pages.trainingConfig.d2insseg.solverSteps':
    "Étapes auxquelles le taux d'apprentissage est réduit.",
  'pages.trainingConfig.d2insseg.solverMaxIter': "Nombre maximal d'itérations pour le solveur.",
  'pages.trainingConfig.d2insseg.inputMinSizeTrain':
    "Taille minimale des images d'entrée pendant l'entraînement.",
  'pages.trainingConfig.yolov8.time': 'Temps de formation en heures.',
  'pages.trainingConfig.yolov8.patience':
    "Nombre d'époques sans amélioration avant l'arrêt de l'entraînement.",
  'pages.trainingConfig.yolov8.batch':
    "Taille du lot, nombre d'échantillons traités avant la mise à jour du modèle.",
  'pages.trainingConfig.yolov8.imgsz': "Taille des images d'entrée.",
  'pages.trainingConfig.yolov8.optimizer':
    'Algorithme d\'optimisation à utiliser pour l\'entraînement : options "SGD", "Adam", "AdamW".',
  'pages.trainingConfig.yolov8.seed': 'Graine aléatoire pour la reproductibilité.',
  'pages.trainingConfig.yolov8.deterministic':
    'Utiliser ou non des algorithmes déterministes pour la reproductibilité.',
  'pages.trainingConfig.yolov8.single_cls': 'Traiter toutes les classes comme une seule classe.',
  'pages.trainingConfig.yolov8.rect':
    'Utiliser ou non la formation rectangulaire, où les images sont rembourrées à la même taille.',
  'pages.trainingConfig.yolov8.cos_lr':
    "Utiliser ou non le planning de taux d'apprentissage de l'annélation de cosinus.",
  'pages.trainingConfig.yolov8.close_mosaic':
    "Nombre d'époques après lesquelles l'augmentation de mosaïque est désactivée.",
  'pages.trainingConfig.yolov8.amp': 'Utiliser ou non la formation en précision mixte automatique.',
  'pages.trainingConfig.yolov8.fraction': 'Fraction du jeu de données à utiliser.',
  'pages.trainingConfig.yolov8.profile':
    'Effectuer ou non un profilage pour analyser les performances.',
  'pages.trainingConfig.yolov8.freeze': "Nombre de couches à geler pendant l'entraînement.",
  'pages.trainingConfig.yolov8.lr0': "Taux d'apprentissage initial.",
  'pages.trainingConfig.yolov8.lrf': "Taux d'apprentissage final.",
  'pages.trainingConfig.yolov8.momentum': "Facteur de momentum pour l'optimiseur.",
  'pages.trainingConfig.yolov8.weight_decay': 'Facteur de dépréciation du poids (pénalité L2).',
  'pages.trainingConfig.yolov8.warmup_epochs':
    "Nombre d'époques de phase d'échauffement où le taux d'apprentissage augmente linéairement.",
  'pages.trainingConfig.yolov8.warmup_momentum':
    "Facteur de momentum pendant la phase d'échauffement.",
  'pages.trainingConfig.yolov8.warmup_bias_lr':
    "Taux d'apprentissage pour le biais pendant la phase d'échauffement.",
  'pages.trainingConfig.yolov8.box': 'Poids de la perte de régression de boîte.',
  'pages.trainingConfig.yolov8.cls': 'Poids de la perte de classification.',
  'pages.trainingConfig.yolov8.dfl': 'Poids de la perte focale de distribution.',
  'pages.trainingConfig.yolov8.pose': "Poids de la perte d'estimation de pose.",
  'pages.trainingConfig.yolov8.kobj': "Poids de la perte de l'objet clé.",
  'pages.trainingConfig.yolov8.label_smoothing': 'Facteur pour le lissage des étiquettes.',
  'pages.trainingConfig.yolov8.nbs': 'Taille de lot nominale, utilisée pour la normalisation.',
  'pages.trainingConfig.yolov8.overlap_mask': 'Utiliser ou non des masques qui se chevauchent.',
  'pages.trainingConfig.yolov8.mask_ratio': 'Poids de la perte de masque.',
  'pages.trainingConfig.yolov8.dropout': "Probabilité d'abandon.",
  'pages.trainingConfig.yolov8.hsv_h': 'Plage pour ajuster la teinte, plage 0,0 - 1,0.',
  'pages.trainingConfig.yolov8.hsv_s': 'Plage pour ajuster la saturation, plage 0,0 - 1,0.',
  'pages.trainingConfig.yolov8.hsv_v':
    'Plage pour ajuster la luminosité (valeur), plage 0,0 - 1,0.',
  'pages.trainingConfig.yolov8.degrees':
    'Plage pour la rotation aléatoire en degrés, plage -180 - +180.',
  'pages.trainingConfig.yolov8.translate': 'Plage pour la translation aléatoire, plage 0,0 - 1,0.',
  'pages.trainingConfig.yolov8.scale':
    'Facteur de gain pour le redimensionnement aléatoire, plage >= 0,0.',
  'pages.trainingConfig.yolov8.shear':
    'Plage pour le cisaillement aléatoire en degrés, plage -180 - +180.',
  'pages.trainingConfig.yolov8.perspective':
    'Plage pour la transformation en perspective aléatoire, plage 0,0 - 0,001.',
  'pages.trainingConfig.yolov8.flipud':
    'Probabilité de retourner les images de haut en bas, plage 0,0 - 1,0.',
  'pages.trainingConfig.yolov8.fliplr':
    'Probabilité de retourner les images de gauche à droite, plage 0,0 - 1,0.',
  'pages.trainingConfig.yolov8.bgr':
    "Probabilité de conversion des canaux de l'image de RGB à BGR, plage 0,0 - 1,0.",
  'pages.trainingConfig.yolov8.mosaic':
    "Probabilité d'utiliser l'augmentation de mosaïque, plage 0,0 - 1,0.",
  'pages.trainingConfig.yolov8.mixup':
    'Probabilité de mélanger deux images et leurs étiquettes, plage 0,0 - 1,0.',
  'pages.trainingConfig.yolov8.copy_paste':
    "Probabilité de copier des objets d'une image et de les coller dans une autre, plage 0,0 - 1,0.",
  'pages.trainingConfig.yolov8.auto_augment':
    "Applique automatiquement des stratégies d'augmentation des données prédéfinies, options 'randaugment', 'autoaugment', 'augmix'.",
  'pages.trainingConfig.yolov8.erasing':
    "Probabilité d'effacement aléatoire de parties des images, plage 0,0 - 0,9.",
  'pages.trainingConfig.yolov8.crop_fraction':
    "Fraction de l'image à conserver lors du recadrage pour la classification, plage 0,1 - 1,0.",
};
