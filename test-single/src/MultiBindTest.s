@Component

@Template
<div>
  <h3>Multiple Bindings Test</h3>
  <input 
    type="text" 
    @bind="value" 
    @class="inputClass" 
    @style="inputStyle" 
    placeholder="@placeholder"
  />
  <div class="@divClass" style="@divStyle">
    Value: @value
  </div>
</div>

@Code
value = 'test';
inputClass = 'my-input';
inputStyle = 'color: blue';
placeholder = 'Enter text...';
divClass = 'output';
divStyle = 'font-weight: bold';

@Style
