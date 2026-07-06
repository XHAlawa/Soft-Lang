@Page
@Route("/binding")
@Title("Binding Runtime QA")

@Template
<div class="qa-page">
  <h1>Binding Runtime Tests</h1>
  
  <div class="test-section">
    <h2>Basic Binding</h2>
    <div class="status">
      Bound Value: @boundValue
    </div>
    <input type="text" @bind="boundValue" />
    <button @click="setBoundValue">Set Programmatically</button>
  </div>

  <div class="test-section">
    <h2>Multiple Inputs</h2>
    <div class="status">
      Input1: @multiInput1 | Input2: @multiInput2
    </div>
    <input type="text" @bind="multiInput1" placeholder="Input 1" />
    <input type="text" @bind="multiInput2" placeholder="Input 2" />
    <button @click="syncInputs">Sync Values</button>
  </div>

  <div class="test-section">
    <h2>Number Binding</h2>
    <div class="status">
      Number: @boundNumber
    </div>
    <input type="number" @bind="boundNumber" />
    <button @click="incrementNumber">Increment</button>
  </div>

  <div class="test-section">
    <h2>Checkbox Binding</h2>
    <div class="status">
      Checked: @isChecked
    </div>
    <input type="checkbox" @bind="isChecked" />
    <button @click="toggleCheck">Toggle Programmatically</button>
  </div>

  <div class="test-section">
    <h2>Select Binding</h2>
    <div class="status">
      Selected: @selectedOption
    </div>
    <select @bind="selectedOption">
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
  </div>

  <div class="test-section">
    <h2>Textarea Binding</h2>
    <div class="status">
      Length: @boundText.length
    </div>
    <textarea @bind="boundText" rows="3"></textarea>
  </div>
</div>

@Code
@property boundValue = 'initial'
@property multiInput1 = ''
@property multiInput2 = ''
@property boundNumber = 0
@property isChecked = false
@property selectedOption = 'option1'
@property boundText = ''

setBoundValue() {
  this.boundValue = 'programmatic';
}

syncInputs() {
  this.multiInput2 = this.multiInput1;
}

incrementNumber() {
  this.boundNumber++;
}

toggleCheck() {
  this.isChecked = !this.isChecked;
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

input, select, textarea {
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
