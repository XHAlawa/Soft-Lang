@Component

@Template
<div>
  <input type="text" @bind="value" />
  <div>@value</div>
</div>

@Code
value = 'initial';

@Style
