# Physio-AI

Physio-AI is an undergraduate research prototype that uses a standard webcam to give feedback on squat form. It estimates pose landmarks, classifies four types of squat form and stores session history. Its results describe a single-participant academic experiment.

## Architecture

| Component       | What it does                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Browser session | Captures frames and renders feedback received over a local WebSocket.                                                        |
| Python service  | Runs MediaPipe Pose, creates a 24-feature embedding, classifies the pose and combines model output with rule-based feedback. |
| Session history | Stores results in SQLite. The browser reads the summaries through the local HTTP service.                                    |
| Training        | Compares Random Forest, SVM and logistic regression with labelled feature rows.                                              |

[Browser session](https://github.com/Nasim1801/physio-ai-final/blob/7dc8dbd9a4b72e7e145393d2a6cb8fc516b89f42/session.html) · [Python service](https://github.com/Nasim1801/physio-ai-final/blob/7dc8dbd9a4b72e7e145393d2a6cb8fc516b89f42/ws_server.py) · [SQLite helpers](https://github.com/Nasim1801/physio-ai-final/blob/7dc8dbd9a4b72e7e145393d2a6cb8fc516b89f42/core/db.py)

## Verify the public code

The public source supports a Python 3.11 smoke test with no model, camera, database file or third-party packages. Run this from the checkout root.

```sh
python3.11 - <<'PY'
from core.geometry import angle_abc
from core.db import init_db, save_session, get_last_sessions

assert angle_abc((0, 1), (0, 0), (1, 0)) == 90
assert angle_abc((0, 0), (0, 0), (1, 0)) is None
with init_db(":memory:") as db:
    save_session(db, "squat", 30, 4, 1, 92)
    assert get_last_sessions(db)[0][1:] == ("squat", 30, 4, 1, 92.0)
print("Geometry and SQLite round-trip passed")
PY
```

## Local application setup

For the webcam demo, use an isolated Python 3.11 environment on a machine with camera access. The legacy code calls `mediapipe.solutions.pose`. The checked-in requirements list MediaPipe 0.10.32 and omit several imports. Verify that a compatible installed MediaPipe exposes `solutions.pose` before starting the app. The local environment used for this review had MediaPipe 0.10.9, OpenCV 4.13.0.92, NumPy 2.4.2, pandas 3.0.1, scikit-learn 1.8.0, joblib 1.5.3 and websockets 16.0. Training also uses Matplotlib and seaborn. Use one compatible OpenCV build.

```sh
python3.11 -m venv .venv
. .venv/bin/activate
python -m pip install 'mediapipe==0.10.9' 'opencv-contrib-python==4.13.0.92' \
  'numpy==2.4.2' 'pandas==3.0.1' 'scikit-learn==1.8.0' 'joblib==1.5.3' \
  'websockets==16.0' 'matplotlib==3.10.8' 'seaborn==0.13.2'
python -c 'import mediapipe as mp; assert hasattr(mp.solutions, "pose")'
```

The version example is based on the existing macOS environment used for the checks. Fresh installation and wheel availability can vary by platform.

1. Supply trusted, matching `models/pose_classifier.pkl`, `models/scaler.pkl` and `models/label_encoder.pkl` files. The public repository omits the fitted artifacts and the original recordings.
2. From the checkout root, run `python setup_patients.py` to initialise a throwaway local account database, then start `python ws_server.py`. The WebSocket and HTTP service use localhost ports 8765 and 8766.
3. In a second terminal from the same directory, run `python -m http.server 5500 --bind 127.0.0.1`. Open `http://localhost:5500/login.html`, sign in with a local demo account and grant webcam access when starting a session.

The application setup is intended for a local research demo with dummy accounts. The portable smoke test above is independent of the model and camera.

## Evaluation and reproducibility

**96.23% is the academic Random Forest result.** The dissertation reports 7,153 test frame rows and Random Forest macro precision, recall and F1 of 0.96, 0.95 and 0.96. The report describes a temporal 80/20 split.

A local review reran the public [augmentation and retraining script](https://github.com/Nasim1801/physio-ai-final/blob/7dc8dbd9a4b72e7e145393d2a6cb8fc516b89f42/retrain_with_augmentation.py) on the archived `augmented_pose_data.csv` with SHA-256 prefix `55f282124113e54f`. This snapshot contains 24,492 labelled rows and 24 pose features per row. The retraining script creates 35,764 rows and uses a stratified random split after augmentation. It produced 28,611 training rows and 7,153 test rows, matching the academic test supports for all four classes.

| Result                       | Dissertation | Local rerun |
| ---------------------------- | -----------: | ----------: |
| Random Forest accuracy       |       96.23% |      96.24% |
| SVM accuracy                 |       91.88% |      91.88% |
| Logistic regression accuracy |       81.71% |      81.64% |
| Random Forest macro F1       |         0.96 |        0.96 |

The local rerun reproduced the class supports and approximate scores. The last augmentation step uses unseeded noise. An immutable historical run record, exact model artifact and confirmed split provenance would be needed to tie the academic result to an exact execution. The separate [exploratory training script](https://github.com/Nasim1801/physio-ai-final/blob/7dc8dbd9a4b72e7e145393d2a6cb8fc516b89f42/train_model.py) uses a different input and a per-class temporal row split.

The recordings came from one person. The archived CSV lacks recording and session identifiers. Tracking the retrain script’s generated rows back to CSV rows showed that 3,390 test rows had an input-row ancestor also represented in training. This counts overlap visible from the row-generation steps. It does not estimate overlap between different rows from one recording.

The archived figure generator reconstructs the displayed confusion matrix from rounded recall and support and uses synthetic scores for its ROC curves. Those figures show illustrations. Empirical confusion counts and AUC require the original predictions or a fresh run that saves them. A stronger evaluation would split by participant or recording before augmentation, preserve group IDs, fit preprocessing on training only and retain predictions with the run configuration.
