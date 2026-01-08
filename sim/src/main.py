from fastapi import FastAPI
from app.routers.env_router import router as env_router

app = FastAPI()

app.include_router(env_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Delhi Earthquake Evacuation Simulation Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)