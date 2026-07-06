@Page
@Route("/async")
@Title("Async Runtime QA")

@Template
<div class="qa-page">
  <h1>Async Runtime Tests</h1>
  
  <div class="test-section">
    <h2>Async Data Loading</h2>
    <div class="status">
      Status: @asyncStatus
    </div>
    <div @if="asyncData">
      <div>Data: @asyncData</div>
    </div>
    <button @click="loadAsyncData">Load Data</button>
  </div>

  <div class="test-section">
    <h2>Rapid Async Requests</h2>
    <div class="status">
      Completed: @asyncCompleted / @asyncTotal
    </div>
    <button @click="fireRapidAsync">Fire 10 Rapid Requests</button>
  </div>

  <div class="test-section">
    <h2>Async Error Handling</h2>
    <div class="status">
      Error: @asyncError
    </div>
    <button @click="triggerAsyncError">Trigger Error</button>
  </div>

  <div class="test-section">
    <h2>Async Race Condition</h2>
    <div class="status">
      Winner: @raceWinner
    </div>
    <button @click="triggerRace">Trigger Race</button>
  </div>
</div>

@Code
@property asyncStatus = 'Idle'
@property asyncData = ''
@property asyncCompleted = 0
@property asyncTotal = 10
@property asyncError = ''
@property raceWinner = ''

async loadAsyncData() {
  this.asyncStatus = 'Loading...';
  await new Promise(r => setTimeout(r, 1000));
  this.asyncData = 'Loaded data at ' + new Date().toISOString();
  this.asyncStatus = 'Complete';
}

async fireRapidAsync() {
  this.asyncCompleted = 0;
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      new Promise(r => setTimeout(() => {
        this.asyncCompleted++;
        r(null);
      }, Math.random() * 500))
    );
  }
  await Promise.all(promises);
}

async triggerAsyncError() {
  try {
    await new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Async error')), 500);
    });
  } catch (e) {
    this.asyncError = (e as Error).message;
  }
}

async triggerRace() {
  this.raceWinner = 'Racing...';
  const promises = [
    new Promise(r => setTimeout(() => r('Request 1'), 1000)),
    new Promise(r => setTimeout(() => r('Request 2'), 500)),
    new Promise(r => setTimeout(() => r('Request 3'), 1500))
  ];
  this.raceWinner = await Promise.race(promises);
}

@Style
.qa-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
}

.test-section h2 {
  margin-top: 0;
}

.status {
  margin: 10px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 3px;
}

button {
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
}

button:hover {
  background: #0056b3;
}
