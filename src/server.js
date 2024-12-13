// Import modules
import inquirer from 'inquirer';
import { pool } from './connections.js';

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
