@Page
@Route("/session")
@Title("Session Runtime QA")

@Template
<div class="qa-page">
  <h1>Session Runtime Tests</h1>
  
  <div class="test-section">
    <h2>Session Storage</h2>
    <div class="status">
      Session Value: @sessionValue
    </div>
    <input type="text" @bind="sessionValue" />
    <button @click="saveSession">Save to Session</button>
    <button @click="loadSession">Load from Session</button>
    <button @click="clearSession">Clear Session</button>
  </div>

  <div class="test-section">
    <h2>Session Persistence</h2>
    <div class="status">
      Saved at: @sessionTimestamp
    </div>
    <button @click="saveTimestamp">Save Timestamp</button>
    <button @click="refreshAndCheck">Refresh and Check</button>
  </div>
</div>

@Code
@property sessionValue = ''
@property sessionTimestamp = ''

saveSession() {
  sessionStorage.setItem('testValue', this.sessionValue);
}

loadSession() {
  this.sessionValue = sessionStorage.getItem('testValue') || '';
}

clearSession() {
  sessionStorage.removeItem('testValue');
  this.sessionValue = '';
}

saveTimestamp() {
  this.sessionTimestamp = new Date().toISOString();
  sessionStorage.setItem('timestamp', this.sessionTimestamp);
}

refreshAndCheck() {
  this.sessionTimestamp = sessionStorage.getItem('timestamp') || 'Not found';
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

input {
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 5px;
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
