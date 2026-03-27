"""In-memory thread storage service.

Manages conversation threads and their message history.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Dict, List, Optional

from app.models.chat import ChatMessage
from app.models.thread import Thread, ThreadCreate, ThreadUpdate


class ThreadService:
    """Manages thread and message history in memory."""

    def __init__(self):
        # thread_id -> Thread object
        self._threads: Dict[str, Thread] = {}
        # thread_id -> List of ChatMessage objects
        self._messages: Dict[str, List[ChatMessage]] = {}

    def list_threads(self) -> List[Thread]:
        """List all threads, sorted by creation date (newest first)."""
        return sorted(
            self._threads.values(),
            key=lambda t: t.createdAt,
            reverse=True,
        )

    def get_thread(self, thread_id: str) -> Optional[Thread]:
        """Get a single thread by ID."""
        return self._threads.get(thread_id)

    def get_messages(self, thread_id: str) -> List[ChatMessage]:
        """Get the message history for a thread."""
        return self._messages.get(thread_id, [])

    def create_thread(self, thread_in: ThreadCreate) -> Thread:
        """Create a new thread."""
        thread_id = str(uuid.uuid4())
        thread = Thread(
            id=thread_id,
            title=thread_in.title,
            createdAt=datetime.now(),
        )
        self._threads[thread_id] = thread
        self._messages[thread_id] = []
        return thread

    def update_thread(self, thread_id: str, thread_in: ThreadUpdate) -> Optional[Thread]:
        """Update a thread's title."""
        if thread_id not in self._threads:
            return None
        
        thread = self._threads[thread_id]
        if thread_in.title is not None:
            # Pydantic models are immutable by default if Config.frozen is True, 
            # but here we can just replace it or use .copy(update=...)
            updated_thread = thread.model_copy(update={"title": thread_in.title})
            self._threads[thread_id] = updated_thread
            return updated_thread
        return thread

    def delete_thread(self, thread_id: str) -> bool:
        """Delete a thread and its messages."""
        if thread_id in self._threads:
            del self._threads[thread_id]
            if thread_id in self._messages:
                del self._messages[thread_id]
            return True
        return False

    def add_message(self, thread_id: str, message: ChatMessage):
        """Append a message to a thread's history."""
        if thread_id not in self._threads:
            # Auto-create thread with the requested ID if it doesn't exist
            thread = Thread(
                id=thread_id,
                title="New Conversation",
                createdAt=datetime.now(),
            )
            self._threads[thread_id] = thread
            self._messages[thread_id] = []
        
        if thread_id not in self._messages:
            self._messages[thread_id] = []
        
        self._messages[thread_id].append(message)

    def pop_last_messages(self, thread_id: str) -> Optional[ChatMessage]:
        """Remove and return the last user message and the corresponding AI response.
        
        Returns the content of the removed user message for editing.
        """
        if thread_id not in self._messages or not self._messages[thread_id]:
            return None
        
        history = self._messages[thread_id]
        
        # If the last message is from the assistant, remove it
        if history[-1].role == "assistant":
            history.pop()
            
        # If the now-last message is from the user, remove it and return its content
        if history and history[-1].role == "user":
            user_msg = history.pop()
            return user_msg
            
        return None


# Singleton instance
thread_service = ThreadService()
