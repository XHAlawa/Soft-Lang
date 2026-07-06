@Page
@Route("/lifecycle")
@Title("Lifecycle Runtime QA")

@Template
<div class="qa-page">
  <h1>Component Lifecycle Tests</h1>
  
  <div class="test-section">
    <h2>Mount/Unmount</h2>
    <div class="status">
      Component Mounted: @isMounted
    </div>
    <button @click="toggleComponent">Toggle Component</button>
    <div @if="isMounted">
      <LifecycleTest />
    </div>
  </div>

  <div class="test-section">
    <h2>Recreate Component</h2>
    <div class="status">
      Key: @componentKey
    </div>
    <button @click="recreateComponent">Recreate</button>
    <LifecycleTest key="@componentKey" />
  </div>

  <div class="test-section">
    <h2>Lifecycle Log</h2>
    <div class="log">
      @foreach="lifecycleLog" { log ->
        <div>@log</div>
      }
    </div>
    <button @click="clearLog">Clear Log</button>
  </div>
</div>

@Code
@property isMounted = true
@property componentKey = 1
@property lifecycleLog = []

toggleComponent() {
  this.isMounted = !this.isMounted;
}

recreateComponent() {
  this.componentKey++;
}

clearLog() {
  this.lifecycleLog = [];
}

addLog(message: string) {
  this.lifecycleLog.push(message);
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

.log {
  margin: 10px 0;
  padding: 10px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 3px;
  font-family: monospace;
  max-height: 200px;
  overflow-y: auto;
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
