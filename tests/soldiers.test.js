import assert from 'assert';
import {
  getRecruits,
  addRecruits,
  buyProducer,
  buyUnit,
  getProducers,
  getUnits,
  getSPS,
  resetRecruits
} from '../js/resources/soldiers.js';

function beforeEach() {
  resetRecruits();
}

function testAddRecruits() {
  beforeEach();
  addRecruits(5);
  assert.strictEqual(getRecruits(), 5, 'addRecruits should increase recruit count');
}

function testBuyProducer() {
  beforeEach();
  addRecruits(10); // cost of Barracks
  const success = buyProducer(0);
  assert.strictEqual(success, true, 'buyProducer should succeed with enough recruits');
  assert.strictEqual(getRecruits(), 0, 'recruits should decrease after buying producer');
  const producers = getProducers();
  assert.strictEqual(producers[0].owned, 1, 'producer count should increase');
  assert.strictEqual(producers[0].cost, 11, 'producer cost should update');
}

function testBuyUnit() {
  beforeEach();
  addRecruits(50); // cost of Archer
  const success = buyUnit(0);
  assert.strictEqual(success, true, 'buyUnit should succeed with enough recruits');
  assert.strictEqual(getRecruits(), 0, 'recruits should decrease after buying unit');
  const units = getUnits();
  assert.strictEqual(units[0].owned, 1, 'unit count should increase');
  assert.strictEqual(units[0].cost, 60, 'unit cost should update');
}

function testUpdateSPS() {
  beforeEach();
  addRecruits(60); // enough for Barracks and Archer
  buyProducer(0); // cost 10
  buyUnit(0); // cost 50
  const sps = getSPS();
  assert.ok(Math.abs(sps - 0.7) < 1e-9, 'SPS should reflect producers and units');
}

function runTests() {
  testAddRecruits();
  testBuyProducer();
  testBuyUnit();
  testUpdateSPS();
  console.log('All tests passed!');
}

runTests();
