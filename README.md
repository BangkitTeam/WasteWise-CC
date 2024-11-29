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
##API-Contract
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
          
        }
    ```

-  **POST /api/upload**
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
            "message": "Successfully posted the data",
            "status": 201,
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
- **GET bookmarks by user_id /api/favorite**
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
- **POST /api/bookmarks/favorite**
    - **response:**
    ```json:output
        {
            "data": {
                "user_id": 1,
                "user_recommendation_id": 1,
            },
            "message": "Succesfully added to bookmarks!",
            "status": 201
        }
    ```
