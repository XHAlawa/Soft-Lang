@Component

@Template
<div>
  <h3>If Test</h3>
  <div @if="show">Visible when show is true</div>
</div>

@Code
show = true;

@Style
