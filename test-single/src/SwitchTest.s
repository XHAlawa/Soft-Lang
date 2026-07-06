@Component

@Template
<div>
  <h3>Switch Directive Test</h3>
  <p>Selected: <span id="selected-value">{this.selected}</span></p>
  <button @click="setA">Set A</button>
  <button @click="setB">Set B</button>
  <button @click="setC">Set C</button>
  
  @switch(this.selected)
    @case('A')
      <p id="result">Case A matched</p>
    @case('B')
      <p id="result">Case B matched</p>
    @case('C')
      <p id="result">Case C matched</p>
    @default
      <p id="result">No case matched</p>
  @endswitch
</div>

@Code
selected = 'A';

setA() {
  this.selected = 'A';
}

setB() {
  this.selected = 'B';
}

setC() {
  this.selected = 'C';
}

@Style
