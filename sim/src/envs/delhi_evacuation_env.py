from gymnasium import Env
from gymnasium.spaces import Discrete, Box
import numpy as np


# Gymnasium-compliant environment. Reset returns (obs, info). Step returns
# (obs, reward, terminated, truncated, info).
class DelhiEvacuationEnv(Env):
    def __init__(self):
        super(DelhiEvacuationEnv, self).__init__()
        self.action_space = Discrete(5)  # Example: 5 possible actions
        self.observation_space = Box(low=0, high=1, shape=(10,), dtype=np.float32)  # 10-dimensional state

    def reset(self, *, seed=None, options=None):
        # seed/options ignored in this simple example
        self.state = np.zeros(10, dtype=np.float32)
        info = {}
        return self.state, info

    def step(self, action):
        # Simple example transition: small random change to the state
        self.state = np.clip(self.state + (np.random.rand(10) - 0.5) * 0.1, 0.0, 1.0)
        reward = float(0.0)
        terminated = False
        truncated = False
        info = {}
        return self.state, reward, terminated, truncated, info

    def render(self, mode='human'):
        pass

    def close(self):
        pass


# Backwards-compatible shim used by existing tests: provides the old gym
# 4-tuple API (obs, reward, done, info). Tests import `DelhiEqEnv` so we
# keep that name as a thin adapter around the new gymnasium env.
class DelhiEqEnv:
    def __init__(self):
        self._env = DelhiEvacuationEnv()
        # expose spaces for test code
        self.action_space = self._env.action_space
        self.observation_space = self._env.observation_space

    def reset(self):
        obs, _info = self._env.reset()
        # return a Python-native type for easier equality checks in tests
        obs_list = obs.tolist()
        self.state = obs_list
        return obs_list

    def step(self, action):
        obs, reward, terminated, truncated, info = self._env.step(action)
        done = bool(terminated or truncated)
        obs_list = obs.tolist()
        self.state = obs_list
        return obs_list, float(reward), done, info

    def render(self, mode='human'):
        return self._env.render(mode=mode)

    def close(self):
        return self._env.close()