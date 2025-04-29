# Department Management API

A robust backend API built with NestJS, GraphQL, TypeORM, and PostgreSQL that allows users to manage departments and sub-departments.

## Features

- JWT Authentication
- GraphQL API with type safety
- CRUD operations for departments and sub-departments
- Input validation
- PostgreSQL database with TypeORM
- Clean architecture with proper separation of concerns

## Tech Stack

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications
- **GraphQL**: A query language for APIs
- **TypeORM**: An ORM for TypeScript and JavaScript
- **PostgreSQL**: A powerful, open-source object-relational database system
- **TypeScript**: A typed superset of JavaScript
- **JWT**: JSON Web Tokens for authentication

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Local Development

1. **Clone the repository**

```bash
git clone <repository-url>
cd department-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following environment variables:

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=departments_db
DB_SYNC=true
DB_SSL=false
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600
```

4. **Create a PostgreSQL database**

```sql
CREATE DATABASE departments_db;
```

5. **Run the application**

```bash
npm run start:dev
```

The API will be available at http://localhost:3000/graphql

### Deployment to Render.com

1. Create a new Web Service in Render.com
2. Connect your GitHub repository
3. Configure the environment variables
4. Set the build command to `npm install && npm run build`
5. Set the start command to `npm run start:prod`
6. Deploy the application

## API Documentation

### Authentication

#### Login

```graphql
mutation {
  login(input: { username: "admin", password: "admin123" }) {
    accessToken
    user {
      id
      username
    }
  }
}
```

By default, the application seeds an admin user with the following credentials:

- Username: admin
- Password: admin123

### Department Management

#### Create Department

```graphql
mutation {
  createDepartment(
    input: {
      name: "Finance"
      subDepartments: [{ name: "Accounts" }, { name: "Audit" }]
    }
  ) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

#### Get All Departments

```graphql
query {
  departments {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

#### Get Department by ID

```graphql
query {
  department(id: 1) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

#### Update Department

```graphql
mutation {
  updateDepartment(input: { id: 1, name: "Finance Department" }) {
    id
    name
  }
}
```

#### Delete Department

```graphql
mutation {
  deleteDepartment(id: 1)
}
```

### Sub-Department Management

#### Create Sub-Department

```graphql
mutation {
  createSubDepartment(departmentId: 1, input: { name: "Treasury" }) {
    id
    name
  }
}
```

#### Get Sub-Department by ID

```graphql
query {
  subDepartment(id: 1) {
    id
    name
    department {
      id
      name
    }
  }
}
```

#### Update Sub-Department

```graphql
mutation {
  updateSubDepartment(input: { id: 1, name: "Treasury Management" }) {
    id
    name
  }
}
```

#### Delete Sub-Department

```graphql
mutation {
  deleteSubDepartment(id: 1)
}
```

## Pagination 

```graphql
query {
  departments(skip: 0, take: 5) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

## License

This project is authored by Olajide AbdulQahar and licensed under the MIT License.
