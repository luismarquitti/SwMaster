import pytest
import uuid
from app.services.thread_service import thread_service
from app.models.thread import ThreadCreate, ThreadUpdate
from app.models.chat import ChatMessage, Role

def test_thread_lifecycle():
    """Verify CRUD operations for threads."""
    
    # 1. Create
    new_thread = thread_service.create_thread(ThreadCreate(title="Test Thread"))
    assert new_thread.title == "Test Thread"
    thread_id = new_thread.id
    
    # 2. Get
    fetched = thread_service.get_thread(thread_id)
    assert fetched.id == thread_id
    
    # 3. List
    all_threads = thread_service.list_threads()
    assert any(t.id == thread_id for t in all_threads)
    
    # 4. Update
    updated = thread_service.update_thread(thread_id, ThreadUpdate(title="Updated Title"))
    assert updated.title == "Updated Title"
    
    # 5. Delete
    success = thread_service.delete_thread(thread_id)
    assert success is True
    assert thread_service.get_thread(thread_id) is None

def test_thread_missing_operations():
    """Verify behavior for non-existent thread IDs."""
    fake_id = str(uuid.uuid4())
    
    assert thread_service.get_thread(fake_id) is None
    assert thread_service.update_thread(fake_id, ThreadUpdate(title="fail")) is None
    assert thread_service.delete_thread(fake_id) is False
    
    # Update with None title (no change)
    thread = thread_service.create_thread(ThreadCreate(title="Static"))
    res = thread_service.update_thread(thread.id, ThreadUpdate(title=None))
    assert res.title == "Static"

def test_message_management():
    """Verify message addition and deletion within a thread."""
    thread = thread_service.create_thread(ThreadCreate(title="Msg Test"))
    tid = thread.id
    
    # Add messages
    thread_service.add_message(tid, ChatMessage(role=Role.USER, content="Ping"))
    thread_service.add_message(tid, ChatMessage(role=Role.ASSISTANT, content="Pong"))
    
    history = thread_service.get_messages(tid)
    assert len(history) == 2
    assert history[0].content == "Ping"
    
    # Cancel last message
    cancelled_msg = thread_service.pop_last_messages(tid)
    assert cancelled_msg.content == "Ping"
    
    history_after = thread_service.get_messages(tid)
    assert len(history_after) == 0
    
    # Pop from empty thread
    empty_thread = thread_service.create_thread(ThreadCreate(title="Empty"))
    assert thread_service.pop_last_messages(empty_thread.id) is None
    
    # Pop from non-existent thread
    assert thread_service.pop_last_messages("wrong-id") is None

    # Cleanup
    thread_service.delete_thread(tid)
    thread_service.delete_thread(empty_thread.id)
