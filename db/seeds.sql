-- Clear existing data
TRUNCATE employees RESTART IDENTITY CASCADE;
TRUNCATE role RESTART IDENTITY CASCADE;
TRUNCATE department RESTART IDENTITY CASCADE;

-- Insert departments
INSERT INTO department (name) VALUES
('Human Resources'),
('Sales'),
('Operations'),
('Finance'),
('Product'),
('Marketing');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
('Recruiter', 55000, 1),
('Sales Associate', 60000, 2),
('Marketing Specialist', 85000, 3),
('Accountant', 75000, 4),
('Product Manager', 120000, 5),
('Software Engineer', 140000, 6);

-- Insert employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Jane', 'Schmidt', 1, NULL),
('Valerie', 'Clark', 2, 1),
('Kent', 'Cooper', 3, NULL),
('Selena', 'Pierce', 4, 1),
('Alex', 'Hernandez', 5, 2),
('Megan', 'Baker', 6, 2);
