// Import modules
import inquirer from 'inquirer';
import { pool } from './connection.js';

// Helper function for running parameterized SQL queries
function query(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, res) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

// Reusable helper for dynamic choice prompts
const promptWithChoices = async (message, choices) => {
    const { selected } = await inquirer.prompt({
        type: 'list',
        name: 'selected',
        message,
        choices
    });
    return selected;
};

// Reusable helper functions for database queries
const getDepartments = async () => await query('SELECT * FROM department');
const getRoles = async () => await query('SELECT * FROM role');
const getEmployees = async () => await query('SELECT * FROM employees');

// Main function to start the application
// View all departments
const viewDepartments = async () => {
    const res = await getDepartments();
    console.table(res.rows);
    await mainMenu();
};

// View all roles
const viewRoles = async () => {
    const res = await getRoles();
    console.table(res.rows);
    await mainMenu();
};

// View all employees with detailed information
// Assigned aliases to columns for better readability
const viewEmployees = async () => {
    const res = await query(`
        SELECT e.id, e.first_name, e.last_name, 
               r.title AS job_title, d.name AS department_name, 
               r.salary, 
               m.first_name AS manager_first_name, m.last_name AS manager_last_name
        FROM employees e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        LEFT JOIN employees m ON e.manager_id = m.id
    `);
    console.table(res.rows);
    await mainMenu();
};

// Add a new department
const addDepartment = async () => {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the department name:'
    });
    await query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log('Department added!');
    await mainMenu();
};

// Add a new role
const addRole = async () => {
    const departments = await getDepartments();
    const { title, salary } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the role salary:' }
    ]);
    const department_id = await promptWithChoices('Select the department:', departments.rows.map(dept => ({
        name: dept.name,
        value: dept.id
    })));
    await query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log('Role added!');
    await mainMenu();
};

// Add a new employee
const addEmployee = async () => {
    const roles = await getRoles();
    const employees = await getEmployees();
    const { first_name, last_name } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'Enter the employee\'s first name:' },
        { type: 'input', name: 'last_name', message: 'Enter the employee\'s last name:' }
    ]);
    const role_id = await promptWithChoices('Select the employee\'s role:', roles.rows.map(role => ({
        name: role.title,
        value: role.id
    })));
    const manager_id = await promptWithChoices('Select the employee\'s manager (or leave blank if none):', [
        ...employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        })),
        { name: 'None', value: null }
    ]);
    await query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log('Employee added!');
    await mainMenu();
};
// Update an employee's role
const updateEmployeeRole = async () => {
    const employees = await getEmployees();
    const roles = await getRoles();
    const employee_id = await promptWithChoices('Select the employee to update:', employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    })));
    const role_id = await promptWithChoices('Select the new role:', roles.rows.map(role => ({
        name: role.title,
        value: role.id
    })));
    await query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Employee role updated!');
    await mainMenu();
};

// Define main menu options with corresponding actions
const mainMenuOptions = {
    'View all departments': viewDepartments,
    'View all roles': viewRoles,
    'View all employees': viewEmployees,
    'Add a department': addDepartment,
    'Add a role': addRole,
    'Add an employee': addEmployee,
    'Update an employee role': updateEmployeeRole,
    'Exit': () => {
        console.log('Bye!');
        process.exit();
    }
};

// Main menu function
const mainMenu = async () => {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: Object.keys(mainMenuOptions),
    });
    await mainMenuOptions[action]();
};

// Start the application
mainMenu();