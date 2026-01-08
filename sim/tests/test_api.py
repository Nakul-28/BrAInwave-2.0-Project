from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_simulate_endpoint():
    response = client.post("/simulate", json={"scenario": {}})
    assert response.status_code == 200
    assert "result" in response.json()  # Adjust based on actual response structure

def test_invalid_simulate_request():
    response = client.post("/simulate", json={"invalid_key": {}})
    assert response.status_code == 422  # Unprocessable Entity for invalid request
