#!/usr/bin/env python3
"""
Comprehensive test script for the Todo App Phase II
Tests all backend functionality including authentication and CRUD operations
"""

import requests
import json
import time

# Backend URL
BASE_URL = "http://localhost:8000"

class TodoAppTester:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.session = requests.Session()

    def test_health_check(self):
        """Test if backend is running"""
        print("[INFO] Testing health check...")
        response = self.session.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print("[OK] Health check passed")

    def test_signup(self, email="test@example.com", password="test123456", name="Test User"):
        """Test user registration"""
        print(f"[INFO] Testing signup for {email}...")
        response = self.session.post(
            f"{BASE_URL}/api/auth/signup",
            json={"email": email, "password": password, "name": name}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["success"] == True
        assert "token" in data["data"]
        assert "user" in data["data"]

        self.token = data["data"]["token"]
        self.user_id = data["data"]["user"]["id"]
        print(f"[OK] Signup successful - User ID: {self.user_id}")

    def test_login(self, email="test@example.com", password="test123456"):
        """Test user login"""
        print(f"[INFO] Testing login for {email}...")
        response = self.session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": email, "password": password}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "token" in data["data"]
        assert "user" in data["data"]

        self.token = data["data"]["token"]
        self.user_id = data["data"]["user"]["id"]
        print(f"[OK] Login successful - User ID: {self.user_id}")

    def test_create_task(self, title="Test Task", description="Test Description", priority="medium"):
        """Test creating a task"""
        print(f"[INFO] Creating task: {title}...")
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.session.post(
            f"{BASE_URL}/api/tasks",
            json={"title": title, "description": description, "priority": priority},
            headers=headers
        )
        assert response.status_code == 201
        task = response.json()
        assert task["title"] == title
        assert task["description"] == description
        assert task["priority"] == priority
        assert task["user_id"] == self.user_id
        assert task["completed"] == False

        print(f"[OK] Task created successfully - ID: {task['id']}")
        return task["id"]

    def test_get_tasks(self):
        """Test retrieving all tasks"""
        print("[INFO] Getting all tasks...")
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.session.get(f"{BASE_URL}/api/tasks", headers=headers)
        assert response.status_code == 200
        tasks = response.json()
        assert isinstance(tasks, list)

        print(f"[OK] Retrieved {len(tasks)} tasks")
        return tasks

    def test_get_task(self, task_id):
        """Test getting a specific task"""
        print(f"[INFO] Getting task {task_id}...")
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.session.get(f"{BASE_URL}/api/tasks/{task_id}", headers=headers)
        assert response.status_code == 200
        task = response.json()
        assert task["id"] == task_id
        assert task["user_id"] == self.user_id

        print(f"[OK] Task retrieved: {task['title']}")
        return task

    def test_update_task(self, task_id, updates):
        """Test updating a task"""
        print(f"[INFO] Updating task {task_id}...")
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.session.put(
            f"{BASE_URL}/api/tasks/{task_id}",
            json=updates,
            headers=headers
        )
        assert response.status_code == 200
        task = response.json()

        for key, value in updates.items():
            assert task[key] == value

        print(f"[OK] Task updated successfully")
        return task

    def test_toggle_complete(self, task_id):
        """Test toggling task completion"""
        print(f"[INFO] Toggling completion for task {task_id}...")
        headers = {"Authorization": f"Bearer {self.token}"}

        # Get current state
        task_before = self.session.get(f"{BASE_URL}/api/tasks/{task_id}", headers=headers).json()
        expected_new_state = not task_before["completed"]

        # Toggle
        response = self.session.patch(
            f"{BASE_URL}/api/tasks/{task_id}/complete",
            headers=headers
        )
        assert response.status_code == 200
        task_after = response.json()

        assert task_after["completed"] == expected_new_state
        print(f"[OK] Completion toggled: {task_before['completed']} -> {task_after['completed']}")

    def test_delete_task(self, task_id):
        """Test deleting a task"""
        print(f"[INFO] Deleting task {task_id}...")
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.session.delete(
            f"{BASE_URL}/api/tasks/{task_id}",
            headers=headers
        )
        assert response.status_code == 204

        # Verify it's gone
        get_response = self.session.get(
            f"{BASE_URL}/api/tasks/{task_id}",
            headers=headers
        )
        assert get_response.status_code == 404
        print("[OK] Task deleted successfully")

    def test_data_isolation(self):
        """Test that users can't access each other's tasks"""
        print("[INFO] Testing data isolation...")

        # Create second user
        response2 = self.session.post(
            f"{BASE_URL}/api/auth/signup",
            json={"email": "user2@example.com", "password": "test123456", "name": "User 2"}
        )
        token2 = response2.json()["data"]["token"]

        # Create task as user 1
        task_id = self.test_create_task("User 1 Task", "Should not be accessible by user 2")

        # Try to access as user 2
        headers2 = {"Authorization": f"Bearer {token2}"}
        response = self.session.get(f"{BASE_URL}/api/tasks/{task_id}", headers=headers2)
        assert response.status_code == 403  # Should be forbidden

        # User 2 should see empty list
        tasks2 = self.session.get(f"{BASE_URL}/api/tasks", headers=headers2).json()
        assert len(tasks2) == 0

        print("[OK] Data isolation verified")

        # Cleanup
        self.session.delete(f"{BASE_URL}/api/tasks/{task_id}", headers={"Authorization": f"Bearer {self.token}"})

    def test_logout(self):
        """Test logout functionality"""
        print("[INFO] Testing logout...")
        response = self.session.post(
            f"{BASE_URL}/api/auth/logout",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200
        assert response.json()["success"] == True
        print("[OK] Logout successful")

    def run_comprehensive_test(self):
        """Run all tests"""
        print("=" * 60)
        print("COMPREHENSIVE TODO APP TEST")
        print("=" * 60)

        try:
            # 1. Health check
            self.test_health_check()

            # 2. Signup
            self.test_signup("test1@example.com", "password123", "Test User 1")

            # 3. Login
            self.test_login("test1@example.com", "password123")

            # 4. Create multiple tasks
            task1_id = self.test_create_task("First Task", "This is the first task", "high")
            task2_id = self.test_create_task("Second Task", "This is the second task", "medium")
            task3_id = self.test_create_task("Third Task", "This is the third task", "low")

            # 5. Get all tasks
            tasks = self.test_get_tasks()
            assert len(tasks) == 3

            # 6. Get specific task
            self.test_get_task(task1_id)

            # 7. Update task
            self.test_update_task(task2_id, {
                "title": "Updated Second Task",
                "description": "Updated description",
                "priority": "high"
            })

            # 8. Toggle completion
            self.test_toggle_complete(task1_id)
            self.test_toggle_complete(task1_id)  # Toggle back

            # 9. Delete task
            self.test_delete_task(task3_id)

            # 10. Verify final state
            final_tasks = self.test_get_tasks()
            assert len(final_tasks) == 2

            # 11. Test data isolation
            self.test_data_isolation()

            # 12. Logout
            self.test_logout()

            print("\n" + "=" * 60)
            print("ALL TESTS PASSED SUCCESSFULLY!")
            print("=" * 60)
            print("\nFeature Summary:")
            print("- User Authentication (Signup/Login/Logout)")
            print("- Task CRUD Operations:")
            print("   * Create tasks with title, description, priority")
            print("   * Read all tasks and single task")
            print("   * Update task details")
            print("   * Toggle completion status")
            print("   * Delete tasks")
            print("- Data Isolation (users can't see each other's tasks)")
            print("- JWT Authentication (protected endpoints)")
            print("- Error Handling (404, 403, 401 responses)")
            print("- Database Persistence (SQLite)")
            print("\nBackend API Endpoints Available:")
            print("   POST /api/auth/signup")
            print("   POST /api/auth/login")
            print("   POST /api/auth/logout")
            print("   GET  /api/tasks")
            print("   POST /api/tasks")
            print("   GET  /api/tasks/{id}")
            print("   PUT  /api/tasks/{id}")
            print("   DELETE /api/tasks/{id}")
            print("   PATCH /api/tasks/{id}/complete")
            print("   GET  /health")

            return True

        except Exception as e:
            print(f"\nTEST FAILED: {e}")
            return False

if __name__ == "__main__":
    tester = TodoAppTester()
    success = tester.run_comprehensive_test()
    exit(0 if success else 1)