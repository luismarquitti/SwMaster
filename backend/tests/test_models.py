import pytest
from pydantic import ValidationError
from app.models.chat import ChatRequest, ChatMessage, Role, SkillInfo

def test_chat_message_validation():
    msg = ChatMessage(role=Role.USER, content="Hello")
    assert msg.role == "user"
    assert msg.content == "Hello"

def test_chat_request_structure():
    req = ChatRequest(
        thread_id="test-thread",
        messages=[ChatMessage(role=Role.USER, content="Hello")],
        stream=True
    )
    assert req.thread_id == "test-thread"
    assert len(req.messages) == 1

def test_skill_info_sod_mapping():
    skill = SkillInfo(
        id="planner",
        name="Architect",
        duty="Planner",
        description="Software architecture"
    )
    assert skill.duty == "Planner"

def test_invalid_role():
    with pytest.raises(ValidationError):
        ChatMessage(role="invalid_role", content="Fail")
