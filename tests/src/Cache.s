@Page
@Route("/cache")
@Title("Cache Runtime QA")

@Template
<div class="qa-page">
  <h1>Cache Runtime Tests</h1>
  
  <div class="test-section">
    <h2>Local Storage Cache</h2>
    <div class="status">
      Cache Value: @cacheValue
    </div>
    <input type="text" @bind="cacheValue" />
    <button @click="saveCache">Save to Cache</button>
    <button @click="loadCache">Load from Cache</button>
    <button @click="clearCache">Clear Cache</button>
  </div>

  <div class="test-section">
    <h2>Cache Expiration</h2>
    <div class="status">
      Expires in: @cacheExpiry seconds
    </div>
    <button @click="saveWithExpiry">Save with 5s Expiry</button>
    <button @click="checkExpiry">Check Expiry</button>
  </div>

  <div class="test-section">
    <h2>Large Cache Data</h2>
    <div class="status">
      Size: @cacheSize bytes
    </div>
    <button @click="saveLargeData">Save Large Data (1MB)</button>
    <button @click="loadLargeData">Load Large Data</button>
  </div>
</div>

@Code
@property cacheValue = ''
@property cacheExpiry = 0
@property cacheSize = 0

saveCache() {
  localStorage.setItem('cacheValue', this.cacheValue);
}

loadCache() {
  this.cacheValue = localStorage.getItem('cacheValue') || '';
}

clearCache() {
  localStorage.removeItem('cacheValue');
  this.cacheValue = '';
}

saveWithExpiry() {
  const data = {
    value: this.cacheValue,
    expiry: Date.now() + 5000
  };
  localStorage.setItem('cacheWithExpiry', JSON.stringify(data));
  this.cacheExpiry = 5;
}

checkExpiry() {
  const cached = localStorage.getItem('cacheWithExpiry');
  if (cached) {
    const data = JSON.parse(cached);
    const remaining = Math.floor((data.expiry - Date.now()) / 1000);
    this.cacheExpiry = remaining > 0 ? remaining : 0;
  }
}

saveLargeData() {
  const largeData = 'x'.repeat(1024 * 1024); // 1MB
  localStorage.setItem('largeData', largeData);
  this.cacheSize = largeData.length;
}

loadLargeData() {
  const data = localStorage.getItem('largeData');
  this.cacheSize = data ? data.length : 0;
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
