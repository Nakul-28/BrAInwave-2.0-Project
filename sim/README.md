# README.md

# Delhi Earthquake Evacuation Reinforcement Learning Project

This project is a FastAPI microservice designed to simulate earthquake evacuation scenarios in Delhi using reinforcement learning techniques. It leverages OpenAI's Gym for environment simulation and Stable-Baselines3 for training reinforcement learning agents.

## Installation

To get started, clone the repository and install the required dependencies:

```bash
git clone <repository-url>
cd sim
pip install -r requirements.txt
```

## Running the Server

You can run the FastAPI server using Uvicorn. Execute the following command:

```bash
uvicorn src.main:app --reload
```

The server will be available at `http://127.0.0.1:8000`.

## API Endpoint

### Simulate

To simulate an evacuation scenario, send a POST request to the `/simulate` endpoint with a minimal JSON body. Here is an example of the request format:

```json
{
  "scenario": {
    "zones": [],
    "edges": []
  },
  "time_horizon": 10
}
```

Replace the `zones` and `edges` with appropriate data for your scenario.

## Project Structure

- `src/main.py`: Entry point for the FastAPI application.
- `src/app`: Contains the FastAPI application logic, including routes and schemas.
- `src/envs`: Defines the environment for the evacuation simulation.
- `src/rl`: Contains reinforcement learning training scripts.
- `tests`: Includes unit tests for the application.
- `requirements.txt`: Lists the project dependencies.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.