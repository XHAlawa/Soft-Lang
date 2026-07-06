@Page
@Route("/router")
@Title("Router Runtime QA")

@Template
<div class="qa-page">
  <h1>Router Runtime Tests</h1>
  
  <div class="test-section">
    <h2>Basic Navigation</h2>
    <div class="status">
      Current Route: @currentRoute
    </div>
    <button @click="navigateHome">Navigate to /</button>
    <button @click="navigateToRouter">Navigate to /router</button>
    <button @click="navigateToState">Navigate to /state</button>
  </div>

  <div class="test-section">
    <h2>Route Parameters</h2>
    <div class="status">
      Params: @paramsDisplay
    </div>
    <button @click="navigateWithId">Navigate to /users/123</button>
    <button @click="navigateWithSlug">Navigate to /posts/my-post</button>
    <button @click="navigateWithMultiple">Navigate to /products/123/reviews/456</button>
  </div>

  <div class="test-section">
    <h2>Query Parameters</h2>
    <div class="status">
      Query: @queryDisplay
    </div>
    <button @click="navigateWithQuery">Navigate with ?page=1&limit=10</button>
    <button @click="navigateWithArrayQuery">Navigate with ?tag=a&tag=b&tag=c</button>
    <button @click="navigateWithEncoded">Navigate with ?search=hello+world</button>
  </div>

  <div class="test-section">
    <h2>Back/Forward Navigation</h2>
    <div class="status">
      History Length: @historyLength
    </div>
    <button @click="navigateSeries">Navigate Series (3 pages)</button>
    <button @click="goBack">Go Back</button>
    <button @click="goForward">Go Forward</button>
  </div>

  <div class="test-section">
    <h2>Replace Navigation</h2>
    <div class="status">
      Current Path: @currentPath
    </div>
    <button @click="replaceNavigation">Replace Current Route</button>
  </div>

  <div class="test-section">
    <h2>State Navigation</h2>
    <div class="status">
      State: @stateDisplay
    </div>
    <button @click="navigateWithState">Navigate with State</button>
  </div>

  <div class="test-section">
    <h2>404 Handling</h2>
    <button @click="navigateTo404">Navigate to Unknown Route</button>
  </div>

  <div class="test-section">
    <h2>Hash Fragment</h2>
    <div class="status">
      Path: @currentPath | Hash: @currentHash
    </div>
    <button @click="navigateWithHash">Navigate with #section</button>
  </div>

  <div class="test-section">
    <h2>Refresh Test</h2>
    <button @click="refreshPage">Refresh Page</button>
  </div>
</div>

@Code
@property currentRoute = ''
@property paramsDisplay = '{}'
@property queryDisplay = '{}'
@property historyLength = 0
@property currentPath = ''
@property stateDisplay = '{}'
@property currentHash = ''

onInit() {
  this.updateRouteInfo();
  
  // Listen to popstate
  window.addEventListener('popstate', () => {
    this.updateRouteInfo();
  });
}

updateRouteInfo() {
  const router = (window as any).__router;
  if (router) {
    this.currentRoute = window.location.pathname;
    this.paramsDisplay = JSON.stringify(router.currentParams);
    this.queryDisplay = JSON.stringify(router.currentQuery);
    this.historyLength = window.history.length;
    this.currentPath = window.location.pathname;
    this.stateDisplay = JSON.stringify(router.currentState);
    this.currentHash = window.location.hash;
  }
}

navigateHome() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/');
  }
}

navigateToRouter() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/router');
  }
}

navigateToState() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/state');
  }
}

navigateWithId() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/users/:id', { id: '123' });
  }
}

navigateWithSlug() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/posts/:slug', { slug: 'my-post' });
  }
}

navigateWithMultiple() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/products/:id/reviews/:reviewId', { id: '123', reviewId: '456' });
  }
}

navigateWithQuery() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/router', {}, { page: '1', limit: '10' });
  }
}

navigateWithArrayQuery() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/router', {}, { tag: ['a', 'b', 'c'] });
  }
}

navigateWithEncoded() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/router', {}, { search: 'hello world' });
  }
}

navigateSeries() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/');
    setTimeout(() => router.navigate('/state'), 100);
    setTimeout(() => router.navigate('/router'), 200);
  }
}

goBack() {
  window.history.back();
}

goForward() {
  window.history.forward();
}

replaceNavigation() {
  const router = (window as any).__router;
  if (router) {
    router.replace('/router');
  }
}

navigateWithState() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/router', {}, {}, { fromPage: 'home', timestamp: Date.now() });
  }
}

navigateTo404() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/this-route-does-not-exist');
  }
}

navigateWithHash() {
  const router = (window as any).__router;
  if (router) {
    router.navigate('/router#section');
  }
}

refreshPage() {
  window.location.reload();
}

@Style
.qa-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
}

.test-section h2 {
  margin-top: 0;
}

.status {
  margin: 10px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 3px;
  font-family: monospace;
}

button {
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
}

button:hover {
  background: #0056b3;
}
