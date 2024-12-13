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
