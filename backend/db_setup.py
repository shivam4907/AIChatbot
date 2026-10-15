"""
Database Setup Script for MySQL
Executes schema.sql and sample_data.sql into your configured MySQL database.
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
DB_NAME = os.getenv("MYSQL_DATABASE", "company_assistant_db")
DB_PORT = int(os.getenv("MYSQL_PORT", 3306))

def run_sql_file(cursor, file_path):
    print(f"Executing: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        sql = f.read()
    
    statements = sql.split(";")
    for stmt in statements:
        clean_stmt = stmt.strip()
        if clean_stmt and not clean_stmt.startswith("--"):
            try:
                cursor.execute(clean_stmt)
            except Exception as e:
                print(f"Notice during statement: {e}")

def main():
    print(f"Connecting to MySQL server at {DB_HOST}:{DB_PORT} as user '{DB_USER}'...")
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            autocommit=True
        )
        cursor = conn.cursor()
        
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        cursor.execute(f"USE {DB_NAME};")
        print(f"Database '{DB_NAME}' selected.")
        
        schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
        data_path = os.path.join(os.path.dirname(__file__), "sample_data.sql")
        
        run_sql_file(cursor, schema_path)
        run_sql_file(cursor, data_path)
        
        cursor.close()
        conn.close()
        print("Successfully initialized MySQL database with schema and sample company data!")
    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
        print("Tip: Check your MYSQL_HOST, MYSQL_USER, and MYSQL_PASSWORD in .env")

if __name__ == "__main__":
    main()
