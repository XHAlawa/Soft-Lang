@Page
@Route("/")
@Title("Runtime QA Suite")

@Template
<div class="qa-nav">
  <h1>Soft Runtime QA Suite</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/forms">Forms</a>
    <a href="/router">Router</a>
    <a href="/state">State</a>
    <a href="/binding">Binding</a>
    <a href="/components">Components</a>
    <a href="/lifecycle">Lifecycle</a>
    <a href="/async">Async</a>
    <a href="/session">Session</a>
    <a href="/cache">Cache</a>
  </nav>
</div>
<div class="qa-content">
  <h2>Runtime QA Test Suite</h2>
  <p>Select a module above to test specific Runtime features.</p>
  
  <div class="test-status">
    <h3>Quick Status</h3>
    <ul>
      <li>Runtime: <span id="runtime-status">Loading...</span></li>
      <li>Router: <span id="router-status">Loading...</span></li>
      <li>Forms: <span id="forms-status">Loading...</span></li>
    </ul>
  </div>
</div>

@Code
onInit() {
  // Check if Runtime is loaded
  if (typeof (window as any).__softRuntime !== 'undefined') {
    document.getElementById('runtime-status').textContent = '✓ Loaded';
    document.getElementById('runtime-status').style.color = 'green';
  } else {
    document.getElementById('runtime-status').textContent = '✗ Not Loaded';
    document.getElementById('runtime-status').style.color = 'red';
  }
  
  // Check if Router is loaded
  if (typeof (window as any).__router !== 'undefined') {
    document.getElementById('router-status').textContent = '✓ Loaded';
    document.getElementById('router-status').style.color = 'green';
  } else {
    document.getElementById('router-status').textContent = '✗ Not Loaded';
    document.getElementById('router-status').style.color = 'red';
  }
  
  // Check if Forms is loaded
  if (typeof (window as any).forms !== 'undefined') {
    document.getElementById('forms-status').textContent = '✓ Loaded';
    document.getElementById('forms-status').style.color = 'green';
  } else {
    document.getElementById('forms-status').textContent = '✗ Not Loaded';
    document.getElementById('forms-status').style.color = 'red';
  }
}

@Style
.qa-nav {
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.qa-nav h1 {
  margin: 0 0 10px 0;
}

.qa-nav nav a {
  color: white;
  text-decoration: none;
  margin-right: 20px;
  padding: 5px 10px;
  border-radius: 3px;
}

.qa-nav nav a:hover {
  background: #34495e;
}

.qa-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-status {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 5px;
}

.test-status ul {
  list-style: none;
  padding: 0;
}

.test-status li {
  padding: 5px 0;
}
