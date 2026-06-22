# Project Development Phases

This document records the step-by-step development history of the RL Algorithmic Trading capstone project.

> The main [README](../README.md) covers setup, usage, and deployment. This file is the development log.

---

# Phase 1 – Project Setup

* Initialized Git repository
* Created project structure
* Configured Python virtual environment
* Installed RL, ML, and data processing dependencies

---

# Phase 2 – Data Collection

* Downloaded historical stock market data using Yahoo Finance
* Collected data for AAPL, MSFT, GOOGL
* Stored raw OHLCV data

---

# Phase 3 – Data Preprocessing

* Cleaned historical stock data
* Handled missing values
* Created engineered features
* Generated technical indicators (SMA, EMA, RSI, MACD, Returns)

---

# Phase 4 – Dataset Preparation

* Normalized features using MinMaxScaler
* Created train / validation / test splits
* Saved scalers for reproducibility

---

# Phase 5 – Trading Environment Development

Built a custom Gymnasium trading environment with portfolio simulation, transaction costs, and 5 discrete actions (HOLD, BUY 25%, BUY 100%, SELL 25%, SELL 100%).

---

# Phase 6 – Environment Validation

* Tested observation and action spaces
* Passed Stable-Baselines3 environment checker

---

# Phase 7 – PPO Agent Training

* Implemented PPO with MLP policy
* TensorBoard monitoring

---

# Phase 8 – Evaluation Engine

* Portfolio metrics: return, Sharpe, drawdown, volatility
* Equity curve generation

---

# Phase 9 – Benchmark Comparison

* Buy-and-hold vs PPO agent

---

# Phase 10 – Reward Engineering

* Portfolio return rewards, drawdown penalties, transaction cost effects

---

# Phase 11 – Advanced Trading Actions

* Expanded from 3 actions to 5 fractional buy/sell actions

---

# Phase 12 – Multi-Stock Experiments

* MultiStockTradingEnv across AAPL, MSFT, GOOGL

---

# Phase 13 – Model Comparison

* Compared PPO v1, v7, and MultiStock variants

---

# Phase 14 – Project Refactoring

* Separated training, evaluation, backend services

---

# Phase 15 – FastAPI Backend

* REST API for model info, predictions, stock analysis, dashboard, history

---

# Phase 16 – React Frontend

* Dashboard, Prediction, Model Info, Analytics, Stock Analysis, History pages

---

# Phase 17 – Database Integration

* SQLite prediction history persistence

---

# Phase 18 – Capstone Integration (Final)

* UI polish — clean fintech-style layout
* Paper trading simulation (PPO backtest over test data)
* Portfolio management view tied to paper trading sessions
* SQLite tables for paper trading sessions and trade logs
* Deployment-ready config (Render + Vercel)
* README restructure

See [TRAINING.md](../TRAINING.md) for model training instructions.
