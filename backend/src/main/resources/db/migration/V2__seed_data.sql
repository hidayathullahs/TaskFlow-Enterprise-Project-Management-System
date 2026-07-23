-- TaskFlow Enterprise Project Management System
-- Enhanced Seed Data (V2__seed_data.sql)
-- Default Password for all seed users: Password@123 (BCrypt: $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a)

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Seed: roles
-- -----------------------------------------------------
INSERT INTO `roles` (`id`, `public_id`, `name`, `description`) VALUES
(1, 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'ROLE_SUPER_ADMIN', 'Super Administrator with full system-wide access and tenant management'),
(2, 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'ROLE_ADMIN', 'Enterprise Administrator managing departments, users, and global reports'),
(3, 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'ROLE_PROJECT_MANAGER', 'Project Manager overseeing project lifecycles, budgets, and team allocations'),
(4, 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'ROLE_TEAM_LEAD', 'Team Lead assigning tasks, reviewing deliverables, and tracking sprint progress'),
(5, 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'ROLE_EMPLOYEE', 'Standard Employee executing tasks, logging hours, and submitting updates'),
(6, 'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'ROLE_CLIENT', 'External Client with read-only access to specific project progress and documents')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------
-- Seed: permissions (Resource-Based)
-- -----------------------------------------------------
INSERT INTO `permissions` (`id`, `public_id`, `name`, `module`, `description`) VALUES
(1, '11111111-1111-1111-1111-111111111111', 'USER_READ', 'USER', 'View user profiles and organization directory'),
(2, '22222222-2222-2222-2222-222222222222', 'USER_CREATE', 'USER', 'Create new employee user accounts'),
(3, '33333333-3333-3333-3333-333333333333', 'USER_UPDATE', 'USER', 'Update user profiles and roles'),
(4, '44444444-4444-4444-4444-444444444444', 'USER_DELETE', 'USER', 'Soft-delete or deactivate user accounts'),
(5, '55555555-5555-5555-5555-555555555555', 'PROJECT_READ', 'PROJECT', 'View projects, timelines, and budgets'),
(6, '66666666-6666-6666-6666-666666666666', 'PROJECT_CREATE', 'PROJECT', 'Initialize new enterprise projects'),
(7, '77777777-7777-7777-7777-777777777777', 'PROJECT_UPDATE', 'PROJECT', 'Modify project parameters and statuses'),
(8, '88888888-8888-8888-8888-888888888888', 'PROJECT_DELETE', 'PROJECT', 'Archive or soft-delete projects'),
(9, '99999999-9999-9999-9999-999999999999', 'TASK_READ', 'TASK', 'View tasks, Kanban boards, and subtasks'),
(10, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TASK_CREATE', 'TASK', 'Create tasks, assign work, and set deadlines'),
(11, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TASK_UPDATE', 'TASK', 'Update task statuses, assignees, and time logs'),
(12, 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'TASK_DELETE', 'TASK', 'Soft-delete tasks'),
(13, 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'ROLE_MANAGE', 'SECURITY', 'Manage security roles and permission mappings'),
(14, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'SYSTEM_ADMIN', 'SYSTEM', 'Full system administration and global audit access')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------
-- Seed: role_permissions
-- -----------------------------------------------------
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14),
(2, 1), (2, 2), (2, 3), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13),
(3, 1), (3, 5), (3, 6), (3, 7), (3, 9), (3, 10), (3, 11), (3, 12),
(4, 1), (4, 5), (4, 9), (4, 10), (4, 11),
(5, 1), (5, 5), (5, 9), (5, 11),
(6, 5), (6, 9)
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

-- -----------------------------------------------------
-- Seed: departments
-- -----------------------------------------------------
INSERT INTO `departments` (`id`, `public_id`, `name`, `code`, `description`, `manager_id`, `status`) VALUES
(1, 'd1111111-1111-1111-1111-111111111111', 'Executive Leadership', 'EXEC', 'Corporate Strategy and Enterprise Governance', NULL, 'ACTIVE'),
(2, 'd2222222-2222-2222-2222-222222222222', 'Software Engineering', 'ENG', 'Full Stack Development, DevOps, and Cloud Infrastructure', NULL, 'ACTIVE'),
(3, 'd3333333-3333-3333-3333-333333333333', 'Product Management', 'PROD', 'Product Strategy, UX/UI Research, and Roadmaps', NULL, 'ACTIVE'),
(4, 'd4444444-4444-4444-4444-444444444444', 'Quality Assurance', 'QA', 'Automated & Manual Software Testing, Security Audits', NULL, 'ACTIVE'),
(5, 'd5555555-5555-5555-5555-555555555555', 'Human Resources', 'HR', 'Talent Acquisition, Employee Relations, and Payroll', NULL, 'ACTIVE')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------
-- Seed: users
-- -----------------------------------------------------
INSERT INTO `users` (`id`, `public_id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `status`, `is_email_verified`, `designation`, `joining_date`, `salary`, `skills`, `experience_years`, `department_id`, `reporting_manager_id`) VALUES
(1, 'u1111111-1111-1111-1111-111111111111', 'Super', 'Admin', 'superadmin@taskflow.com', '+1-555-0100', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ACTIVE', 1, 'Chief Technology Officer', '2022-01-01', 180000.00, 'Enterprise Architecture, Cloud Native, Security', 15, 1, NULL),
(2, 'u2222222-2222-2222-2222-222222222222', 'Alice', 'Morgan', 'admin@taskflow.com', '+1-555-0101', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ACTIVE', 1, 'VP of Engineering', '2022-03-15', 150000.00, 'Engineering Management, System Architecture, Agile', 12, 1, 1),
(3, 'u3333333-3333-3333-3333-333333333333', 'Robert', 'Chen', 'pm.robert@taskflow.com', '+1-555-0102', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ACTIVE', 1, 'Senior Project Manager', '2023-01-10', 120000.00, 'Scrum, PMP, Risk Management, Budgeting', 8, 3, 2),
(4, 'u4444444-4444-4444-4444-444444444444', 'David', 'Miller', 'lead.david@taskflow.com', '+1-555-0103', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ACTIVE', 1, 'Lead Full Stack Architect', '2023-02-01', 110000.00, 'Java 21, Spring Boot, React.js, MySQL, Microservices', 9, 2, 3),
(5, 'u5555555-5555-5555-5555-555555555555', 'Sarah', 'Jenkins', 'dev.sarah@taskflow.com', '+1-555-0104', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ACTIVE', 1, 'Senior Software Engineer', '2023-05-15', 95000.00, 'React, Tailwind CSS, TypeScript, REST APIs', 5, 2, 4),
(6, 'u6666666-6666-6666-6666-666666666666', 'Michael', 'Scott', 'qa.michael@taskflow.com', '+1-555-0105', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ACTIVE', 1, 'QA Automation Engineer', '2023-06-20', 85000.00, 'Selenium, JUnit 5, Postman, Cypress', 4, 4, 4)
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

UPDATE `departments` SET `manager_id` = 1 WHERE `id` = 1;
UPDATE `departments` SET `manager_id` = 2 WHERE `id` = 2;
UPDATE `departments` SET `manager_id` = 3 WHERE `id` = 3;
UPDATE `departments` SET `manager_id` = 6 WHERE `id` = 4;

-- -----------------------------------------------------
-- Seed: user_roles
-- -----------------------------------------------------
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 5)
ON DUPLICATE KEY UPDATE `user_id` = VALUES(`user_id`);

-- -----------------------------------------------------
-- Seed: teams
-- -----------------------------------------------------
INSERT INTO `teams` (`id`, `public_id`, `name`, `description`, `department_id`, `team_lead_id`, `status`) VALUES
(1, 't1111111-1111-1111-1111-111111111111', 'Core Backend Squad', 'Responsible for Java 21, Spring Boot REST services, and database scaling', 2, 4, 'ACTIVE'),
(2, 't2222222-2222-2222-2222-222222222222', 'Frontend UI/UX Squad', 'Responsible for React 18, Vite, Tailwind CSS, and UX component library', 2, 5, 'ACTIVE')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `team_members` (`team_id`, `user_id`) VALUES
(1, 4), (1, 5), (2, 5), (2, 6)
ON DUPLICATE KEY UPDATE `team_id` = VALUES(`team_id`);

-- -----------------------------------------------------
-- Seed: projects
-- -----------------------------------------------------
INSERT INTO `projects` (`id`, `public_id`, `name`, `code`, `description`, `status`, `priority`, `budget`, `actual_cost`, `start_date`, `end_date`, `deadline`, `project_manager_id`, `department_id`, `created_by`) VALUES
(1, 'p1111111-1111-1111-1111-111111111111', 'TaskFlow NextGen Modernization', 'TF-NG-001', 'Complete ground-up modernization of enterprise project workflow engine using Spring Boot 3 and React 18', 'IN_PROGRESS', 'URGENT', 250000.00, 45000.00, '2026-06-01', '2026-12-31', '2026-11-30', 3, 2, 2),
(2, 'p2222222-2222-2222-2222-222222222222', 'Cloud Security & Compliance Audit', 'TF-SEC-002', 'Comprehensive ISO 27001 audit, JWT refresh token security hardening, and vulnerability scanning', 'IN_PROGRESS', 'HIGH', 80000.00, 20000.00, '2026-07-01', '2026-09-30', '2026-09-15', 3, 4, 1)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);

-- -----------------------------------------------------
-- Seed: tasks
-- -----------------------------------------------------
INSERT INTO `tasks` (`id`, `public_id`, `project_id`, `parent_task_id`, `title`, `description`, `status`, `priority`, `start_date`, `due_date`, `estimated_hours`, `actual_hours`, `created_by`, `assignee_id`, `section`, `board_order`) VALUES
(1, 'tk111111-1111-1111-1111-111111111111', 1, NULL, 'Design Normalized MySQL Database DDL & Seed Scripts', 'Construct enterprise-ready relational schema with FK constraints, cascade rules, soft-delete, and indexes.', 'COMPLETED', 'HIGH', '2026-07-01', '2026-07-10', 16.00, 14.50, 3, 4, 'Database Architecture', 1),
(2, 'tk222222-2222-2222-2222-222222222222', 1, NULL, 'Implement Spring Security 6 & JWT Auth Pipeline', 'Build custom JWT Filter, TokenProvider, Refresh Token rotation, and BCrypt password encryption.', 'IN_PROGRESS', 'URGENT', '2026-07-11', '2026-07-25', 24.00, 18.00, 3, 4, 'Backend Core', 1),
(3, 'tk333333-3333-3333-3333-333333333333', 1, NULL, 'Construct React + Vite Design System with Tailwind & MUI', 'Establish theme provider, reusable UI components, Axios interceptors, and protected layout routing.', 'IN_PROGRESS', 'HIGH', '2026-07-15', '2026-07-28', 30.00, 12.00, 3, 5, 'Frontend UI', 2)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- -----------------------------------------------------
-- Seed: labels
-- -----------------------------------------------------
INSERT INTO `labels` (`id`, `public_id`, `name`, `color_code`) VALUES
(1, 'l1111111-1111-1111-1111-111111111111', 'Backend', '#3B82F6'),
(2, 'l2222222-2222-2222-2222-222222222222', 'Frontend', '#10B981'),
(3, 'l3333333-3333-3333-3333-333333333333', 'Security', '#EF4444'),
(4, 'l4444444-4444-4444-4444-444444444444', 'Bug', '#DC2626'),
(5, 'l5555555-5555-5555-5555-555555555555', 'Feature', '#8B5CF6')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------
-- Seed: task_label_mappings
-- -----------------------------------------------------
INSERT INTO `task_label_mappings` (`task_id`, `label_id`) VALUES
(1, 1), (2, 1), (2, 3), (3, 2), (3, 5)
ON DUPLICATE KEY UPDATE `task_id` = VALUES(`task_id`);

-- -----------------------------------------------------
-- Seed: activity_logs
-- -----------------------------------------------------
INSERT INTO `activity_logs` (`id`, `entity_type`, `entity_id`, `action`, `performed_by`, `ip_address`, `details`) VALUES
(1, 'SYSTEM', 1, 'SYSTEM_INITIALIZATION', 1, '127.0.0.1', 'TaskFlow Enterprise system schema with 15 architecture enhancements initialized'),
(2, 'PROJECT', 1, 'PROJECT_CREATED', 3, '192.168.1.50', 'Created project TaskFlow NextGen Modernization')
ON DUPLICATE KEY UPDATE `action` = VALUES(`action`);

-- -----------------------------------------------------
-- Seed: notifications
-- -----------------------------------------------------
INSERT INTO `notifications` (`id`, `public_id`, `user_id`, `title`, `message`, `type`, `is_read`, `reference_url`) VALUES
(1, 'n1111111-1111-1111-1111-111111111111', 4, 'New Task Assigned', 'You have been assigned to task: Implement Spring Security 6 & JWT Auth Pipeline', 'TASK_ASSIGNED', 0, '/tasks/tk222222-2222-2222-2222-222222222222'),
(2, 'n2222222-2222-2222-2222-222222222222', 5, 'Project Update', 'TaskFlow NextGen Modernization project roadmap updated by PM Robert Chen', 'PROJECT_UPDATED', 1, '/projects/p1111111-1111-1111-1111-111111111111')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

SET FOREIGN_KEY_CHECKS = 1;
