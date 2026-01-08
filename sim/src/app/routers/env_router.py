from fastapi import APIRouter

router = APIRouter()

@router.post("/simulate")
async def simulate(data: dict):
    return {"message": "Simulation started", "data": data}