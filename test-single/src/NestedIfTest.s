@Component

@Template
<div>
  <h3>Nested If Test</h3>
  <div @if="showOuter">
    <p>Outer visible</p>
    <div @if="showInner">
      <p>Inner visible</p>
      <div @if="showDeep">
        <p>Deep visible</p>
      </div>
    </div>
  </div>
</div>

@Code
showOuter = true;
showInner = true;
showDeep = true;

@Style
