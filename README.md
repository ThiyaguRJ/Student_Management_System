Project Description:

The Student Management System allows administrators and teachers to efficiently manage student records.
It provides secure authentication, CRUD operations, image uploads, import/export features, and audit logging to track user actions.

The system demonstrates real-world features like role-based access, pagination with search, and Excel integration, making it suitable for school student data management.

Setup Instructions:

1. Clone the Repository

   git clone https://github.com/your-username/student-management-system.git
   cd student-management-system

2. Install Dependencies

   cd sms-backend
   npm install

3.Setup Environment Variables

    PORT=YYYY
    DB_HOST=YYYYY
    DB_USER=YYYYY
    DB_PASS=yourpassword
    DB_NAME=YYYYY
    JWT_SECRET=YYYY

4. Start the App

    Frontend- npm run dev
    Backend- npm start
    
Implemented Features:

  Core Features

    JWT-based authentication (Login/Signup)
    CRUD operations for students (Add, Edit, Delete, View)
    Student photo upload (Multer)
    Search & filter by name/class
    Pagination for student list
  
  Smart Features
  
    Role-Based Access Control (RBAC) – Admin vs Teacher
    Import students via Excel (.xlsx)
    Export students to Excel (.xlsx)
    Dashboard with analytics:
    Total students
    Students per class
      Gender ratio (charts)
      Audit logs (track create/update/delete actions with user & timestamp)
      Pagination + filtering combined smoothly

Screenshots:

Dashboard

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/511eab28-033e-4fff-99b5-11d851486459" />

Student Form

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/e0b67109-9287-4e80-8a67-323bb714dd4f" />

Excel Import / Export

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/d9b56b2a-f647-4a44-9282-2da25b3f579a" />

Audit Logs

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/ab3e8fd0-4c32-44cd-a517-f17f625403b4" />
