# How to Access the Admin Panel

Since there is no public sign-up page, you need to manually create a user and grant them admin privileges in your Supabase project.

### Step 1: Create a User in Supabase
1.  Go to your **Supabase Dashboard**.
2.  Navigate to **Authentication** -> **Users**.
3.  Click **"Add User"**.
4.  Enter an email (e.g., `admin@prodbyosin.pl`) and a password.
5.  Click **"Create User"** (or "Invite User" effectively creates it).
    *   *Note: If you use "Invite", confirm the email. If "Create", you might need to auto-confirm it in settings or just use it if email confirmation is disabled.*

### Step 2: Login to Admin Panel
1.  Open your local app: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2.  Enter the credentials you just created.
3.  Click "Zaloguj się".

### Step 3: Grant Admin Privileges
After logging in, you will likely see a **"Brak Uprawnień"** (No Permissions) screen. This is expected.

1.  On that screen, you will see your **User ID** (a long string like `a1b2c3d4-...`).
2.  **Copy this ID.**
3.  Go back to your **Supabase Dashboard**.
4.  Navigate to the **Table Editor** (icon looking like a table/grid).
5.  Open the **`admins`** table.
6.  Click **"Insert new row"**.
7.  Paste your copied User ID into the `id` column.
8.  Click **"Save"**.

### Step 4: Access Granted
1.  Go back to your app browser tab.
2.  Refresh the page.
3.  You should now see the full **Admin Dashboard**.
