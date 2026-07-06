@Component

@Template
<div>
  <h3>Form Directive Test</h3>
  @form(this.submitForm)
    <p>Name: <input @bind="name" /></p>
    <p>Email: <input @bind="email" /></p>
    <button type="submit">Submit</button>
  @endform
</div>

@Code
name = '';
email = '';

submitForm() {
  console.log('Form submitted', this.name, this.email);
}

@Style
