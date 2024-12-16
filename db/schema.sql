-- Drop and recreate the database
DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

-- Connect to the created database
\c employee_tracker;

-- Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create the role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES department(id) 
    ON DELETE CASCADE
);

-- Create the employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) 
    REFERENCES role(id) 
    ON DELETE CASCADE,
    FOREIGN KEY (manager_id) 
    REFERENCES employees(id) 
    ON DELETE SET NULL
);