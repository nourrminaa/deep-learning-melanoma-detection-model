# MelanoScan: Melanoma Detection Deep Learning Model

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?logo=tensorflow)
![EfficientNetB0](https://img.shields.io/badge/Model-EfficientNetB0-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Google%20Colab-yellow?logo=googlecolab)

---

## Table of Contents

- [Background](#background)
- [Project Overview](#project-overview)
- [Datasets](#datasets)
- [Model Architecture](#model-architecture)
- [Training Pipeline](#training-pipeline)
- [Evaluation & Results](#evaluation--results)
- [Requirements](#requirements)
- [Usage](#usage)
- [Contributors](#contributors)

---

## Background

Melanoma is the most dangerous form of skin cancer, responsible for the majority of skin cancer-related deaths despite being one of the more visually diagnosable conditions when caught early. According to the American Cancer Society, the five-year survival rate for early-stage melanoma exceeds 98%, but drops dramatically when the disease worsens. The challenge lies in early and accurate detection, a task that is highly dependent on clinical expertise and dermoscopy interpretation. These resources that are not equally accessible across healthcare systems.

Computer-aided diagnosis (CAD) systems powered by deep learning have emerged as a promising tool to bridge this gap. Convolutional Neural Networks (CNNs) trained on large dermatology image datasets have shown diagnostic performance comparable to board-certified dermatologists. However, building a clinically reliable model requires addressing several domain-specific challenges: severe class imbalance (benign lesions vastly outnumber malignant ones), inter-dataset variability, patient-level data leakage in splits, and the cost of false negatives in a medical context.

**MelanoScan** is a university deep learning project that tackles these challenges end-to-end, from dataset merging and deduplication to fine-tuning EfficientNetB0, with a focus on clinical utility: the model is optimized to minimize missed melanomas (false negatives) rather than raw accuracy alone.

---

## Project Overview

MelanoScan is a binary image classification system designed to distinguish **melanoma** (malignant) from **benign** skin lesions using dermoscopic images. The project merges two large, publicly available dermatology datasets, applies clinically aware training strategies, and delivers a threshold-tuned model optimized for high melanoma recall.

**Key design decisions:**

- **Two-dataset merge** (HAM10000 + ISIC 2020) with MD5-based duplicate removal to maximize data diversity.
- **Patient-level train/val/test splitting** using `GroupShuffleSplit` to prevent data leakage across splits from the same patient.
- **Controlled class balancing** at a 1:4 melanoma-to-benign ratio, reflecting realistic clinical prevalence while avoiding the degenerate "always predict benign" trap.
- **Focal Loss with label smoothing** to focus training on hard, misclassified examples and improve melanoma sensitivity.
- **Two-phase transfer learning**: head-only training first, followed by top-50% EfficientNetB0 fine-tuning.
- **Test-Time Augmentation (TTA)** for more robust inference.
- **Clinical threshold tuning** to guarantee ≥85% melanoma recall on the held-out test set.

---

## Datasets

The model is trained on a merged dataset drawn from two Kaggle sources:

| Dataset | Source | Size | Melanoma % |
|---|---|---|---|
| HAM10000 | [kmader/skin-cancer-mnist-ham10000](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000) | ~10,000 images | ~11% |
| ISIC 2020 Challenge | [sumaiyabinteshahid/isic-challenge-dataset-2020](https://www.kaggle.com/datasets/sumaiyabinteshahid/isic-challenge-dataset-2020) | ~33,000 images | ~2% |

### Preprocessing Steps

1. **Binary labelling:** `mel` class → 1, all other classes → 0.
2. **MD5 hash deduplication:** exact duplicate images removed across both datasets based on file content, not filename.
3. **Class balancing:** benign images downsampled to maintain a 1:4 melanoma-to-benign ratio.
4. **Patient-level splitting:** images from the same patient are kept within the same split to prevent the model from memorising patient-specific features.

**Final split distribution:**

| Split | Proportion |
|---|---|
| Train | 70% |
| Validation | 15% |
| Test | 15% |

---

## Model Architecture

The model is built on **EfficientNetB0** pre-trained on ImageNet, with a custom classification head replacing the original 1000-class output.

```
Input (224×224×3)
    └── EfficientNetB0 backbone (239 layers, ImageNet weights)
            └── GlobalAveragePooling2D       → (1280,)
            └── Dropout(0.30)
            └── Dense(128, activation=ReLU)
            └── Dropout(0.40)
            └── Dense(1, activation=Sigmoid) → binary output
```

**Why EfficientNetB0?**

EfficientNetB0 is a compound-scaled CNN developed by Google that achieves strong accuracy–efficiency trade-offs. It was selected as the backbone for this project because it is the most resource-compatible option within the EfficientNet family, making it well-suited for Google Colab training while still offering sufficient feature extraction depth for dermoscopic classification.

**Mixed Precision Training**

To accelerate training on GPU hardware, mixed precision (`float16` for computation, `float32` for weight storage) is enabled via `tf.keras.mixed_precision`, yielding approximately 2× speedup on T4 GPUs.

---

## Training Pipeline

### Loss Function: Focal Loss with Label Smoothing

Standard binary cross-entropy treats all samples equally. In melanoma detection, the vast majority of images are benign so, standard loss functions will converge to predominantly predicting benign. To address this, the model uses a **custom binary focal loss**:

```
FL(p_t) = α_t · (1 − p_t)^γ · BCE(y_true, y_pred)
```

- **γ (gamma)** down-weights easy examples so training focuses on hard, uncertain cases.
- **α (alpha)** increases the relative weight of melanoma samples.
- **Label smoothing** (ε = 0.05) prevents overconfident predictions by softening hard 0/1 labels to 0.025/0.975.

### Data Augmentation

To improve generalisation and teach the model that a melanoma remains a melanoma regardless of image orientation or lighting conditions, the following augmentations are applied stochastically during training:

| Augmentation | Range |
|---|---|
| Random horizontal & vertical flip | x |
| Random rotation | ±72° (factor 0.2) |
| Random zoom | ±15% |
| Random translation | ±10% |
| Random contrast | ±15% |
| Random brightness | ±15% |

### Two-Phase Training

**Phase 1: Head Training (base frozen)**

The EfficientNetB0 backbone is fully frozen. Only the custom head layers are trained at a learning rate of `1e-3`. This stabilises the new head before any pre-trained weights are adjusted.

- Optimizer: `Adam(learning rate: 1e-3)`
- Max epochs: 15
- Early stopping: patience 5 on `val_auc`
- Class weights: `{benign: 1.0, melanoma: 4.0}`

**Phase 2: Fine-Tuning (top 50% of backbone unfrozen)**

The top half of the EfficientNetB0 backbone is unfrozen (while all BatchNormalization layers remain frozen to preserve ImageNet statistics). Training continues at a much lower learning rate to avoid catastrophic forgetting.

- Optimizer: `Adam(learning rate: 1e-5)`
- Max epochs: 25
- Early stopping: patience 6 on `val_auc`
- Class weights: `{benign: 1.0, melanoma: 4.0}`

### Callbacks

All training phases use the following callbacks:

- `EarlyStopping`: stops training if `val_auc` plateaus.
- `ModelCheckpoint`: saves the best-performing weights per phase.
- `ReduceLROnPlateau`: halves the learning rate when `val_auc` doesn't improve.

---

## Evaluation & Results

### Test-Time Augmentation (TTA)

At inference time, each test image is predicted six times (once on the original, five times on augmented versions) and the predictions are averaged. This reduces variance and improves final AUC.

### Threshold Tuning

Rather than using the default 0.5 sigmoid threshold, the model sweeps thresholds from 0.1 to 0.9 and selects the one that:

1. Achieves **≥ 85% melanoma recall** (clinical requirement because missing a melanoma is far worse than a false alarm), and
2. Maximises **F1-score** within that recall constraint.

The selected `clinical_thresh` is used for all final predictions.

### Metrics Reported

- ROC-AUC
- Accuracy
- Precision / Recall / F1 per class
- Confusion Matrix (True Positives, False Negatives minimised)
- ROC Curve

---

## Requirements

### Tools

- Google Colab (T4 GPU)
- Google Drive (for persistent storage of datasets and model weights)
- A Kaggle account with an API key

### Dependencies

The notebook installs all required packages automatically. Core dependencies include:

```
tensorflow >= 2.x
kaggle
kagglehub
scikit-learn
pandas
numpy
matplotlib
seaborn
```
---

## Contributors

- Nour Mina
- Serena Zaarour

---

*University deep learning project built with TensorFlow and EfficientNetB0.*
