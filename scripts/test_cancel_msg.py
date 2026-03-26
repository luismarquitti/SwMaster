import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_cancel_flow():
    # 1. Create a thread
    resp = requests.post(f"{BASE_URL}/api/threads", json={"title": "Test Thread"})
    thread = resp.json()
    thread_id = thread["id"]
    print(f"Created thread: {thread_id}")

    # 2. Add user message
    requests.post(f"{BASE_URL}/api/chat", json={
        "messages": [{"role": "user", "content": "Hello SwMaster"}],
        "thread_id": thread_id,
        "stream": False
    })
    print("Sent user message")

    # 3. Verify history
    resp = requests.get(f"{BASE_URL}/api/threads/{thread_id}")
    history = resp.json()
    print(f"History length: {len(history)}")

    # 4. Cancel
    resp = requests.delete(f"{BASE_URL}/api/threads/{thread_id}/messages/last")
    data = resp.json()
    print(f"Cancel response: {data}")

    # 5. Verify history is empty
    resp = requests.get(f"{BASE_URL}/api/threads/{thread_id}")
    history = resp.json()
    print(f"History length after cancel: {len(history)}")

if __name__ == "__main__":
    try:
        test_cancel_flow()
    except Exception as e:
        print(f"Test failed: {e}")
