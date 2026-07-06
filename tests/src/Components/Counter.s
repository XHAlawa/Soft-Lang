@Component
@Title("Counter")

@Template
<div class="counter">
  <h3>Counter: @count</h3>
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
  <button @click="reset">Reset</button>
</div>

@Code
@property count = 0

increment() {
  this.count++;
}

decrement() {
  this.count--;
}

reset() {
  this.count = 0;
}

@Style
.counter {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.counter h3 {
  margin: 0 0 10px 0;
}
