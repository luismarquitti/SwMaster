from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_main_startup():
    """Verify main entry point startup."""
    response = client.get("/health")
    assert response.status_code == 200

def test_api_docs_available():
    """Verify API documentation is reachable."""
    response = client.get("/docs")
    assert response.status_code == 200
