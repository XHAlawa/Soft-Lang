@Component

@Template
<div>
  <h3>Multiple Interpolations Test</h3>
  <p>User: @user.name (@user.email)</p>
  <p>Score: @score / @maxScore (@percent%)</p>
  <p>Message: Hello @user.name, you have @score points out of @maxScore!</p>
</div>

@Code
user = { name: 'John', email: 'john@example.com' };
score = 85;
maxScore = 100;
percent = 85;

@Style
