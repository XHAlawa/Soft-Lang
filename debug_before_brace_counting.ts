export class App {
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
}