@Component

@Template
<div class="counter">
  <h3>Counter: @count</h3>
  <button @click="increment">+</button>
</div>

@Code
count = 0;

increment() {
  this.count++;
}

@Style
.counter { color: red; }
