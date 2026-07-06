@Component

@Template
<div>
  <h3>Manual Form Test</h3>
  <form @submit.prevent="handleSubmit">
    <input @bind="name" />
    <button type="submit">Submit</button>
  </form>
</div>

@Code
name = '';

handleSubmit() {
  console.log('Submitted:', this.name);
}

@Style
