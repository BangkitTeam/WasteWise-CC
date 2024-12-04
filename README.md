<<<<<<< HEAD
1. cd nise
2. npm install
3. Create a Database in MySQL
4. Update the .env file
5. Push the Prisma Schema into Database by running "npx prisma migrate dev", it will ask you enter name of migration. You can enter any name e.g. "create_user_migration"
6. Run the server using "npm run dev"
=======
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

## API-Contract

LIST URI

- **POST /api/auth/register**
  - **response:**
  ```json:output
      {
          "id": 1,
          "username": "ikhwan535",
          "email": "ikhwan@example.com"
      }
  ```
- **POST /api/auth/login**
  - **response:**
  ```json:output
      {
        "token":
      }
  ```
- **GET /api/user**
  - **response:**
  ```json:output
      {
          "username": "ikhwan535",
          "email": "ikhwan@example.com",
          "password": "123456"
      }
  ```
- **POST /api/user/edit**

  - **response:**

  ```json:output
      {
          "message": "Settings updated successfully",
          "updatedUser": {
              "id": 2,
              "username": "myName",
              "email": "myNewEmail@example.com",
              "password": "e1a17f094e471c13458934ca5c73d4a1:2b447d51efdd50fa2cf2a9c00a26a744",
              "createdAt": "2024-11-29T12:15:49.961Z",
              "updatedAt": "2024-11-29T12:24:46.488Z"
          }
      }
  ```

- **POST /api/upload**
  - **response:**
  ```json:output
      {
          "user_id": 1,
          "image_name": "file_name.png"

      }
  ```
=======
## API-Contract
LIST URI
-  **POST /api/auth/register**
    - **response:**
    ```json:output
        {
            "id": 1,
            "username": "ikhwan535",
            "email": "ikhwan@example.com"
        }
    ```
    
-  **POST /api/auth/login**
    - **response:**
    ```json:output
        {
          "token":
        }
    ```
    
-  **GET /api/user**
    - **response:**
    ```json:output
        {
            "username": "ikhwan535",
            "email": "ikhwan@example.com",
            "password": "123456"
        }
    ```
    
-  **POST /api/user/edit**
    - **response:**
    ```json:output
        {
            "message": "Settings updated successfully",
            "updatedUser": {
                "id": 2,
                "username": "myName",
                "email": "myNewEmail@example.com",
                "password": "...",
                "createdAt": "2024-11-29T12:15:49.961Z",
                "updatedAt": "2024-11-29T12:24:46.488Z"
            }
        }
    ```

-  **POST /api/upload**
    - **response:**
    ```json:output
        {
            "message": "File uploaded successfully!",
            "file": {
                "id": 1,
                "userId": 1,
                "image_name": "1733715838459",
                "image_url": "https://storage.googleapis.com/upload-waste/... .jpeg",
                "type": "image/jpeg",
                "size": 92862,
                "description": null,
                "createdAt": "2024-11-30T05:40:34.232Z"
            }
        }
    ```
    
- **GET /api/recommends/:id**
  - **response:**
  ```json:output
      {
          "data": {
              "user_id": 1,
              "image_name": "filen_name.jpng",
              "trash_type": "trash type",
              "recommedations": [
                  {
                      "title": "recommendation title1",
                      "description": "Description..."
                  },
                  {
                      "title": "recommendation title2",
                      "description": "Description..."
                  },
              ],
          },
          "message": "Successfully get the data",
          "status": 200,
      }
  ```
- **GET ALL /api/history**
  - **response:**
  ```json:output
     {
          "data": {
              "user_id": 1,
              "histories": [
                  {
                      "image_name": "filen_name.jpng",
                      "trash_type": "trash type",
                      "created_at": "2024-11-23 08:00:00",
                  },
                  {
                      "image_name": "filen_name1.jpng",
                      "trash_type": "trash type1",
                      "created_at": "2024-11-23 09:00:00",
                  },
              ],
          },
          "message": "Successfully get the data",
          "status": 200,
      }
  ```
- **GET favorite by user_id /api/favorite**
  - **response:**
  ```json:output
      {
          "data": {
              "user_id": 1,
              "username": "name",
              "bookmarks": [
                  {
                      "title": "title here",
                      "description": "description here",
                  },
                  {
                      "title": "title here",
                      "description": "description here",
                  },
              ]
          },
          "message": "succesfully get the data",
          "status": 200,
      }
  ```
- **POST /api/favorite/add**

  - **response:**

  ```json:output
      {
          "data": {
              "user_id": 1,
              "user_recommendation_id": 1,
          },
          "message": "Succesfully added to favorite!",
          "status": 201
      }
  ```

- **POST /api/favorite/delete**
  - **response:**
  ```json:output
      {
          "message": "Succesfully delete the favorite",
          "status": 204,
      }
  ```
>>>>>>> 95e748c63b4e77392e11a0d0a95bc3c128112186
