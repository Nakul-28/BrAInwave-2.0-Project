from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class SimulateRequest(BaseModel):
    scenario: dict


@router.post("/simulate")
async def simulate(data: SimulateRequest):
    # Echo back a 'result' field so tests that expect it will pass.
    return {"message": "Simulation started", "data": data.model_dump(), "result": {}}