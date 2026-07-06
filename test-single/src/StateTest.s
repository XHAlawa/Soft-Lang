@Component

@Template
<div>
  <h3>State Test</h3>
  <p>Counter: {this.counter}</p>
  <button @click="increment">Increment</button>
</div>

@Code
@State
counter = 0;

increment() {
  this.counter++;
}

@Style
