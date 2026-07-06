@Page
@Route("/forms")
@Title("Forms Runtime QA")

@Template
<div class="qa-page">
  <h1>Forms Runtime Tests</h1>
  
  <div class="test-section">
    <h2>Required Validation</h2>
    <form @form="requiredForm">
      <label>Username (required):</label>
      <input type="text" @form.field="username" />
      <div class="error" @visible:requiredForm.username.$hasErrors>
        @foreach(requiredForm.username.$errors) { error ->
          <div>@error.message</div>
        }
      </div>
      <div class="status">
        Dirty: @requiredForm.username.$dirty | 
        Touched: @requiredForm.username.$touched | 
        Valid: @requiredForm.username.$valid
      </div>
      <button type="button" @click="validateRequired">Validate</button>
      <button type="button" @click="resetRequired">Reset</button>
    </form>
  </div>

  <div class="test-section">
    <h2>Email Validation</h2>
    <form @form="emailForm">
      <label>Email:</label>
      <input type="email" @form.field="email" />
      <div class="error" @visible:emailForm.email.$hasErrors>
        @foreach(emailForm.email.$errors) { error ->
          <div>@error.message</div>
        }
      </div>
      <div class="status">
        Dirty: @emailForm.email.$dirty | 
        Touched: @emailForm.email.$touched | 
        Valid: @emailForm.email.$valid
      </div>
      <button type="button" @click="validateEmail">Validate</button>
    </form>
  </div>

  <div class="test-section">
    <h2>Async Validation</h2>
    <form @form="asyncForm">
      <label>Username (async check):</label>
      <input type="text" @form.field="username" />
      <div class="pending" @visible:asyncForm.username.$pending>Checking availability...</div>
      <div class="error" @visible:asyncForm.username.$hasErrors>
        @foreach(asyncForm.username.$errors) { error ->
          <div>@error.message</div>
        }
      </div>
      <div class="status">
        Pending: @asyncForm.username.$pending | 
        Valid: @asyncForm.username.$valid
      </div>
      <button type="button" @click="validateAsync">Validate Async</button>
    </form>
  </div>

  <div class="test-section">
    <h2>Blur Trigger</h2>
    <form @form="blurForm">
      <label>Field (validates on blur):</label>
      <input type="text" @form.field="value" />
      <div class="error" @visible:blurForm.value.$hasErrors>
        @foreach(blurForm.value.$errors) { error ->
          <div>@error.message</div>
        }
      </div>
      <div class="status">
        Touched: @blurForm.value.$touched | 
        Focused: @blurForm.value.$focused
      </div>
    </form>
  </div>

  <div class="test-section">
    <h2>Submit Validation</h2>
    <form @form="submitForm">
      <label>Name:</label>
      <input type="text" @form.field="name" />
      <div class="error" @visible:submitForm.name.$hasErrors>
        @foreach(submitForm.name.$errors) { error ->
          <div>@error.message</div>
        }
      </div>
      <label>Email:</label>
      <input type="email" @form.field="email" />
      <div class="error" @visible:submitForm.email.$hasErrors>
        @foreach(submitForm.email.$errors) { error ->
          <div>@error.message</div>
        }
      </div>
      <div class="status">
        Form Valid: @submitForm.$valid | 
        Form Dirty: @submitForm.$dirty | 
        Submitting: @submitForm.$submitting
      </div>
      <button type="button" @click="submitFormTest">Submit</button>
      <button type="button" @click="resetSubmit">Reset</button>
    </form>
  </div>

  <div class="test-section">
    <h2>Reset Test</h2>
    <form @form="resetForm">
      <label>Value:</label>
      <input type="text" @form.field="value" />
      <div class="status">
        Value: @resetForm.value | 
        Dirty: @resetForm.value.$dirty
      </div>
      <button type="button" @click="resetField">Reset Field</button>
      <button type="button" @click="resetWholeForm">Reset Form</button>
    </form>
  </div>
</div>

@Code
@property requiredForm = {
  username: ''
}

@property emailForm = {
  email: ''
}

@property asyncForm = {
  username: ''
}

@property blurForm = {
  value: ''
}

@property submitForm = {
  name: '',
  email: ''
}

@property resetForm = {
  value: 'initial'
}

onInit() {
  // Add validators
  forms.addValidation(this.requiredForm, 'username', 
    forms.validators.required('Username is required')
  );
  
  forms.addValidation(this.emailForm, 'email', 
    forms.validators.email('Invalid email format')
  );
  
  forms.addValidation(this.asyncForm, 'username', 
    forms.validators.required('Username is required'),
    'blur'
  );
  
  forms.addValidation(this.asyncForm, 'username', 
    async (value) => {
      await new Promise(r => setTimeout(r, 1000));
      if (value === 'taken') {
        return { valid: false, errors: [{ code: 'taken', message: 'Username already taken' }] };
      }
      return { valid: true, errors: [] };
    },
    'blur'
  );
  
  forms.addValidation(this.blurForm, 'value', 
    forms.validators.required('Value is required'),
    'blur'
  );
  
  forms.addValidation(this.submitForm, 'name', 
    forms.validators.required('Name is required')
  );
  
  forms.addValidation(this.submitForm, 'email', 
    forms.validators.email('Invalid email')
  );
}

validateRequired() {
  forms.validate(this.requiredForm, 'username', this.requiredForm.username, this.requiredForm, 'manual');
}

resetRequired() {
  const field = forms.getFieldState(this.requiredForm, 'username');
  field.reset();
}

validateEmail() {
  forms.validate(this.emailForm, 'email', this.emailForm.email, this.emailForm, 'manual');
}

validateAsync() {
  forms.validate(this.asyncForm, 'username', this.asyncForm.username, this.asyncForm, 'manual');
}

submitFormTest() {
  const formState = forms.getFormState(this.submitForm);
  formState.submit(async (data) => {
    console.log('Form submitted:', data);
    return { success: true };
  });
}

resetSubmit() {
  const formState = forms.getFormState(this.submitForm);
  formState.reset();
}

resetField() {
  const field = forms.getFieldState(this.resetForm, 'value');
  field.reset();
}

resetWholeForm() {
  const formState = forms.getFormState(this.resetForm);
  formState.reset();
}

onDestroy() {
  forms.destroy(this.requiredForm);
  forms.destroy(this.emailForm);
  forms.destroy(this.asyncForm);
  forms.destroy(this.blurForm);
  forms.destroy(this.submitForm);
  forms.destroy(this.resetForm);
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

label {
  display: block;
  margin: 10px 0 5px 0;
}

input {
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 3px;
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

.error {
  color: #dc3545;
  margin: 5px 0;
}

.pending {
  color: #ffc107;
  margin: 5px 0;
}

.status {
  margin: 10px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 3px;
}
