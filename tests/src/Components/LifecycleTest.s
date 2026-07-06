@Component
@Title("LifecycleTest")

@Template
<div class="lifecycle-test">
  <div class="status">
    Status: @lifecycleStatus
  </div>
  <div class="log">
    @foreach="logs" { log ->
      <div>@log</div>
    }
  </div>
</div>

@Code
@property lifecycleStatus = 'Initialized'
@property logs = []

onInit() {
  this.logs.push('onInit called');
  this.lifecycleStatus = 'Initialized';
}

onAfterRender() {
  this.logs.push('onAfterRender called');
  this.lifecycleStatus = 'Rendered';
}

onDestroy() {
  this.logs.push('onDestroy called');
  this.lifecycleStatus = 'Destroyed';
}

@Style
.lifecycle-test {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.status {
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 3px;
  font-weight: bold;
}

.log {
  max-height: 150px;
  overflow-y: auto;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 10px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
}

.log div {
  padding: 2px 0;
}
