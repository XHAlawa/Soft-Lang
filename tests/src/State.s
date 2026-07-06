@Page
@Route("/state")
@Title("State Runtime QA")

@Template
<div class="qa-page">
  <h1>State Runtime Tests</h1>
  
  <div class="test-section">
    <h2>Basic Proxy</h2>
    <div class="status">
      Value: @proxyValue
    </div>
    <input type="text" @bind="proxyValue" />
    <button @click="resetProxy">Reset</button>
  </div>

  <div class="test-section">
    <h2>Nested Objects</h2>
    <div class="status">
      Nested Value: @nestedObject.user.name
    </div>
    <input type="text" @bind="nestedObject.user.name" />
    <button @click="changeNested">Change Nested</button>
  </div>

  <div class="test-section">
    <h2>Arrays</h2>
    <div class="status">
      Array Length: @arrayItems.length
    </div>
    <div @foreach="arrayItems" { item ->
      <div>@item</div>
    }
    <button @click="addItem">Add Item</button>
    <button @click="removeItem">Remove Item</button>
    <button @click="modifyItem">Modify Item</button>
  </div>

  <div class="test-section">
    <h2>Rapid Updates</h2>
    <div class="status">
      Counter: @rapidCounter
    </div>
    <button @click="rapidUpdate">Rapid Update (100x)</button>
  </div>

  <div class="test-section">
    <h2>Computed State</h2>
    <div class="status">
      First: @computedFirst | Last: @computedLast | Full: @computedFull
    </div>
    <input type="text" @bind="computedFirst" placeholder="First" />
    <input type="text" @bind="computedLast" placeholder="Last" />
  </div>
</div>

@Code
@property proxyValue = 'initial'
@property nestedObject = { user: { name: 'John' } }
@property arrayItems = ['item1', 'item2', 'item3']
@property rapidCounter = 0
@property computedFirst = 'John'
@property computedLast = 'Doe'

get computedFull() {
  return `${this.computedFirst} ${this.computedLast}`;
}

resetProxy() {
  this.proxyValue = 'initial';
}

changeNested() {
  this.nestedObject.user.name = 'Jane';
}

addItem() {
  this.arrayItems.push(`item${this.arrayItems.length + 1}`);
}

removeItem() {
  if (this.arrayItems.length > 0) {
    this.arrayItems.pop();
  }
}

modifyItem() {
  if (this.arrayItems.length > 0) {
    this.arrayItems[0] = 'modified';
  }
}

rapidUpdate() {
  for (let i = 0; i < 100; i++) {
    this.rapidCounter = i;
  }
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
