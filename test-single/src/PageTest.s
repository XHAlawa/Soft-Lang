@Page('/page-test')

@Template
<div>
  <h3>Page Routing Test</h3>
  <p>Route: <span id="route-path">{this.$route?.path || 'N/A'}</span></p>
  <p>Has Router: <span id="has-router">{this.$navigate ? 'Yes' : 'No'}</span></p>
</div>

@Code
@Style
