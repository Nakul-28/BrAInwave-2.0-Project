from fastapi import Depends
from .schemas import SimulateRequest
from .services.simulate import run_simulation

async def get_simulation_request(request: SimulateRequest):
    return request

async def simulate(request: SimulateRequest = Depends(get_simulation_request)):
    result = await run_simulation(request)
    return result