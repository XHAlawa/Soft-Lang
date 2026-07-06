@Component
@Title("Nested")

@Template
<div class="nested">
  <h3>Nested Components</h3>
  <div class="parent">
    <p>Parent Value: @parentValue</p>
    <button @click="changeParent">Change Parent</button>
    <div class="child">
      <Counter />
    </div>
  </div>
</div>

@Code
@property parentValue = 'parent'

changeParent() {
  this.parentValue = 'changed-' + Date.now();
}

@Style
.nested {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.parent {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.child {
  margin-top: 15px;
  padding: 15px;
  background: #e9ecef;
  border-radius: 5px;
}
