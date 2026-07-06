@Component

@Template
<div>
  <h3>Form Test</h3>
  <form>
    <div>
      <label>Name:</label>
      <input type="text" @bind="name" />
    </div>
    <div>
      <label>Email:</label>
      <input type="email" @bind="email" />
    </div>
    <div>
      <label>Age:</label>
      <input type="number" @bind="age" />
    </div>
    <div>
      <label>Message:</label>
      <textarea @bind="message"></textarea>
    </div>
    <div>
      <label>Subscribe:</label>
      <input type="checkbox" @bind="subscribe" />
    </div>
  </form>
  <div>
    <p>Name: @name</p>
    <p>Email: @email</p>
    <p>Age: @age</p>
    <p>Message: @message</p>
    <p>Subscribe: @subscribe</p>
  </div>
</div>

@Code
name = '';
email = '';
age = 0;
message = '';
subscribe = false;

@Style
