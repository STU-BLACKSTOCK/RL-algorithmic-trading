# Training Guide — RL Algorithmic Trading

## Why PPO v7 (single-stock) instead of MultiStock v1?

| | PPO v7 (AAPL only) | MultiStock v1 |
|---|---|---|
| **Training data** | One consistent market (AAPL) | Random AAPL / MSFT / GOOGL each episode |
| **Learning difficulty** | Easier — stable patterns | Harder — regime switches every reset |
| **Typical behavior** | Mix of BUY, SELL, HOLD | Often collapses to **100% HOLD** |
| **Why HOLD dominates in MultiStock** | — | Safe action when switching stocks; 300k steps is not enough; normalized features differ per ticker |
| **Return (test)** | ~+13.8% | ~0% (no trades) |
| **Max drawdown** | ~-8% | 0% (never trades) |
| **Production choice** | **Deployed** — active signals + lower risk | Research only |

**PPO v1** (legacy) achieved ~+44.7% return but **-33% drawdown** — too risky for the demo API.

**v7** balances modest returns with capital preservation and produces **diverse trading actions**, which is what you want in a capstone demo.

---

## Prerequisites

From project root `RL-algorithmic-trading/`:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Ensure data exists under `data/train/`, `data/validation/`, `data/test/`.

If not, run the pipeline:

```powershell
cd src
python download_data.py
python preprocess_data.py
python prepare_dataset.py
cd ..
```

---

## Step 1 — Train the production model (ppo_aapl_v7)

```powershell
# From project root (recommended)
python src/train_improved.py
```

**What it does:**
- Trains PPO on **AAPL train split** only
- Validates on **AAPL validation split** every 10,000 steps
- Saves best checkpoint → `models/best/`
- Saves final model → `models/ppo_aapl_v7/` (used by FastAPI backend)
- Logs to `logs/tensorboard/`

**Training time:** ~15–45 min depending on CPU/GPU (500,000 timesteps).

**Monitor with TensorBoard:**

```powershell
tensorboard --logdir logs/tensorboard
```

Open http://localhost:6006

---

## Step 2 — Evaluate all models (feeds Analytics page)

```powershell
c
```

Writes `results/analytics_metrics.json` — consumed by `GET /api/analytics`.

---

## Step 3 — (Optional) Train MultiStock for comparison

```powershell
python src/train_multistock_improved.py
```

Saves to `models/ppo_multistock_v1/`. Re-run `evaluate_all_models.py` to compare.

Expect mostly HOLD unless you increase timesteps to 1M+.

---

## Step 4 — Run the full stack

**Terminal 1 — Backend** (from project root):

```powershell
uvicorn backend.app:app --reload
```

**Terminal 2 — Frontend**:

```powershell
cd frontend
npm run dev
```

- API: http://127.0.0.1:8000
- UI: http://localhost:5173
- Analytics: http://127.0.0.1:8000/api/analytics

---

## File reference

| File | Purpose |
|------|---------|
| `src/train_improved.py` | **Main training** → `models/ppo_aapl_v7` |
| `src/train_multistock_improved.py` | Optional multi-ticker training |
| `src/evaluate_all_models.py` | Generates analytics JSON |
| `src/evaluate.py` | Single-model AAPL evaluation + equity plot |
| `backend/services/model_service.py` | Inference (fixed cash/position ratios) |
| `results/analytics_metrics.json` | Live metrics for frontend |

---

## Git commands (run yourself)

```powershell
cd c:\project\rl-algorithmic-trading\RL-algorithmic-trading

git add backend/ src/ TRAINING.md results/

git commit -m "Fix inference observation, paths, DB init, and add improved training pipeline." -m "Add train_improved.py with validation callback, evaluate_all_models.py, /api/analytics endpoint, and TRAINING.md explaining v7 vs MultiStock."

git push origin main
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Model not found` on API | Run `python src/train_improved.py` |
| Predictions always HOLD | Retrain with `train_improved.py`; check observation ratios are fixed |
| Analytics shows fallback data | Run `python src/evaluate_all_models.py` after training |
| `FileNotFoundError` for CSV | Run from project root; paths now use absolute paths |
| MultiStock only HOLD | Expected at 300k steps — use single-stock model for production |
