export type StoredReport = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
};

const STORAGE_KEY = "flowus_reports";

function readAll(): StoredReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredReport[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: StoredReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function saveReport(content: string, title?: string): StoredReport {
  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  const item: StoredReport = {
    id,
    title: (title || "Laudo") + " - " + new Date().toLocaleString(),
    content,
    createdAt: new Date().toISOString(),
  };
  const list = readAll();
  list.unshift(item);
  writeAll(list);
  return item;
}

export function listReports(): StoredReport[] {
  return readAll();
}

export function getReport(id: string): StoredReport | undefined {
  return readAll().find((r) => r.id === id);
}

export function deleteReport(id: string) {
  const list = readAll().filter((r) => r.id !== id);
  writeAll(list);
}
