# Contents of the file: /sim/sim/tests/test_env.py

import pytest
from src.envs.delhi_evacuation_env import DelhiEqEnv

def test_initialization():
    env = DelhiEqEnv()
    assert env is not None

def test_step():
    env = DelhiEqEnv()
    initial_state = env.reset()
    action = env.action_space.sample()
    new_state, reward, done, info = env.step(action)
    
    assert new_state is not None
    assert isinstance(reward, float)
    assert isinstance(done, bool)
    assert isinstance(info, dict)

def test_reset():
    env = DelhiEqEnv()
    initial_state = env.reset()
    assert initial_state is not None
    assert env.state == initial_state  # Assuming the env has a state attribute