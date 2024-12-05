# WasteWise-CC

### 1. Navigate to the Project Folder

```bash
cd path/to/your/folder
```

### 2.Install Dependencies

```bash
npm install
```

### 3. Create a MySQL Database

### 4. Update the .env

```bash
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### 5. Apply Prisma Migrations

```bash
npx prisma migrate dev
```

### 6. Run

```bash
npm run dev
```

<br><br>

## API Endpoint Documentation
https://documenter.getpostman.com/view/39625990/2sAYBYgWGu/



- **POST /api/favorite/delete**
  - **response:**
  ```json:output
      {
          "message": "Succesfully delete the favorite",
          "status": 204,
      }
  ```
