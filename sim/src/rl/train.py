from stable_baselines3 import PPO
import numpy as np

# Use the gymnasium-based environment from the project
from src.envs.delhi_evacuation_env import DelhiEvacuationEnv


class GymnasiumToGymWrapper:
    """Minimal adapter to present a gymnasium.Env like a gym.Env for SB3.

    It wraps the reset/step calling convention. This avoids requiring the
    optional package `gymnasium-to-gym` and keeps the project self-contained.
    """

    def __init__(self, env: DelhiEvacuationEnv):
        self.env = env
        # Expose gym-like attributes
        self.action_space = env.action_space
        self.observation_space = env.observation_space

    def reset(self):
        # Gym expects reset() -> obs; gymnasium returns (obs, info)
        obs, _info = self.env.reset()
        return obs

    def step(self, action):
        # gymnasium returns (obs, reward, terminated, truncated, info)
        obs, reward, terminated, truncated, info = self.env.step(action)
        done = bool(terminated or truncated)
        return obs, float(reward), done, info

    def render(self, mode="human"):
        return self.env.render(mode=mode)

    def close(self):
        return self.env.close()


def train_model(total_timesteps: int = 10000, save_path: str = "delhi_evacuation_model"):
    raw_env = DelhiEvacuationEnv()
    env = GymnasiumToGymWrapper(raw_env)
    model = PPO("MlpPolicy", env, verbose=1)
    model.learn(total_timesteps=total_timesteps)
    model.save(save_path)


if __name__ == "__main__":
    train_model()