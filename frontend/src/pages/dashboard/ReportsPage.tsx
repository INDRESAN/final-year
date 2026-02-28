import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download, Filter, Calendar, FileText, Shield, UserPlus, LogIn, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import { type AuditLog } from "@/data/mockData";
import api from "@/api/client";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

const eventTypeConfig: Record<AuditLog["eventType"], { icon: React.ElementType; label: string; color: string }> = {
  enrollment: { icon: UserPlus, label: "Enrollment", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  recognition: { icon: Shield, label: "Recognition", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  audit: { icon: FileText, label: "Audit", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  login: { icon: LogIn, label: "Login", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  tampering_detected: { icon: AlertTriangle, label: "Tampering", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const statusStyles: Record<AuditLog["status"], string> = {
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
};

const ReportsPage = () => {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports/tampering');
        if (response.data.success) {
          // Map the Python backend report format to the AuditLog format
          const mappedLogs: AuditLog[] = response.data.report.map((item: any, index: number) => ({
            id: `LOG-${1000 + index}`,
            timestamp: item.timestamp,
            eventType: item.status === 'TAMPERED' ? 'tampering_detected' : 'audit',
            userName: item.username,
            details: item.details,
            status: item.status === 'CLEAN' ? 'success' : item.status === 'TAMPERED' ? 'error' : 'warning'
          }));

          // Sort by timestamp descending
          mappedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setLogs(mappedLogs);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (search) {
        const q = search.toLowerCase();
        if (!log.userName.toLowerCase().includes(q) && !log.details.toLowerCase().includes(q) && !log.id.includes(q))
          return false;
      }
      if (eventFilter !== "all" && log.eventType !== eventFilter) return false;
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      if (dateFrom && isBefore(new Date(log.timestamp), startOfDay(dateFrom))) return false;
      if (dateTo && isAfter(new Date(log.timestamp), endOfDay(dateTo))) return false;
      return true;
    });
  }, [search, eventFilter, statusFilter, dateFrom, dateTo]);

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedLogs = filtered.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const exportCSV = () => {
    const headers = ["ID", "Timestamp", "Event Type", "User", "Details", "Status"];
    const rows = filtered.map((l) => [
      l.id,
      format(new Date(l.timestamp), "yyyy-MM-dd HH:mm:ss"),
      l.eventType,
      l.userName,
      `"${l.details}"`,
      l.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setEventFilter("all");
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  };

  const hasFilters = search || eventFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Logs</h1>
          <p className="text-muted-foreground">View activity logs and export reports</p>
        </div>
        <Button onClick={exportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, details, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="enrollment">Enrollment</SelectItem>
            <SelectItem value="recognition">Recognition</SelectItem>
            <SelectItem value="audit">Audit</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="tampering_detected">Tampering</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              {dateFrom ? format(dateFrom, "MMM d") : "From"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarWidget mode="single" selected={dateFrom} onSelect={setDateFrom} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              {dateTo ? format(dateTo, "MMM d") : "To"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarWidget mode="single" selected={dateTo} onSelect={setDateTo} />
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </motion.div>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {(safeCurrentPage - 1) * pageSize + 1}–{Math.min(safeCurrentPage * pageSize, filtered.length)} of {filtered.length} logs
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[130px]">Event</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Loading reports...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No logs match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log, i) => {
                const cfg = eventTypeConfig[log.eventType];
                const Icon = cfg.icon;
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.userName}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[300px] truncate">{log.details}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[log.status]}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {safeCurrentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
              .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`e-${idx}`} className="px-1 text-muted-foreground">…</span>
                ) : (
                  <Button
                    key={item}
                    variant={item === safeCurrentPage ? "default" : "outline"}
                    size="sm"
                    className="w-9"
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </Button>
                )
              )}
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
