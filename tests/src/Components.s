@Page
@Route("/components")
@Title("Components Runtime QA")

@Template
<div class="qa-page">
  <h1>Components Runtime Tests</h1>
  
  <div class="test-section">
    <h2>Counter Component</h2>
    <Counter />
  </div>

  <div class="test-section">
    <h2>Todo Component</h2>
    <Todo />
  </div>

  <div class="test-section">
    <h2>UserCard Component</h2>
    <UserCard name="John Doe" email="john@example.com" />
  </div>

  <div class="test-section">
    <h2>Nested Components</h2>
    <Nested />
  </div>
</div>

@Code
// Components are imported and used in template

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
