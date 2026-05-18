<?php
try {
    $db = new PDO('mysql:host=localhost', 'root', '');
    $db->exec('CREATE DATABASE IF NOT EXISTS laravel_portfolio');
    echo "Database created successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
