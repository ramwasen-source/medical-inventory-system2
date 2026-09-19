# Medical Inventory Management System

This is a simple web-based Medical Inventory Management System.

The purpose of the system is to manage medical supplies and equipment. Users can log in, add and manage inventory items, issue medical supplies, and view a simple inventory report.

The frontend is built using ReactJS and Ant Design. The backend uses ExpressJS and provides the RESTful API. Microsoft SQL Server is used for storing the application data.

---

## Technical Requirements

* ReactJS
* Ant Design
* ExpressJS
* Microsoft SQL Server
* RESTful API
* Git
* GitHub

---

## Features

* User Login
* Dashboard
* Inventory Management
* Create Inventory Items
* Retrieve Inventory Items
* Update Inventory Items
* Delete Inventory Items
* Search Inventory
* Filter Inventory by Type
* Issue Medical Supplies
* Automatic Inventory Quantity Deduction
* Recently Issued Items
* Inventory Statistics
* Simple Inventory Report
* Print Inventory Report

---

## Default Test Login

Use the following account to test the application:

```text
Username: admin
Password: Admin123!
```

---

# How to Run the Project

## 1. Prerequisites

Before running the project, make sure you have the following installed:

* Node.js
* Microsoft SQL Server
* SQL Server Management Studio (SSMS)
* Git
* Visual Studio Code (VS Code)
* A web browser

---

## 2. Clone the Project

Open **VS Code** and go to:

**Terminal → New Terminal**

Run:

```bash
git clone https://github.com/ramwasen-source/medical-inventory-system2.git
```
to inside the folder drag the mouse in the current folder/path and click ctrl+left click
Go inside the project folder:


```bash
cd Medical-Inventory-System2
```

---

## 3. Install Frontend Dependencies

Inside the project folder, run:

```bash
npm install
```

This will install the required ReactJS and frontend dependencies.

---

## 4. Install Backend Dependencies

Go to the backend folder:

```bash
cd backend
```

Run:

```bash
npm install
```

This will install the required backend dependencies.


# 5. Set Up the SQL Server Database

Open **SQL Server Management Studio (SSMS)**.

### Connect to SQL Server

For the initial connection, use:

```text
Server name: localhost
Authentication: Windows Authentication
```

### Enable SQL Server Authentication

If SQL Server Authentication is not enabled:

1. Right-click the SQL Server in **Object Explorer**.
2. Click **Properties**.
3. Select **Security**.
4. Select **SQL Server and Windows Authentication mode**.
5. Click **OK**.
6. Restart SQL Server if necessary.

### Enable the `sa` Account

1. Expand **Security**.
2. Expand **Logins**.
3. Right-click **sa**.
4. Select **Properties**.
5. Set a password for the `sa` account.
6. Make sure the account is enabled.
7. Click **OK**.

Reconnect to SQL Server using:

```text
Authentication: SQL Server Authentication
Login: sa
Password: Your SQL Server password
```

### Create the Inventory Database

1. Right-click **Databases**.
2. Click **New Database...**
3. Enter:

```text
Inventory
```

4. Leave the other settings unchanged.
5. Click **OK**.

You should now see:

```text
Databases
├── ...
├── Inventory
└── ...
```

Expand the `Inventory` database:

```text
Inventory
├── Database Diagrams
├── Tables
├── Views
└── ...
```

At this point, the empty `Inventory` database has been created.

### Run the Database Script

The project contains a file named:

```text
script.sql
```

Open `script.sql` in SQL Server Management Studio.

Select the **Inventory** database from the database dropdown.

Click **Execute** or press **F5**.

The script will create the required tables, including:

* `InventoryItems`
* `InventoryTransactions`

### Configure the Database Password

The backend uses the `DB_PASSWORD` environment variable for the SQL Server password.

Inside the `backend` folder, create a file named:

```text
.env
```

Add:

```env
DB_PASSWORD=YOUR_SQL_SERVER_PASSWORD
```

Replace `YOUR_SQL_SERVER_PASSWORD` with the password of your `sa` account.

**Do not upload the `.env` file or your SQL Server password to GitHub.**

---

# 6. Start the Backend

Open a terminal in VS Code.
 and 
Go to the project folder:

```bash
cd Medical-Inventory-System
```

Then go to the backend folder:

```bash
cd backend
```
Inside backend create `.env`:
backend/.env

Add:
DB_PASSWORD=YOUR_SQL_SERVER_PASSWORD
JWT_SECRET=medical_inventory_secret_2026

Run:

```bash
node server.js
```

If the backend starts correctly, you should see:

```text
Server running on http://localhost:5000
```

The backend API is available at:

```text
http://localhost:5000
```

Keep this terminal running.

---

# 7. Start the Frontend

Open another terminal in VS Code.

Go to the main project folder:

```bash
cd Medical-Inventory-System
```

Run:

```bash
npm run dev
```

Vite will show a local address in the terminal, for example:

```text
http://localhost:5173
```

Copy the local address and open it in your web browser.

The Medical Inventory Management System should now be running.

---

# How to Test the Application

## 1. Login

1. Open the application in your browser.
2. Enter the default login credentials:

```text
Username: admin
Password: Admin123!
```

3. Click **Login**.
4. Check if the Dashboard opens.

---

## 2. Create

1. Go to **Inventory**.
2. Click **Add Item**.
3. Enter the item information.
4. Click **Save**.
5. Check if the item appears in the inventory table.

---

## 3. Retrieve

1. Open **Inventory**.
2. Check if the inventory records are displayed.
3. Use the search and filter functions.

---

## 4. Update

1. Select an inventory item.
2. Click **Edit**.
3. Change the information.
4. Save the changes.
5. Check if the information was updated.



## 5. Delete

1. Select an inventory item.
2. Click **Delete**.
3. Confirm the deletion.
4. Check if the item was removed.


## 6. Issue Inventory

1. Select an item with available quantity.
2. Click **Issue**.
3. Enter the quantity to issue.
4. Confirm the issue.
5. Check if the inventory quantity was reduced.

The system should not allow a quantity greater than the available stock.

The issued item should also appear in the **Recently Issued Items** section.

---

## 7. Report

1. Open the **Dashboard**.
2. Check the Inventory Report.
3. Use the search or filter if needed.
4. Click **Print Report**.

---

# REST API

The application uses RESTful API endpoints for communication between the frontend and backend.

| Method | Endpoint                       | Purpose                |
| ------ | ------------------------------ | ---------------------- |
| POST   | `/api/auth/login`              | User login             |
| GET    | `/api/inventory`               | Retrieve inventory     |
| POST   | `/api/inventory`               | Create inventory       |
| PUT    | `/api/inventory/:id`           | Update inventory       |
| DELETE | `/api/inventory/:id`           | Delete inventory       |
| PUT    | `/api/inventory/:id/issue`     | Issue inventory        |
| GET    | `/api/inventory/recent-issues` | Retrieve recent issues |

---

# Challenges Encountered

### 1. SQL Server Connection

One challenge I encountered was connecting the ExpressJS backend to Microsoft SQL Server. I had to make sure that the server, database, and connection settings were properly configured so the application could successfully connect to the database.

### 2. RESTful API Connection

Another challenge was connecting the ReactJS frontend to the ExpressJS backend using RESTful API requests. I had to make sure that the frontend was sending the correct requests and that the backend was returning the expected data.

### 3. Debugging

During development, I encountered different issues involving API routes, database connections, and frontend requests. I had to use the browser console, backend terminal, and SQL Server to identify the problems and find the appropriate solutions.

### 4. Inventory Issue Feature

Implementing the Issue feature was another challenge. I had to make sure that when an item was issued, the available inventory quantity was properly reduced and the transaction was also saved in the database.

### 5. CRUD Operations

Implementing the Create, Retrieve, Update, and Delete functions was also a challenge. I had to create the appropriate API routes and database queries and make sure that each operation worked correctly with the frontend.

### 6. GitHub Integration

Another challenge I encountered was linking the project to GitHub. GitHub required several steps to properly connect the local project to the repository. I had to learn how to connect VS Code to Git using Git commands, initialize the repository, add and commit the files, connect it to the GitHub repository, and push the changes.

This was also my first time working with Git commands, so I had to troubleshoot some issues while setting it up.

### 7. Testing the Project
Implementing the testing phase is very challenging. Following the instruction using only the readme.md is quite challenging. I have encountered a lot of bugs and error that needed tobe address so that other user can finally test the product without having any problem.

