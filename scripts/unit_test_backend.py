import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "backend")))

from app.services.thread_service import ThreadService
from app.models.chat import ChatMessage, Role
from app.models.thread import ThreadCreate

def test_thread_service_pop():
    service = ThreadService()
    
    # 1. Create thread
    thread = service.create_thread(ThreadCreate(title="Test"))
    tid = thread.id
    print(f"Created thread: {tid}")
    
    # 2. Add messages
    service.add_message(tid, ChatMessage(role=Role.USER, content="Hello"))
    service.add_message(tid, ChatMessage(role=Role.ASSISTANT, content="Hi there"))
    
    msgs = service.get_messages(tid)
    print(f"Messages before pop: {len(msgs)}")
    for m in msgs:
        print(f"  {m.role}: {m.content}")
        
    # 3. Pop
    cancelled = service.pop_last_messages(tid)
    print(f"Cancelled message: {cancelled}")
    
    msgs_after = service.get_messages(tid)
    print(f"Messages after pop: {len(msgs_after)}")
    
    # Assertions
    assert len(msgs) == 2
    assert len(msgs_after) == 0
    assert cancelled.content == "Hello"
    print("Test PASSED!")

if __name__ == "__main__":
    try:
        test_thread_service_pop()
    except Exception as e:
        print(f"Test FAILED: {e}")
        import traceback
        traceback.print_exc()
