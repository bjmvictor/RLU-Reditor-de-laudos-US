import { Report } from "./report-types";

const REPORTS_STORAGE_KEY = "ultrasound_reports";

export const getReports = (): Report[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const reportsJson = localStorage.getItem(REPORTS_STORAGE_KEY);
  return reportsJson ? JSON.parse(reportsJson) : [];
};

export const saveReport = (report: Report): void => {
  if (typeof window === "undefined") {
    return;
  }
  const reports = getReports();
  reports.push(report);
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
};

export const updateReport = (updatedReport: Report): void => {
  if (typeof window === "undefined") {
    return;
  }
  let reports = getReports();
  reports = reports.map((report) =>
    report.id === updatedReport.id ? updatedReport : report
  );
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
};

export const deleteReport = (id: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  let reports = getReports();
  reports = reports.filter((report) => report.id !== id);
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
};