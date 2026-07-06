@Component

@Template
<div>Test</div>

@Code
@property count = 0

increment() {
  this.count++;
}

@Style
.test { color: red; }
