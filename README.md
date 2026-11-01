# 🍔 Food Ordering Application — Full Stack

A modern Full Stack Food Ordering Web Application developed using **React.js, Spring Boot, Spring Security, JWT Authentication, REST APIs, and MySQL**.

The application enables users to browse food items, manage their cart, place orders, apply coupons, and manage their accounts through a responsive and user-friendly interface.

## 🚀 Key Features

### 👤 Authentication & User Management
- User registration and login
- JWT-based authentication
- Secure password management
- Role-based access control
- User profile management

### 🍕 Food Browsing
- Browse available food items
- View food details
- Search and filter food items
- Explore food categories

### 🛒 Shopping Cart
- Add food items to cart
- Update quantities
- Remove items
- Calculate cart totals

### 📦 Order Management
- Place food orders
- Manage order details
- View order history
- Support for Cash on Delivery and online payment workflows

### 🎟️ Coupons & Reviews
- Apply available coupons
- Manage discount coupons
- Submit food reviews and ratings

### 🛡️ Admin Management
- Admin service operations
- Food item management
- Order management
- User management

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML, CSS |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| Database | MySQL |
| Database Integration | Spring Data JPA, Hibernate |
| API Architecture | REST APIs |
| Tools | Git, GitHub, Postman, Maven, npm |

## 🏗️ Architecture

```text
React Frontend
      |
      v
REST API Requests
      |
      v
Spring Boot Controllers
      |
      v
Service Layer
      |
      v
Repository Layer
      |
      v
MySQL Database
```

Spring Security and JWT are used to protect authenticated API requests.

## 📁 Project Structure

```text
FOOD-STACK/
│
├── FOOD 2/                 # React frontend
├── backend/                # Spring Boot backend
│   └── src/main/
│       ├── java/com/foodapp/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── service/
│       │   └── security/
│       └── resources/
│           └── application.properties
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites
- Java version compatible with the project
- Node.js and npm
- MySQL
- Maven
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/vallurupraveenreddy/FOOD-STACK.git
cd FOOD-STACK
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE IF NOT EXISTS food_ordering_db;
```

Configure your backend database connection and JWT secret using environment variables or a secure local configuration. Do not commit real credentials.

### 3. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

### 4. Run the Frontend

In a separate Terminal:

```bash
cd "FOOD 2"
npm install
npm run dev
```

Use the local URL displayed by the development server.

## 🔄 Application Workflow

1. Users register or log in.
2. The frontend communicates with Spring Boot REST APIs.
3. Spring Security handles authentication and authorization.
4. Users browse food items and add them to the cart.
5. Users review their orders and apply coupons.
6. The backend processes order requests.
7. MySQL stores the application's persistent data.

## 🔮 Future Enhancements

- Integrated payment gateway
- Live order tracking
- Email and SMS notifications
- Personalized food recommendations
- Advanced analytics dashboard
- Cloud deployment

## 👨‍💻 Developed By

**Valluru Praveen Kumar Reddy**

B.Tech — Computer Science and Engineering  
Mohan Babu University | 2027

**GitHub:** https://github.com/vallurupraveenreddy

## 📄 Project Purpose

Developed as a full-stack learning and portfolio project to demonstrate frontend development, REST API design, authentication, backend business logic, and database integration.

---

⭐ If you find this project useful, consider starring the repository!
