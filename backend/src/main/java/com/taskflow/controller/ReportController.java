package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports & Export Engine", description = "Endpoints for exporting PDF, Excel (.xlsx), and CSV operational reports.")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    @Operation(summary = "Get Organization Analytics Summary", description = "Retrieves high-level analytics KPIs for executive reporting.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalyticsSummary() {
        Map<String, Object> summary = reportService.getAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.success("Analytics summary retrieved", summary));
    }

    @GetMapping("/export/excel")
    @Operation(summary = "Export Projects Portfolio to Excel (.xlsx)", description = "Generates formatted Excel spreadsheet containing project metrics.")
    public ResponseEntity<InputStreamResource> exportProjectsExcel() {
        ByteArrayInputStream stream = reportService.generateProjectsExcelReport();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=projects_portfolio.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/export/pdf")
    @Operation(summary = "Export Projects Portfolio to PDF", description = "Generates formatted PDF report containing project metrics.")
    public ResponseEntity<InputStreamResource> exportProjectsPdf() {
        ByteArrayInputStream stream = reportService.generateProjectsPdfReport();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=projects_report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export Employee Directory to CSV", description = "Generates UTF-8 encoded CSV employee export.")
    public ResponseEntity<byte[]> exportEmployeesCsv() {
        byte[] csvData = reportService.generateEmployeesCsvReport();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=employees_directory.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
