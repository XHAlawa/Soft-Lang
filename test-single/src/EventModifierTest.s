@Component

@Template
<div>
  <h3>Event Modifier Test</h3>
  <button @click.prevent="handleClick">Prevent Default</button>
  <button @click.stop="handleClick">Stop Propagation</button>
  <button @click.once="handleClick">Once</button>
  <button @click.ctrl="handleClick">Ctrl Key</button>
  <button @click.shift="handleClick">Shift Key</button>
  <p>Click count: <span id="count">{this.count}</span></p>
</div>

@Code
count = 0;

handleClick() {
  this.count++;
  console.log('Clicked', this.count);
}

@Style
