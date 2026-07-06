@Component

@Template
<div>
  <p>Count: {this.count}</p>
  <button @click="inc">+</button>
</div>

@Code
count = 0;

inc() {
  this.count++;
}

@Style
