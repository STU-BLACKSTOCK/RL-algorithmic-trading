import numpy as np


def cumulative_return(initial, final):
    return (final - initial) / initial


def annualized_return(initial, final, days):
    return (final / initial) ** (252 / days) - 1


def annualized_volatility(returns):
    return np.std(returns) * np.sqrt(252)


def sharpe_ratio(returns, risk_free_rate=0.02):

    excess_returns = (
        returns - risk_free_rate / 252
    )

    std = np.std(excess_returns)

    if std == 0:
        return 0

    return (
        np.mean(excess_returns)
        / std
    ) * np.sqrt(252)


def max_drawdown(portfolio_values):

    portfolio_values = np.array(
        portfolio_values
    )

    running_max = np.maximum.accumulate(
        portfolio_values
    )

    drawdown = (
        portfolio_values -
        running_max
    ) / running_max

    return np.min(drawdown)