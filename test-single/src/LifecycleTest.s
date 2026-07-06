@Component

@Template
<div>
  <h3>Lifecycle Hooks Test</h3>
  <p>Mounted: <span id="mounted-status">No</span></p>
  <p>Updated: <span id="updated-count">0</span></p>
  <p>Destroyed: <span id="destroyed-status">No</span></p>
  <button @click="triggerUpdate">Trigger Update</button>
</div>

@Code
mountedCount = 0;
updatedCount = 0;
destroyedCount = 0;

onMounted() {
  this.mountedCount++;
  console.log('Component mounted');
  const el = document.getElementById('mounted-status');
  if (el) el.textContent = 'Yes';
}

onUpdated() {
  this.updatedCount++;
  console.log('Component updated');
  const el = document.getElementById('updated-count');
  if (el) el.textContent = String(this.updatedCount);
}

onDestroy() {
  this.destroyedCount++;
  console.log('Component destroyed');
  const el = document.getElementById('destroyed-status');
  if (el) el.textContent = 'Yes';
}

triggerUpdate() {
  // Force re-render
  queueMicrotask(() => this.__render(this.__container));
}

@Style
