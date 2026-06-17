import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import type { HistoryItem, HistorySortField, SortDirection } from "../types/history";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import ErrorState, { EmptyState } from "../components/ui/ErrorState";
import SignalBadge from "../components/ui/SignalBadge";
import Pagination from "../components/ui/Pagination";
import { IconSearch, IconRefresh } from "../components/icons";
import { ITEMS_PER_PAGE } from "../constants";
import { formatDate } from "../utils/formatters";
import { filterHistory, sortHistory, paginate, getTotalPages } from "../utils/pagination";

function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<HistorySortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<HistoryItem[]>("/history");
      setHistory(response.data);
    } catch (err) {
      setError("Unable to load prediction history.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const processedHistory = useMemo(() => {
    const filtered = filterHistory(history, search);
    return sortHistory(filtered, { field: sortField, direction: sortDirection });
  }, [history, search, sortField, sortDirection]);

  const paginatedHistory = useMemo(
    () => paginate(processedHistory, currentPage, ITEMS_PER_PAGE),
    [processedHistory, currentPage]
  );

  const totalPages = getTotalPages(processedHistory.length, ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortField, sortDirection]);

  const handleSort = (field: HistorySortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortIndicator = (field: HistorySortField) => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Prediction History" subtitle="Track all past RL trading signals" />
        <Loader text="Loading history..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Prediction History" subtitle="Track all past RL trading signals" />
        <ErrorState message={error} onRetry={fetchHistory} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="Prediction History"
        subtitle="Search, sort, and review all past RL trading predictions"
      />

      <Card>
        <div className="toolbar">
          <div className="toolbar__search form-group">
            <label className="form-label" htmlFor="history-search">Search</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                <IconSearch size={16} />
              </span>
              <input
                id="history-search"
                className="form-input"
                style={{ paddingLeft: "36px", width: "100%" }}
                placeholder="Search by ticker, action, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn--secondary" onClick={fetchHistory}>
            <IconRefresh size={16} />
            Refresh
          </button>
        </div>

        {processedHistory.length === 0 ? (
          <EmptyState
            title={search ? "No matching predictions" : "No predictions yet"}
            message={search ? "Try adjusting your search query." : "Run a prediction to see history here."}
          />
        ) : (
          <>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort("id")}>
                      ID{sortIndicator("id")}
                    </th>
                    <th className="sortable" onClick={() => handleSort("ticker")}>
                      Ticker{sortIndicator("ticker")}
                    </th>
                    <th className="sortable" onClick={() => handleSort("action")}>
                      Action{sortIndicator("action")}
                    </th>
                    <th className="sortable" onClick={() => handleSort("created_at")}>
                      Timestamp{sortIndicator("created_at")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistory.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                        #{item.id}
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                        {item.ticker}
                      </td>
                      <td>
                        <SignalBadge action={item.action} showLabel={false} />
                        <span style={{ marginLeft: "8px", fontSize: "var(--text-sm)" }}>
                          {item.action.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={processedHistory.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default History;
