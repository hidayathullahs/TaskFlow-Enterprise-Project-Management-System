package com.taskflow.service;

import java.io.ByteArrayInputStream;
import java.util.Map;

public interface ReportService {
    ByteArrayInputStream generateProjectsExcelReport();
    ByteArrayInputStream generateProjectsPdfReport();
    byte[] generateEmployeesCsvReport();
    Map<String, Object> getAnalyticsSummary();
}
